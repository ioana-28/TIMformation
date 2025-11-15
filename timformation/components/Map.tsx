'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from 'react-leaflet'; 
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Project } from '../libs/ProjectList';
import timisoaraBoundary from '../src/data/timisoaraBorder.json';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/libs/supabase/client';
import pinCladire from './pictures/pin_cladire.png';

// --- Map Settings ---
const MAX_BOUNDS: [[number, number], [number, number]] = [
  [45.68, 21.05],
  [45.85, 21.40],
];
const MIN_ZOOM = 11;

// --- Fix Leaflet markers ---
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// --- Helper Components ---
function MapInvalidator() {
  const map = useMap(); 
  useEffect(() => { map.invalidateSize(); }, [map]); 
  return null; 
}
function MapResizeHandler({ isSidebarOpen }: { isSidebarOpen: boolean }) {
  const map = useMap(); 
  useEffect(() => {
      const timer = setTimeout(() => { map.invalidateSize(); }, 350);
      return () => clearTimeout(timer);
  }, [isSidebarOpen, map]); 
  return null; 
}

// --- Custom Pin ---
const customIcon = new L.Icon({
    iconUrl: pinCladire.src,
    iconSize: [80, 80], 
    iconAnchor: [40, 80], 
    popupAnchor: [0, -80] 
});

// --- GeoJSON Style ---
const geoJsonStyle = {
    color: "#2452a7ff",
    weight: 2,
    opacity: 1,
    fillColor: "#2452a7ff",
    fillOpacity: 0.12,
};

// --- Props ---
interface MapProps {
  center: [number, number];
  zoom: number;
  projects: Project[];
  isSidebarOpen: boolean;
  loading: boolean;
  openDetailsModal: (project: Project) => void;
  user?: User | null;
}

// --- Component ---
export default function ProjectMap({ center, zoom, projects, isSidebarOpen, loading, openDetailsModal, user }: MapProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const [comments, setComments] = useState<{[projectId: string]: Array<{user_email: string, text: string}>}>({});
  const [newComment, setNewComment] = useState("");
  const supabase = createClient();

  useEffect(() => { setHasMounted(true); }, [loading]);

  // Fetch comments from Supabase on mount
  useEffect(() => {
    async function fetchComments() {
      const { data } = await supabase.from('comments').select('*');
      if (data) {
        const grouped: {[projectId: string]: Array<{user_email: string, text: string}>} = {};
        data.forEach(c => {
          const pid = c.project_id;
          if (!grouped[pid]) grouped[pid] = [];
          grouped[pid].push({user_email: c.user_email, text: c.text});
        });
        setComments(grouped);
      }
    }
    fetchComments();
  }, [supabase]);

  const handleAddComment = async (projectId: number) => {
    if (!newComment.trim() || !user) return;

    const commentObj = { project_id: projectId, user_email: user.email, text: newComment };

    // Save in Supabase
    const { error } = await supabase.from('comments').insert([commentObj]);
    if (error) {
      console.error("Eroare la salvarea comentariului:", error.message);
      return;
    }

    // Update UI imediat
    setComments(prev => ({
      ...prev,
      [projectId]: [...(prev[projectId] || []), { user_email: user.email, text: newComment }]
    }));
    setNewComment("");
  };

  if (!hasMounted) {
    return (
      <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4f4f4' }}>
        Harta se încarcă...
      </div>
    );
  }

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      scrollWheelZoom
      style={{ height: '100%', width: '100%' }}
      maxBounds={MAX_BOUNDS}
      minZoom={MIN_ZOOM} 
      maxBoundsViscosity={0.9}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> | <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <MapInvalidator />
      <MapResizeHandler isSidebarOpen={isSidebarOpen} />
      <GeoJSON data={timisoaraBoundary as any} style={geoJsonStyle} />

      {projects.map(project => {
        if (!project.latitude || !project.longitude) return null;

        return (
          <Marker key={project.id} position={[project.latitude, project.longitude]} icon={customIcon}>
            <Popup>
              <div style={{ maxWidth: '250px' }}>
                <h4 style={{ margin: '0 0 5px 0' }}>{project.title} ({project.status})</h4>
                <p><strong>Locație:</strong> {project.location}</p>
                <p><strong>Proiectant:</strong> {project.designer}</p>

                <button 
                  onClick={() => openDetailsModal(project)}
                  style={{ padding: '5px 10px', backgroundColor: '#132186ff', color: 'white', border: 'none', borderRadius: '4px', marginTop: '5px' }}
                >
                  Vezi Detalii
                </button>

                {/* Comentarii */}
                <div style={{ marginTop: '10px' }}>
                  <h5>Comentarii:</h5>
                  {(comments[project.id] || []).map((c, idx) => (
                    <p key={idx}><strong>{c.user_email}:</strong> {c.text}</p>
                  ))}

                  {user && (
                    <div style={{ marginTop: '5px' }}>
                      <input 
                        type="text" 
                        value={newComment} 
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Scrie un comentariu..." 
                        style={{ width: "100%", padding: "5px", borderRadius: "5px" }}
                      />
                      <button 
                        onClick={() => handleAddComment(project.id)}
                        style={{ marginTop: "5px", padding: "5px 10px", borderRadius: "5px", backgroundColor: "#132186ff", color: "white", border: "none" }}
                      >
                        Trimite
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

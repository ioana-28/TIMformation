// timformation/components/ProjectMap.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from 'react-leaflet'; 
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Project } from './ProjectList';

// Import GeoJSON data (Ensure this path is correct)
import timisoaraBoundary from '../src/data/timisoaraBorder.json'; 


// --- 1. Map View Constraints ---
const MAX_BOUNDS: [[number, number], [number, number]] = [
  [45.68, 21.05], // SW Corner
  [45.85, 21.40], // NE Corner
];
const MIN_ZOOM = 11; 
// ------------------------------


// --- Fix for default marker icons (ESSENTIAL for Next.js) ---
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});
// ------------------------------------------------

// --- Helper Component to Force Map Redraw (Performance Fix) ---
function MapInvalidator() {
  const map = useMap(); 
  useEffect(() => { map.invalidateSize(); }, [map]); 
  return null; 
}

// --- Helper Component to Handle Sidebar Resizing (Fixes gray area) ---
interface ResizeHandlerProps { isSidebarOpen: boolean; }
function MapResizeHandler({ isSidebarOpen }: ResizeHandlerProps) {
    const map = useMap(); 
    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 350); 
        return () => clearTimeout(timer);
    }, [isSidebarOpen, map]); 
    return null; 
}
// ------------------------------------------

interface MapProps {
  center: [number, number]; zoom: number; projects: Project[]; isSidebarOpen: boolean;  loading: boolean;
  openDetailsModal: (project: Project) => void; 
}

// Custom Pin Icon (Assuming pin_cladire.png is in the same directory as this file)
import pinCladire from './pictures/pin_cladire.png'; 
const customIcon = new L.Icon({
    iconUrl: pinCladire.src,
    iconSize: [80, 80], 
    iconAnchor: [40, 80], 
    popupAnchor: [0, -80] 
});

// 💥 ADJUSTED STYLE FOR LIGHTER BLUE, THINNER CONTOUR 💥
const geoJsonStyle = {
    color: "#2452a7ff",      // Lighter Blue Accent
    weight: 2,             
    opacity: 1.0,          
    fillColor: "#2452a7ff",  
    fillOpacity: 0.12,       
};

const filterCityBoundary = (feature: any) => { 
    // Check if the feature has geometry
    if (!feature.geometry) {
        return false;
    }

    const geometryType = feature.geometry.type;

    // Only allow drawing Polygons and MultiPolygons (the boundaries).
    // Exclude 'Point' (the administrative center node)
    return geometryType === 'MultiPolygon' || geometryType === 'Polygon';
};

export default function ProjectMap({ center, zoom, projects, isSidebarOpen, openDetailsModal, loading }: MapProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, [loading]);

  if (!hasMounted) {
    return (
        <div 
            style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4f4f4' }}
        >
            Harta se încarcă... (Așteaptă montarea client-side)
        </div>
    );
  }

  // Render the MapContainer only when mounted
  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      scrollWheelZoom={true} 
      style={{ height: '100%', width: '100%' }}
      maxBounds={MAX_BOUNDS}
      minZoom={MIN_ZOOM} 
      maxBoundsViscosity={0.9} 
    >
      {/* Tile Layer: CartoDB Voyager */}
      <TileLayer
        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> | <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      <MapInvalidator /> 
      <MapResizeHandler isSidebarOpen={isSidebarOpen} /> 

      <GeoJSON data={timisoaraBoundary as any} style={geoJsonStyle} filter={filterCityBoundary} />

      {/* Loop through the projects to create markers */}
      {projects.map(project => {
        // Skip projects without valid coordinates
        if (!project.latitude || !project.longitude) {
          console.warn(`Project "${project.title}" missing coordinates, skipping marker`);
          return null;
        }
        return (
          <Marker 
            key={project.id} 
            position={[project.latitude, project.longitude]} 
            icon={customIcon}
          >
            <Popup>
              <div style={{ maxWidth: '200px' }}>
                <h4 style={{ margin: '0 0 5px 0' }}>{project.title} ({project.status})</h4>
                <p style={{ margin: '5px 0' }}><strong>Locație:</strong> {project.location}</p>
                <p style={{ margin: '5px 0' }}><strong>Proiectant:</strong> {project.designer}</p>
                 <button 
                    onClick={() => openDetailsModal(project)} // Trigger modal function
                    style={{ 
                      padding: '5px 10px', backgroundColor: '#132186ff', color: 'white', border: 'none', borderRadius: '4px', marginTop: '10px'
                    }}>
                  Vezi Detalii
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}

    </MapContainer>
  );
}
// timformation/components/ProjectMap.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'; // <-- Ensure useMap is imported
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- Fix for default marker icons (ESSENTIAL) ---
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});
// ------------------------------------------------

// --- Helper Component to Force Map Redraw ---
function MapInvalidator() {
  const map = useMap(); // Get access to the Leaflet map instance

  useEffect(() => {
    // This runs once when the map component mounts.
    // It tells Leaflet to measure its container size again, fixing rendering issues in Flexbox.
    map.invalidateSize();
  }, [map]); 

  return null; 
}
// ------------------------------------------

// Define the type of data we expect for a project
interface Project {
  id: number;
  name: string;
  status: string;
  designer: string;
  location: string;
  lat: number;
  lng: number;
}

// Define the component props
interface MapProps {
  center: [number, number]; 
  zoom: number;
  projects: Project[]; 
}

export default function ProjectMap({ center, zoom, projects }: MapProps) {
  // State to track if the component has mounted on the client
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Set state to true once the component has successfully mounted client-side
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    // Return a stable, loading placeholder during the mounting phase
    return (
        <div 
            style={{ 
                height: '100%', 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                backgroundColor: '#f4f4f4' 
            }}
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
      style={{ height: '100%', width: '100%' }} // Critical dimensions
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 💥 INTEGRATE THE FIX HERE 💥 */}
      <MapInvalidator /> 

      {/* Loop through the projects to create markers */}
      {projects.map(project => (
        <Marker 
          key={project.id} 
          position={[project.lat, project.lng]} 
        >
          <Popup>
            <div style={{ maxWidth: '200px' }}>
              <h4 style={{ margin: '0 0 5px 0' }}>**{project.name}** ({project.status})</h4>
              <p style={{ margin: '5px 0' }}>**Locație:** {project.location}</p>
              <p style={{ margin: '5px 0' }}>**Proiectant:** {project.designer}</p>
              <button style={{ 
                  padding: '5px 10px', 
                  backgroundColor: '#31708f', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px',
                  marginTop: '10px'
              }}>
                Vezi Detalii
              </button>
            </div>
          </Popup>
        </Marker>
      ))}

    </MapContainer>
  );
}
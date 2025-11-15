// timformation/components/ProjectMap.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from 'react-leaflet'; 
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import GeoJSON data (Ensure this path is correct: ../src/data/timisoaraBoundary.json)
import timisoaraBoundary from '../src/data/timisoaraBorder.json'; 


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

  useEffect(() => {
    // Forces the map to measure its container size again after the Flexbox layout stabilizes
    map.invalidateSize();
  }, [map]); 

  return null; 
}
// ------------------------------------------

// --- Types ---
interface Project {
  id: number;
  name: string;
  status: string;
  designer: string;
  location: string;
  lat: number;
  lng: number;
}

interface MapProps {
  center: [number, number]; 
  zoom: number;
  projects: Project[]; 
}

// 💥 ADJUSTED STYLE FOR DARKER, THICKER CONTOUR 💥
const geoJsonStyle = {
    color: "#000000",      // Set line color to black for maximum contrast
    weight: 5,               // Increased thickness
    opacity: 1.0,            // Fully opaque line
    fillColor: "#130852ff",  
    fillOpacity: 0.05,       // Very light fill color
};

// ------------------------------------------------

export default function ProjectMap({ center, zoom, projects }: MapProps) {
  // State to track if the component has mounted on the client (SSR Fix)
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
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
      {/* Tile Layer: CartoDB Voyager */}
      <TileLayer
        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> | <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {/* Integrate the performance fix */}
      <MapInvalidator /> 

      {/* GeoJSON Layer for City Contour (Now Darker) */}
      <GeoJSON data={timisoaraBoundary as any} style={geoJsonStyle} />

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
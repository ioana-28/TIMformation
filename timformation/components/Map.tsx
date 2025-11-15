// timformation/components/ProjectMap.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from 'react-leaflet'; 
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import GeoJSON data 
import timisoaraBoundary from '../src/data/timisoaraBorder.json'; 


// --- 1. Define Boundary Constraints ---
const MAX_BOUNDS: [[number, number], [number, number]] = [
  // South West Corner (Min Lat: 45.68, Min Lng: 21.05)
  [45.68, 21.05], 
  // North East Corner (Max Lat: 45.85, Max Lng: 21.40)
  [45.85, 21.40],
];
const MIN_ZOOM = 11; 
// ------------------------------------


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

// Border Style (Lighter Blue, Thinner)
const geoJsonStyle = {
    color: "#2452a7ff",      // Lighter Blue
    weight: 2,             
    opacity: 1.0,          
    fillColor: "#2452a7ff",  
    fillOpacity: 0.12,       
};

// Filter Function (allows all features to draw)
const filterCityBoundary = (feature: any) => {
    return true; 
};
// ------------------------------------------------

export default function ProjectMap({ center, zoom, projects }: MapProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
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
      style={{ height: '100%', width: '100%' }}

      // 💥 APPLIED BOUNDARY CONSTRAINTS 💥
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

      {/* GeoJSON Layer for City Contour */}
      <GeoJSON data={timisoaraBoundary as any} style={geoJsonStyle} filter={filterCityBoundary} />

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
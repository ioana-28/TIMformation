// timformation/components/ProjectMap.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from 'react-leaflet'; 
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import GeoJSON data (THIS FILE MUST CONTAIN THE COMPLEX OSM DATA)
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

// 💥 ADJUSTED STYLE: Navy Blue (Header color) and THINNER LINE (weight: 2) 💥
const geoJsonStyle = {
    color: "#739cc0ff",      // Navy Blue
    weight: 2,             // 🛠️ CHANGED: Reduced thickness to 2
    opacity: 1.0,          // Fully opaque line
    fillColor: "#130852ff",  
    fillOpacity: 0.08,     // Light fill
};

// ------------------------------------------------

// --- Filter Function (Kept intact to allow the boundary to draw) ---
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
      style={{ height: '100%', width: '100%' }} // Critical dimensions
    >
      {/* Tile Layer: CartoDB Voyager */}
      <TileLayer
        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> | <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {/* Integrate the performance fix */}
      <MapInvalidator /> 

      {/* GeoJSON Layer for City Contour (Navy and Thinner) */}
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
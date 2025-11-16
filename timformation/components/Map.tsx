// timformation/components/ProjectMap.tsx

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from 'react-leaflet'; 
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Project } from './ProjectList';

// 1. IMPORTUL GEOJSON
// Presupunând că 'timisoaraBorder.json' este în 'timformation/src/data/'
import timisoaraBoundary from '../src/data/timisoaraBorder.json'; 


// --- 2. MAPAREA FIȘIERELOR DE IMAGINE (SINTAXĂ CORECTATĂ Next.js: `import` în loc de `require()`) ---
// Acestea trebuie să fie importuri statice
import pin_cladire_1 from './pictures/pin_cladire_1.png'; 
import pin_drum_1 from './pictures/pin_drum_1.png'; 
import pin_pod_1 from './pictures/pin_pod_1.png'; 
import pin_piata_1 from './pictures/pin_piata_1.png'; 
import pin_vegetatie_1 from './pictures/pin_vegetatie_1.png';

import pin_cladire_2 from './pictures/pin_cladire_2.png'; 
import pin_drum_2 from './pictures/pin_drum_2.png'; 
import pin_pod_2 from './pictures/pin_pod_2.png'; 
import pin_piata_2 from './pictures/pin_piata_2.png'; 
import pin_vegetatie_2 from './pictures/pin_vegetatie_2.png';

import pin_cladire_3 from './pictures/pin_cladire_3.png'; 
import pin_drum_3 from './pictures/pin_drum_3.png'; 
import pin_pod_3 from './pictures/pin_pod_3.png'; 
import pin_piata_3 from './pictures/pin_piata_3.png'; 
import pin_vegetatie_3 from './pictures/pin_vegetatie_3.png';


const PIN_IMAGES = {
    // Stare 1: În Planificare
    'cladire_1': pin_cladire_1, 
    'drum_1': pin_drum_1, 
    'pod_1': pin_pod_1, 
    'piata_1': pin_piata_1, 
    'vegetatie_1': pin_vegetatie_1,
    
    // Stare 2: În Desfășurare
    'cladire_2': pin_cladire_2, 
    'drum_2': pin_drum_2, 
    'pod_2': pin_pod_2, 
    'piata_2': pin_piata_2, 
    'vegetatie_2': pin_vegetatie_2,
    
    // Stare 3: Finalizat
    'cladire_3': pin_cladire_3, 
    'drum_3': pin_drum_3, 
    'pod_3': pin_pod_3, 
    'piata_3': pin_piata_3, 
    'vegetatie_3': pin_vegetatie_3,
};
// ------------------------------------------------


// --- 3. Map View Constraints ---
const MAX_BOUNDS: [[number, number], [number, number]] = [
    [45.68, 21.05],
    [45.85, 21.40],
];
const MIN_ZOOM = 11; 
// ------------------------------


// --- Fix for default marker icons ---
// Notă: Modificarea directă a prototipului este necesară pentru a preveni căutarea relativă în Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});
// ------------------------------------------------
// Constante de Culoare noi
const BEIGE_DESCHIS = '#fcf8e3'; // Un bej foarte pal (aproape alb)
const BEIGE_INCHIS = '#d9b380';  // O nuanță mai profundă, dar caldă
const ALBASTRU_FINAL = '#a0c4ff'; // Un albastru deschis și plăcut

// Funcție Helper pentru culori adaptată să returneze BG și Text
const getStatusColor = (status: string | undefined): { bg: string, text: string } => {
    switch (status) {
        case 'Finalizat':
        case 'Completed':
            // 🟦 Finalizat: Albastru deschis
            return { bg: ALBASTRU_FINAL, text: '#00287a' }; 
            
        case 'În Planificare':
        case 'Planning':
            // 🟡 În Planificare: Bej Deschis
            return { bg: BEIGE_DESCHIS, text: '#8a6d3b' }; 
            
        case 'În Desfășurare':
        case 'In Progress':
            // 🟤 În Desfășurare: Bej Închis
            return { bg: BEIGE_INCHIS, text: '#333333' }; 
            
        default: 
            return { bg: '#f9f9f9', text: '#666' };
    }
};

// Mapare Stare (DB/UI) la Cifră (1, 2, 3)
const STATUS_TO_NUMBER = {
    'În Planificare': 1, 'Planning': 1, 
    'În Desfășurare': 2, 'In Progress': 2, 
    'Finalizat': 3, 'Completed': 3,
};
// ------------------------------------------------


// --- Helper Componente ---
function MapInvalidator() { 
    const map = useMap(); 
    // InvalidateSize la montare pentru a se asigura că harta ocupă spațiul containerului
    useEffect(() => { map.invalidateSize(); }, [map]); 
    return null; 
}
interface ResizeHandlerProps { isSidebarOpen: boolean; }
function MapResizeHandler({ isSidebarOpen }: ResizeHandlerProps) { 
    const map = useMap(); 
    useEffect(() => {
        // Un mic delay pentru a lăsa timp animației de sidebar să se termine
        const timer = setTimeout(() => { map.invalidateSize(); }, 350); 
        return () => clearTimeout(timer);
    }, [isSidebarOpen, map]); 
    return null; 
}


// LOGICĂ PENTRU CREAREA ICON-ULUI DINAMIC ȘI FALLBACK
const getDefaultIcon = () => new L.Icon({
    iconUrl: L.Icon.Default.imagePath + 'marker-icon.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const getCustomIcon = (project: Project) => {
    // Normalizare categoria (sau fallback la 'cladire')
    const projectCategory = project.category?.toLowerCase() || 'cladire'; 
    const projectStatus = project.status || 'Planning'; 
    
    // Obține numărul stării (sau 1 ca fallback)
    const statusNumber = STATUS_TO_NUMBER[projectStatus as keyof typeof STATUS_TO_NUMBER] || 1; 

    // Construiește cheia imaginii (ex: "cladire_2")
    const imageKey = `${projectCategory}_${statusNumber}` as keyof typeof PIN_IMAGES;
    
    const imageObject = PIN_IMAGES[imageKey];
    
    // Verifică dacă importul Next.js a returnat un obiect cu proprietatea `src`
    if (imageObject && (imageObject as any).src) { 
        // Folosește URL-ul imaginii prelucrate de Next.js
        return new L.Icon({
            iconUrl: (imageObject as any).src, 
            iconSize: [80, 80], 
            iconAnchor: [40, 80], 
            popupAnchor: [0, -80] 
        });
    }
    
    // Fallback la iconul standard Leaflet
    return getDefaultIcon();
};


// --- Restul Componentei (Stiluri și Render) ---

interface MapProps {
    center: [number, number]; zoom: number; projects: Project[]; isSidebarOpen: boolean;  loading: boolean;
    openDetailsModal: (project: Project) => void; 
}

const geoJsonStyle = {
    color: "#2452a7ff", weight: 2, opacity: 1.0, fillColor: "#2452a7ff", fillOpacity: 0.12, 
};
const filterCityBoundary = (feature: any) => { 
    if (!feature.geometry) { return false; }
    const geometryType = feature.geometry.type;
    return geometryType === 'MultiPolygon' || geometryType === 'Polygon';
};


export default function ProjectMap({ center, zoom, projects, isSidebarOpen, openDetailsModal, loading }: MapProps) {
    const [hasMounted, setHasMounted] = useState(false);

    // Folosim useEffect pentru a ne asigura că `MapContainer` este renderizat doar pe client
    useEffect(() => {
        setHasMounted(true);
    }, []); // Rulare o singură dată la montare

    // Memoizare pentru iconuri. Recalculare doar când lista de proiecte se schimbă.
    const memoizedIcons = useMemo(() => {
        const iconMap = new Map();
        for (const project of projects) {
            if (project.id) {
                iconMap.set(project.id, getCustomIcon(project));
            }
        }
        return iconMap;
    }, [projects]); 

    // Afișare mesaj de încărcare în faza de Server Side Rendering/hidratare
    if (!hasMounted) { 
        return (
            <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4f4f4' }}>
                🗺️ Harta se încarcă... (Așteaptă montarea client-side)
            </div>
        ); 
    }

    return (
        <MapContainer 
            key={projects.length} 
            center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}
            maxBounds={MAX_BOUNDS} minZoom={MIN_ZOOM} maxBoundsViscosity={0.9} 
        >
            <TileLayer
                attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> | <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            {/* Componente helper pentru a asigura redimensionarea corectă */}
            <MapInvalidator /> 
            <MapResizeHandler isSidebarOpen={isSidebarOpen} /> 

            {/* Afișare limita administrativă Timișoara */}
            <GeoJSON data={timisoaraBoundary as any} style={geoJsonStyle} filter={filterCityBoundary} />

            {/* Loop prin proiecte pentru a crea markerele */}
            {projects.map(project => {
                if (!project.latitude || !project.longitude || !project.id) {
                    // console.warn(`Project "${project.title ?? project.name}" missing critical data, skipping marker.`);
                    return null;
                }
                
                const dynamicIcon = memoizedIcons.get(project.id);
                
                return (
                    <Marker 
                        key={project.id} 
                        position={[project.latitude, project.longitude]} 
                        icon={dynamicIcon} 
                    >
                       <Popup>
    <div style={{ 
        maxWidth: '220px', 
        padding: '10px',
        fontFamily: 'Arial, sans-serif',
        color: '#333',
    }}>
        {/* Titlu și Stare */}
        <h4 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '16px', 
            fontWeight: '600', 
            borderBottom: '1px solid #eee', 
            paddingBottom: '5px' 
        }}>
            {project.title ?? project.name}
            
            {/* Badge pentru Stare */}
            <span style={{
                marginLeft: '8px',
                padding: '3px 6px',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: '700',
               
                backgroundColor: getStatusColor(project.status).bg, 
color: getStatusColor(project.status).text, // Funcție utilitară (vezi mai jos)
                verticalAlign: 'middle'
            }}>
                {project.status}
            </span>
        </h4>
        
        {/* Detalii Proiect */}
        <div style={{ fontSize: '12px', lineHeight: '1.5' }}>
            <p style={{ margin: '5px 0' }}>
                <strong style={{ color: '#007bff' }}>Locație:</strong> {project.location}
            </p>
            <p style={{ margin: '5px 0' }}>
                <strong style={{ color: '#007bff' }}>Proiectant:</strong> {project.designer}
            </p>
        </div>

        {/* Buton Detalii */}
        <button 
            onClick={() => openDetailsModal(project)} 
            style={{ 
                padding: '8px 12px', 
                backgroundColor: '#08205b', // Un albastru mai standard
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                marginTop: '15px', 
                cursor: 'pointer',
                width: '100%', // Ocupă lățimea maximă
                fontWeight: '600',
                transition: 'background-color 0.3s ease'
            }}
            // Dacă ați folosi o bibliotecă de stiluri, ați adăuga un efect hover.
        >
            Vezi Detalii Complete
        </button>
    </div>
</Popup>
                    </Marker>
                );
            })}

        </MapContainer>
    );
}
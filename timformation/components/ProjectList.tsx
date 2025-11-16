// timformation/components/ProjectList.tsx

'use client'; 

import { useState, useMemo } from 'react';
import React from 'react'; 


export interface Project {
    id: number;
    title: string;
    name?: string;
    designer?: string;
    location: string;
    beneficiary?: string; 
    status: string; // <-- Termenul din baza de date (ex: 'In Progress')
    total_value?: number;
    realization_duration_months?: number;
    execution_duration_months?: number;
    latest_decision_url?: string;
    latest_change?: string;
    category?: string;
    description?: string; 
    latitude: number;
    longitude: number;
    updated_at: string;
    created_at: string;
}

interface ProjectListProps {
    isOpen: boolean; 
    onProjectClick: (project: Project) => void; 
    projects: Project[]; // Lista de proiecte FILTRATĂ primită de la MainLayout
    loading: boolean;

    // 🚨 NOU: Funcțiile pentru a trimite valoarea filtrului la părinte
    setSearchTerm: (term: string) => void;
    setStatusFilter: (status: string) => void;

    // 🚨 NOU: Valoarea curentă a input-urilor (pentru a le controla)
    currentSearchTerm: string;
    currentStatusFilter: string;
}


// --- 1. Maparea Stărilor și Opțiuni Filtre ---
// Folosim această mapare pentru a traduce termenii DB în etichete UI (RO)

const STATUS_OPTIONS_RO = ['Toate', 'In Planificare', 'In Desfasurare', 'Finalizat'];


// --- 2. Coordonare Culori Status ---
const getStatusColor = (statusRo: string) => { 
    switch (statusRo) {
        case 'Finalizat':
            return { bg: '#a0c4ff', text: '#00287a' }; 
        case 'În Planificare':
            return { bg: '#fcf8e3', text: '#8a6d3b' }; 
        case 'În Desfășurare':
            return { bg: '#d9b380', text: '#333333' }; 
        default: 
            return { bg: '#f9f9f9', text: '#666' };
    }
};

// --- 3. Stiluri de Bază ---
const ACCENT_TEXT_DARK = '#0e0226ff'; 
const DIVIDER_COLOR = '#e0e0e0'; 
const NEUTRAL_BORDER_LIGHT = '#bbb'; 

const listContainerBaseStyle: React.CSSProperties = {
    backgroundColor:'#e3eaf5ff', 
    height: '100%',
    overflowY: 'auto', 
    transition: 'width 0.3s ease-in-out, min-width 0.3s ease-in-out, padding 0.3s ease-in-out',
};

const searchContainerStyle: React.CSSProperties = {
    padding: '10px 0',
    borderBottom: `1px solid ${DIVIDER_COLOR}`, 
    marginBottom: '10px',
    color: '#333',
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    border: `1px solid ${NEUTRAL_BORDER_LIGHT}`, 
    borderRadius: '8px', 
    boxSizing: 'border-box', 
    fontSize: '1em',
    color: ACCENT_TEXT_DARK,
};


// --- 4. Main Component ---
export default function ProjectList({ 
    isOpen, onProjectClick, projects, loading,
    setSearchTerm, setStatusFilter, currentSearchTerm, currentStatusFilter 
}: ProjectListProps) {


    const finalContainerStyle: React.CSSProperties = {
        ...listContainerBaseStyle,
        
        width: isOpen ? '350px' : '0',
        minWidth: isOpen ? '350px' : '0',
        padding: isOpen ? '15px 10px' : '0',
        
        overflowY: isOpen ? 'auto' : 'hidden',
        pointerEvents: isOpen ? 'auto' : 'none', 
    };

    return (
        <aside style={finalContainerStyle}>
            {isOpen && (<>
                <div style={{ padding: '0 10px' }}>
                    <h3 style={{ 
                        margin: 0, 
                        paddingBottom: '5px', 
                        borderBottomWidth: '1px', 
                        borderBottomStyle: 'solid',
                        borderBottomColor: '#00287a',
                        color: '#00287a',
                        fontWeight: '700'
                    }}>
                        Toate Proiectele 
                    </h3>
        
                    <p style={{ margin: '5px 0 10px 0', fontSize: '0.9em', color: '#00287a' }}>
                        {projects.length} proiecte găsite
                    </p>

                    <hr style={{ borderTop: `1px solid ${DIVIDER_COLOR}`, margin: '0 0 15px 0', border: 'none' }} />
                </div>

                <div style={{ marginBottom: '15px', padding: '0 10px' }}>
                    <label htmlFor="status-filter" style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#555' }}>
                        Filtrare după Stare:
                    </label>
                    <select
                        id="status-filter"
                        value={currentStatusFilter} // Folosește starea curentă din prop-uri
                        onChange={(e) => setStatusFilter(e.target.value)} // Trimite schimbarea la MainLayout
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: `1px solid blue`,
                            borderRadius: '8px',
                            boxSizing: 'border-box',
                            fontSize: '1em',
                            backgroundColor: 'white',
                            color: 'gray'
                        }}
                    >
                        {STATUS_OPTIONS_RO.map(status => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                            ))}
                    </select>
                </div>
                    
                <div style={searchContainerStyle}>
                    <input
                        type="text"
                        placeholder="Căutare proiecte..."
                        value={currentSearchTerm} // Folosește starea curentă din prop-uri
                        onChange={(e) => setSearchTerm(e.target.value)} // Trimite schimbarea la MainLayout
                        style={inputStyle} 
                        />
                </div>
                    
                <div style={{ padding: '0 10px' }}>
                    {loading ? (
                        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>Se încarcă proiectele...</p>
                    ) : (
                        projects.map(project => {
                            // Conversia stării din DB la starea UI (pentru afișare/culori)
                            const projectStatusRo = project.status ; 
                            const statusStyle = getStatusColor(projectStatusRo); 
                                
                            return (
                                <div 
                                    key={project.id}
                                    onClick={() => onProjectClick(project)} 
                                    style={{ 
                                        borderWidth: '1px', borderStyle: 'solid', borderColor: '#ddd', 
                                        padding: '15px', marginBottom: '10px', 
                                        backgroundColor: '#ffffff', 
                                        borderRadius: '10px', 
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                                        transition: 'transform 0.2s ease-in-out', 
                                        cursor: 'pointer', 
                                        width: '100%',
                                        boxSizing: 'border-box'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                    
                                    <h4 style={{ margin: '0 0 5px 0', color: ACCENT_TEXT_DARK }}>{project.title ?? project.name}</h4>
                                    <span 
                                        style={{ 
                                            backgroundColor: statusStyle.bg, 
                                            color: statusStyle.text,
                                            padding: '3px 8px', 
                                            fontSize: '0.85em', 
                                            borderRadius: '15px', 
                                            fontWeight: '600', 
                                            marginBottom: '10px', 
                                            display: 'inline-block'
                                        }}
                                    >
                                        {/* AFIȘEAZĂ STAREA EXACT DIN BAZA DE DATE */}
                                        {project.status}
                                    </span>

                                    <hr style={{ border: 'none', borderTop: '1px dashed #eee', margin: '10px 0' }} />

                                    <p style={{ margin: '3px 0', fontSize: '0.9em', color: ACCENT_TEXT_DARK }}>
                                        <span style={{ fontWeight: 'bold', color: '#555' }}>Proiectant:</span> {project.designer}
                                    </p>

                                    <p style={{ margin: '3px 0', fontSize: '0.9em', color: ACCENT_TEXT_DARK }}>
                                        <span style={{ fontWeight: 'bold', color: '#555' }}>Locație:</span> {project.location}
                                    </p>
                                        
                                    <p style={{ margin: '10px 0 0 0', fontSize: '0.9em', color: '#666' }}>
                                        {project.description}
                                    </p>
                                </div>
                            );
                        })
                    )}
                    {projects.length === 0 && !loading && (
                        <p style={{ color: '#999', textAlign: 'center', marginTop: '20px' }}>
                            Niciun proiect găsit corespunzător căutării &apos;{currentSearchTerm}&apos;.
                        </p>
                    )}
                </div>
                    
            </>)}
        </aside>
    );
}
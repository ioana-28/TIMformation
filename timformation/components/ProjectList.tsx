// timformation/components/ProjectList.tsx

'use client'; 

// `createClient` removed: this component receives projects from parent
import { useState, useEffect, useMemo } from 'react';
import React from 'react'; 



export interface Project {
    id: number;
    title: string;
    name?: string;
    designer?: string;
    location: string;
    beneficiary?: string;  
    status: string;
    total_value?: number;
    realization_duration_months?: number;
    execution_duration_months?: number;
    latest_decision_url?: string;
    latest_change?: string;
    category?: string;
    description?: string;
    latitude: number;
    longitude: number;
}

interface ProjectListProps {
    isOpen: boolean; 
    onProjectClick: (project: Project) => void; 
    projects: Project[];
    loading: boolean;
}


// --- 1. Constants and Style Definitions ---
const listContainerBaseStyle: React.CSSProperties = {
    backgroundColor: '#f7f7f7', 
    height: '100%',
    overflowY: 'auto', 
    transition: 'width 0.3s ease-in-out, min-width 0.3s ease-in-out, padding 0.3s ease-in-out',
};

const searchContainerStyle: React.CSSProperties = {
    padding: '10px 0',
    borderBottom: '1px solid #e0e0e0', 
    marginBottom: '10px',
    color: '#333',
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc', 
    borderRadius: '8px', 
    boxSizing: 'border-box', 
    fontSize: '1em',
    color: '#0e0226ff',
};

const STATUS_OPTIONS = ['All', 'In Progress', 'Planning', 'Completed'];



// --- 2. Coordinated Color Helpers ---
const getStatusColor = (status: string) => {
    switch (status) {
        case 'Completed': return { bg: '#dcf8e5', text: '#3c763d' }; 
        case 'Planning': return { bg: '#f0e0d0', text: '#8a6d3b' }; 
        case 'In Progress': return { bg: '#cce5ff', text: '#31708f' }; 
        default: return { bg: '#f9f9f9', text: '#666' };
    }
};

// --- 3. Mock Data with Coordinates and Details (EXPORTED) ---
export const MOCK_PROJECTS: Project[] = [
    { 
        id: 1, name: 'Downtown Bridge Renovation', status: 'In Progress', designer: 'Global Engineering SRL', location: 'Piața Unirii, Timișoara', description: 'Complete renovation of the historic downtown bridge including structural reinforcement and accessibility improvements.',
        lat: 45.7565, lng: 21.2290,
    },
    { 
        id: 2, name: 'Central Park Playground', status: 'Planning', designer: 'EcoDesign Proiect', location: 'Parcul Central, Bld. Victoriei', description: 'New modern playground with accessible equipment and safety surfacing.',
        lat: 45.7530, lng: 21.2170,
    },
    { 
        id: 3, name: 'Fifth Avenue Sidewalk Repairs', status: 'In Progress', designer: 'Construct TM Vest', location: 'Aleea 5-a, Cartier Nord', description: 'Repair and modernization of pedestrian walkways and accessibility ramps.',
        lat: 45.7650, lng: 21.2250,
    },
    { 
        id: 4, name: 'Timișoara Main Road Paving', status: 'In Progress', designer: 'Drumuri Moderne SA', location: 'Calea Șagului (Sector 3)', description: 'Full repaving and expansion of the main traffic artery.',
        lat: 45.7350, lng: 21.2200,
    },
    { 
        id: 5, name: 'New City Hall Annex', status: 'Completed', designer: 'Arhitectură & Spațiu', location: 'Str. Gării 1', description: 'Construction of a new administrative building.',
        lat: 45.7600, lng: 21.2100,
    },
];

// --- 4. Main Component ---
export default function ProjectList({ isOpen, onProjectClick, projects, loading }: ProjectListProps) {

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');


    // Filter projects using the fetched data and the search term
    const filteredProjects = useMemo(() => {
        if (loading) return [];

        const term = searchTerm.toLowerCase();

        return projects.filter((project) => {
            // support either `title` or legacy/mock `name` field
            const matchesSearch =
                project.title.toLowerCase().includes(term) ||
                ((project.location ?? '') as string).toLowerCase().includes(term) ||
                ((project.designer ?? '') as string).toLowerCase().includes(term);

            const matchesStatus = statusFilter === 'All' || project.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [projects, searchTerm, loading, statusFilter]);
   
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
                        paddingBottom: '5px', // Space above the line
                        // CORRECTED SYNTAX: width style color
                        borderBottom: '1px solid #c7c7c7' 
                    }}>
                        All Projects
                    </h3>
            
                    <p style={{ margin: '5px 0 10px 0', fontSize: '0.9em', color: '#666' }}>
                        {filteredProjects.length} projects found
                    </p>

                    <hr style={{ borderTop: '1px solid #e0e0e0', margin: '0 0 15px 0' }} />
                </div>

                   

                <div style={searchContainerStyle}>
                    <input
                        type="text"
                        placeholder="Search projects by name, location, or designer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={inputStyle}     
                        />
                </div>

                <div style={{ marginBottom: '15px', padding: '0 10px' }}>
                    <label htmlFor="status-filter" style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#555' }}>
                        Filter by Status:
                    </label>
                    <select
                        id="status-filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            boxSizing: 'border-box',
                            fontSize: '1em',
                            backgroundColor: 'white',
                        }}
                    >
                        {STATUS_OPTIONS.map(status => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                            ))}
                    </select>
                </div>
                    
                <div style={{ padding: '0 10px' }}>
                    {filteredProjects.map(project => {
                        const statusStyle = getStatusColor(project.status); 
                            
                        return (
                            <div 
                                key={project.id}
                                onClick={() => onProjectClick(project)} 
                                style={{ 
                                        // Rounded card styling
                                    border: '1px solid #ddd', 
                                    padding: '15px', 
                                    marginBottom: '10px', 
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
                
                                <h4 style={{ margin: '0 0 5px 0' }}>{project.title ?? project.name}</h4>
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
                                        {project.status}
                                </span>

                                    {/* Separator line (Fixed style conflict) */}
                                    <hr 
                                        style={{ 
                                            border: 'none', 
                                            borderTop: '1px dashed #eee', 
                                            margin: '10px 0' 
                                        }} 
                                    />

                                {/* Proiectant */}
                                <p style={{ margin: '3px 0', fontSize: '0.9em' }}>
                                    <span style={{ fontWeight: 'bold', color: '#555' }}>Proiectant:</span> {project.designer}
                                </p>

                                <p style={{ margin: '3px 0', fontSize: '0.9em' }}>
                                    <span style={{ fontWeight: 'bold', color: '#555' }}>Locație:</span> {project.location}
                                </p>
                                    
                                    {/* Description (short) */}
                                    <p style={{ margin: '10px 0 0 0', fontSize: '0.9em', color: '#666' }}>
                                        {project.description}
                                    </p>
                                </div>
                            );
                        })}
                    {filteredProjects.length === 0 && (
                        <p style={{ color: '#999', textAlign: 'center', marginTop: '20px' }}>
                            No projects found matching &apos;{searchTerm}&apos;.
                        </p>
                    )}
                </div>
                    
            </>
            )}
        </aside>
    );
}
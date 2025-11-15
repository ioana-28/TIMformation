

'use client'; 

import { createClient } from '@/libs/supabase/client';
import { useState } from 'react';
import React from 'react'; 


interface ProjectListProps {
    isOpen: boolean; 
}


const listContainerBaseStyle: React.CSSProperties = {
    
    backgroundColor: '#a09b9a',
    height: '100%',
    overflowY: 'auto', 
    
  
    transition: 'width 0.3s ease-in-out, min-width 0.3s ease-in-out, padding 0.3s ease-in-out',
};


const searchContainerStyle: React.CSSProperties = {
    padding: '10px 0',
    borderBottom: '1px solid #0f0f1bff',
    marginBottom: '10px',
    color: '#333',
};


const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    border: '1px solid #000000ff',
    borderRadius: '5px',
    boxSizing: 'border-box', 
    fontSize: '1em',
};


const MOCK_PROJECTS = [
    { id: 1, name: 'Downtown Bridge Renovation', status: 'In Progress' },
    { id: 2, name: 'Central Park Playground', status: 'Planning' },
    { id: 3, name: 'Fifth Avenue Sidewalk Repairs', status: 'In Progress' },
    { id: 4, name: 'Timișoara Main Road Paving', status: 'In Progress' },
    { id: 5, name: 'New City Hall Annex', status: 'Completed' },
];



export default function ProjectList({ isOpen }: ProjectListProps) {

    const [searchTerm, setSearchTerm] = useState('');

    const filteredProjects = MOCK_PROJECTS.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

   
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
            {isOpen && (
                <>
                    
                    <div style={{ padding: '0 10px' }}>
                        <h3 style={{ margin: 0 }}>All Projects</h3>
                        <p style={{ margin: '5px 0 10px 0', fontSize: '0.9em', color: '#8c7373ff' }}>
                            {filteredProjects.length} projects found
                        </p>
                    </div>

                  
                    <div style={searchContainerStyle}>
                        <input
                            type="text"
                            placeholder="Search projects by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    
                    <div style={{ padding: '0 10px' }}>
                        {filteredProjects.map(project => (
                            
                            <div 
                                key={project.id}
                                style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', backgroundColor: '#efeae9ff', borderRadius: '4px' }}
                            >
                                <h4 style={{ margin: '0 0 5px 0' }}>{project.name}</h4>
                                <span style={{ backgroundColor: project.status === 'Completed' ? '#d4edda' : '#f9e6a0', padding: '3px 6px', fontSize: '0.8em', borderRadius: '3px' }}>
                                    {project.status}
                                </span>
                            </div>
                        ))}
                        {filteredProjects.length === 0 && (
                            <p style={{ color: '#999', textAlign: 'center', marginTop: '20px' }}>
                                No projects found matching '{searchTerm}'.
                            </p>
                        )}
                    </div>
                </>
            )}
        </aside>
    );
}
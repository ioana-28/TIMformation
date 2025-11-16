'use client';

import React, { useState, useEffect } from 'react';
import Header from './Header';
import ProjectList from './ProjectList';
import { createClient } from '@/libs/supabase/client';
import ProjectDetailsModal from './ProjectDetailsModal'; 
import type { Project } from './ProjectList';
import dynamic from 'next/dynamic';

// Dynamic Map Import: Uses MapComponent name
const MapComponent = dynamic(() => import('./Map'), { ssr: false }); 


// --- Style Definitions (Rămân neschimbate) ---
const pageContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh', 
  overflow: 'hidden', 
};
const contentAreaStyle: React.CSSProperties = {
    display: 'flex',
    flexGrow: 1, 
    overflow: 'hidden', 
};
const mapContainerStyle: React.CSSProperties = { 
    flexGrow: 1, 
    minWidth: 0, 
    height: '100%', 
    position: 'relative',
    transition: 'flex-grow 0.3s ease-in-out', 
};

// Maparea stărilor DB la cele din UI pentru filtrare
const STATUS_DB_TO_UI_MAP = {
    'In Progress': 'În Desfășurare',
    'Planning': 'În Planificare',
    'Completed': 'Finalizat',
};


export default function MainLayout({ children }: { children?: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]); // Toate proiectele din DB
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState<Project | null >(null);
    
    // 🚨 STĂRILE DE FILTRARE SUNT MUTATE AICI 🚨
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Toate'); // 'Toate' este opțiunea implicită RO

    const supabase = createClient();


    useEffect(() => {
        async function fetchProjects() {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('projects') 
                .select('*'); 
  
            if (error) {
                console.error('Error fetching projects:', error);
            } else if (data) {
                setProjects(data as Project[]);
            }
            setIsLoading(false);
        }
  
        fetchProjects();
    }, []); 
    
    // 🚨 LOGICA DE FILTRARE CENTRALĂ (Se aplică pe lista projects) 🚨
    const filteredProjects = projects.filter(project => {
        const term = searchTerm.toLowerCase();
        
        // 1. Conversia stării DB la eticheta UI pentru filtrare (ex: 'In Progress' -> 'În Desfășurare')
        const projectStatusRo = STATUS_DB_TO_UI_MAP[project.status as keyof typeof STATUS_DB_TO_UI_MAP] || project.status; 

        // 2. Filtrare după termenul de căutare
        const titleOrName = project.title || project.name || ''; 
        const matchesSearch =
            titleOrName.toLowerCase().includes(term) ||
            ((project.location ?? '') as string).toLowerCase().includes(term) ||
            ((project.designer ?? '') as string).toLowerCase().includes(term);

        // 3. Filtrare după statusul selectat în UI
        const matchesStatus = statusFilter === 'Toate' || projectStatusRo === statusFilter;

        return matchesSearch && matchesStatus;
    });


    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
  
    const openDetailsModal = (project: Project) => {
        setSelectedProject(project);
    };
  
    const closeDetailsModal = () => {
        setSelectedProject(null);
    };
  
    return (
        <div style={pageContainerStyle}>
            <Header onMenuToggle={toggleSidebar} isOpen={isSidebarOpen} /> 

            <div style={contentAreaStyle}>
                
                {/* 🚨 LISTA PRIMEȘTE SETTER-ELE ȘI DATELE FILTRATE 🚨 */}
                <ProjectList 
                    isOpen={isSidebarOpen} 
                    projects={filteredProjects} // Trimite lista FILTRATĂ
                    loading={isLoading} 
                    onProjectClick={openDetailsModal} 
                    
                    // Funcții de setare pentru a actualiza state-ul central
                    setSearchTerm={setSearchTerm} 
                    setStatusFilter={setStatusFilter} 
                    currentSearchTerm={searchTerm} // Trimite valoarea curentă înapoi la input
                    currentStatusFilter={statusFilter}
                />
                
                {selectedProject && (
                    <ProjectDetailsModal project={selectedProject} onClose={closeDetailsModal} />
                )}
                
                {/* 🚨 HARTA PRIMEȘTE DE ASEMENEA DATELE FILTRATE 🚨 */}
                <div style={mapContainerStyle}>
                    <MapComponent 
                        center={[45.7538, 21.2257]} // Centrare pe oraș
                        zoom={13} 
                        projects={filteredProjects} // Trimite lista FILTRATĂ
                        loading={isLoading} 
                        openDetailsModal={openDetailsModal} 
                        isSidebarOpen={isSidebarOpen} 
                    />
                    {children}
                </div>
            </div>
        </div>
    );
}
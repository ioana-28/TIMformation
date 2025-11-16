'use client';

import React, { useState, useEffect } from 'react';
import Header from './Header';
import ProjectList from './ProjectList';
import { createClient } from '@/libs/supabase/client';
import ProjectDetailsModal from './ProjectDetailsModal'; 
import type { Project } from './ProjectList';

import { User } from '@supabase/supabase-js';

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
   const [projects, setProjects] = useState<Project[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [selectedProject, setSelectedProject] = useState<Project | null >(null);
   const [user, setUser] = useState<User | null>(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Toate'); // 'Toate' este opțiunea implicită RO
   

   const supabase = createClient();

   useEffect(() => {
    const sessionUser = supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
       const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);


  useEffect(() => {
          async function fetchProjects() {
              setIsLoading(true);
              const { data, error } = await supabase
                  .from('projects') 
                  .select('*'); 
  
              if (error) {
                  console.error('Error fetching projects:', error);
              } else if (data) {
                  console.log('✅ Successfully fetched project data:', data);
                  setProjects(data as Project[]);
              }
              setIsLoading(false);
          }
  
          fetchProjects();
      }, []); 

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
    // Ensures we pass the full project object including description
    setSelectedProject(project);
  };
  
  // Function to close the modal
  const closeDetailsModal = () => {
    setSelectedProject(null);
  };
  
  return (
    <div style={pageContainerStyle}>
        <Header onMenuToggle={toggleSidebar} isOpen={isSidebarOpen} user={user} supabase={supabase} /> 

      <div style={contentAreaStyle}>
        <ProjectList isOpen={isSidebarOpen} 
          projects={filteredProjects} 
          loading={isLoading} 
          onProjectClick={openDetailsModal} 
          setSearchTerm={setSearchTerm} 
          setStatusFilter={setStatusFilter} 
          currentSearchTerm={searchTerm} // Trimite valoarea curentă înapoi la input
         currentStatusFilter={statusFilter}
          />
         {selectedProject && (
                 <ProjectDetailsModal project={selectedProject} onClose={closeDetailsModal} />
             )}
        <div style={mapContainerStyle}>
          <Map center={[45.7560, 21.2310]} zoom={13} projects={filteredProjects} loading={isLoading} openDetailsModal={openDetailsModal} isSidebarOpen={isSidebarOpen}  />
          {children}
        </div>
    );
}
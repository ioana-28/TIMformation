'use client';

import React, { useState, useEffect } from 'react';
import Header from './Header';
import ProjectList from '../libs/ProjectList';
import { createClient } from '@/libs/supabase/client';
import ProjectDetailsModal from './ProjectDetailsModal'; 
import type { Project } from '../libs/ProjectList';
import dynamic from 'next/dynamic';
import { User } from '@supabase/supabase-js';

const Map = dynamic(() => import('./Map'), { ssr: false });

export default function MainLayout({ children }: { children?: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [user, setUser] = useState<User | null>(null); // 🔹 starea user

  const supabase = createClient();

  // 🔹 Când se încarcă pagina, vedem dacă e user logat
  useEffect(() => {
    const sessionUser = supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Ascultăm la schimbarea sesiunii
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchProjects() {
      setIsLoading(true);
      const { data, error } = await supabase.from('projects').select('*'); 
      if (error) console.error('Error fetching projects:', error);
      else if (data) setProjects(data as Project[]);
      setIsLoading(false);
    }
    fetchProjects();
  }, []); 

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const openDetailsModal = (project: Project) => setSelectedProject(project);
  const closeDetailsModal = () => setSelectedProject(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header onMenuToggle={toggleSidebar} isOpen={isSidebarOpen} user={user} supabase={supabase} />

      <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <ProjectList
          isOpen={isSidebarOpen}
          projects={projects}
          loading={isLoading}
          onProjectClick={openDetailsModal}
        />

        {selectedProject && (
          <ProjectDetailsModal project={selectedProject} onClose={closeDetailsModal} />
        )}

        <div style={{ flexGrow: 1, minWidth: 0, height: '100%', position: 'relative', transition: 'flex-grow 0.3s ease-in-out' }}>
          <Map
            center={[45.7560, 21.2310]}
            zoom={13}
            projects={projects}
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

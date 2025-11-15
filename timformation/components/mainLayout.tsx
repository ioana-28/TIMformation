'use client';

import React, { useState, useEffect } from 'react';
import Header from './Header';
import ProjectList from './ProjectList';
import { createClient } from '@/libs/supabase/client';

import type { Project } from './ProjectList';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./Map'), { ssr: false });

'use client'; 
import React, { useState } from 'react'; 
import Header from './Header'; 
import ProjectList, { Project, MOCK_PROJECTS } from './ProjectList'; // Import Project type and data
import ProjectDetailsModal from './ProjectDetailsModal'; 

// --- Style Definitions ---
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

// Define the children render prop type
interface MainLayoutProps {
    children: (isSidebarOpen: boolean, openDetailsModal: (project: Project) => void) => React.ReactNode; 
}
export default function MainLayout({ children }: { children?: React.ReactNode }) {
   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
   const [projects, setProjects] = useState<Project[]>([]);
   const [isLoading, setIsLoading] = useState(true);

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
                  console.log('✅ Successfully fetched project data:', data);
                  setProjects(data as Project[]);
              }
              setIsLoading(false);
          }
  
          fetchProjects();
      }, []);

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null); 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Function to open the modal
  const openDetailsModal = (project: Project) => {
    // Ensures we pass the full project object including description
    const fullProject = MOCK_PROJECTS.find(p => p.id === project.id) || project;
    setSelectedProject(fullProject);
  };
  
  // Function to close the modal
  const closeDetailsModal = () => {
    setSelectedProject(null);
  };
  
  return (
    <div style={pageContainerStyle}>
        <Header onMenuToggle={toggleSidebar} isOpen={isSidebarOpen} /> 

        <div style={contentAreaStyle}>

            <ProjectList isOpen={isSidebarOpen} onProjectClick={openDetailsModal} /> 

            {/* Execute the children function, passing the state and the click handler */}
            <div style={mapContainerStyle}>
                {children(isSidebarOpen, openDetailsModal)} 
            </div>
            
            {/* MODAL RENDERED HERE */}
            {selectedProject && (
                <ProjectDetailsModal project={selectedProject} onClose={closeDetailsModal} />
            )}

      <div style={contentAreaStyle}>
        <ProjectList isOpen={isSidebarOpen} projects={projects} loading={isLoading}/>
        <div style={mapContainerStyle}>
          <Map center={[45.7560, 21.2310]} zoom={13} projects={projects} loading={isLoading} />
          {children}
        </div>
    </div>
  );


  // FORM LOGIC - TO BE IMPLEMENTED
  // const [form, setForm] = useState({
  //   title: '',
  //   designer: '',
  //   location: '',
  //   beneficiary: '',
  //   status: 'în derulare',
  //   totalValue: '',
  //   realizationDurationMonths: '',
  //   executionDurationMonths: '',
  //   latestDecisionUrl: '',
  //   latestChange: '',
  //   category: '',
  // });

  // const [submitting, setSubmitting] = useState(false);
  // const [message, setMessage] = useState<string | null>(null);

  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  // ) => {
  //   const { name, value } = e.target;
  //   setForm((prev) => ({ ...prev, [name]: value }));
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setSubmitting(true);
  //   setMessage(null);

  //   const payload = {
  //     ...form,
  //     totalValue: form.totalValue ? Number(form.totalValue) : undefined,
  //     realizationDurationMonths: form.realizationDurationMonths
  //       ? Number(form.realizationDurationMonths)
  //       : undefined,
  //     executionDurationMonths: form.executionDurationMonths
  //       ? Number(form.executionDurationMonths)
  //       : undefined,
  //   };

  //   const res = await fetch('/api/projects', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(payload),
  //   });

  //   const data = await res.json();

  //   if (!res.ok) {
  //     setMessage(`Error: ${data.error || 'something went wrong'}`);
  //   } else {
  //     setMessage('Project added successfully!');
  //   }

  //   setSubmitting(false);
  // };

  
}

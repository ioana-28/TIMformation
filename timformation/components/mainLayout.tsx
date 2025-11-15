'use client';

import React, { useState, useEffect } from 'react';
import Header from './Header';
import ProjectList from './ProjectList';
import { createClient } from '@/libs/supabase/client';

import type { Project } from './ProjectList';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./Map'), { ssr: false });


const pageContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  overflow: 'hidden',
};

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

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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

  return (
    <div style={pageContainerStyle}>
      <Header onMenuToggle={toggleSidebar} isOpen={isSidebarOpen} />

      <div style={contentAreaStyle}>
        <ProjectList isOpen={isSidebarOpen} projects={projects} loading={isLoading}/>
        <div style={mapContainerStyle}>
      
          {children}
        </div>
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

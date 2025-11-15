// timformation/app/page.tsx

'use client'; 
import dynamic from 'next/dynamic'; 
import MainLayout from '@/components/mainLayout';
// 🚨 FIX: Import the Project interface here 🚨
import { MOCK_PROJECTS, Project } from '@/components/ProjectList'; 
import React from 'react';

// Define center coordinates (for starting in the center)
const TIMISOARA_CENTER: [number, number] = [45.7538, 21.2257]; 
const INITIAL_ZOOM = 14; 

// Dynamic Import: Load the map only on the client, disable SSR
const DynamicProjectMap = dynamic(
  () => import('@/components/Map'), // Assuming ProjectMap is the file name
  { 
    ssr: false, 
    loading: () => <p style={{ padding: '20px', textAlign: 'center' }}>Harta se încarcă...</p>
  }
);


export default function Home() {
  return (
    <MainLayout>
      {/* Capture the state AND the new openDetailsModal function, now with correct Project[] type */}
      {(isSidebarOpen: boolean, openDetailsModal: any, filteredProjects: Project[]) => (
        <DynamicProjectMap 
          center={TIMISOARA_CENTER} 
          zoom={INITIAL_ZOOM} 
          projects={filteredProjects} 
          isSidebarOpen={isSidebarOpen} 
          openDetailsModal={openDetailsModal} 
        />
      )}
    </MainLayout>
  );
}
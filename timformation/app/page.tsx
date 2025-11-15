// timformation/app/page.tsx

'use client'; 
import dynamic from 'next/dynamic'; 
// 🚨 FINAL FIX: Use the file path that matches your disk casing (lowercase 'mainLayout')
import MainLayout from '@/components/mainLayout'; 
import { MOCK_PROJECTS } from '@/components/ProjectList'; 
import React from 'react';

// Define center coordinates (for starting in the center)
const TIMISOARA_CENTER: [number, number] = [45.7538, 21.2257]; 
const INITIAL_ZOOM = 14; 

// Dynamic Import: Load the map only on the client, disable SSR
const DynamicProjectMap = dynamic(
  () => import('@/components/Map'),
  { 
    ssr: false, 
    loading: () => <p style={{ padding: '20px', textAlign: 'center' }}>Harta se încarcă...</p>
  }
);


export default function Home() {
  return (
    // The JSX tag must remain capitalized for React to see it as a component
    <MainLayout>
      {/* Capture the state AND the new openDetailsModal function */}
      {(isSidebarOpen: boolean, openDetailsModal: any) => (
        <DynamicProjectMap 
          center={TIMISOARA_CENTER} 
          zoom={INITIAL_ZOOM} 
          projects={MOCK_PROJECTS} 
          isSidebarOpen={isSidebarOpen} 
          openDetailsModal={openDetailsModal}
        />
      )}
    </MainLayout>
  );
}
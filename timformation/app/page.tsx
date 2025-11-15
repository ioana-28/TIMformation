// timformation/app/page.tsx

'use client'; 
import dynamic from 'next/dynamic'; 
// 🚨 FIX 1: Import the component using the capitalized alias 'MainLayout'
import MainLayout from '@/components/mainLayout'; 
import { MOCK_PROJECTS } from '@/components/ProjectList'; 
import React from 'react';

// Define center coordinates (for starting in the center)
const TIMISOARA_CENTER: [number, number] = [45.7538, 21.2257]; 
const INITIAL_ZOOM = 14; 

// Dynamic Import: Load the map only on the client, disable SSR
const DynamicProjectMap = dynamic(
  () => import('@/components/Map'), // Assuming ProjectMap is the correct file name now
  { 
    ssr: false, 
    loading: () => <p style={{ padding: '20px', textAlign: 'center' }}>Harta se încarcă...</p>
  }
);


export default function Home() {
  return (
    // 🚨 FIX 2: Use the capitalized component name in the JSX
    <MainLayout>
      {/* Capture the state (isSidebarOpen) passed from MainLayout */}
      {(isSidebarOpen) => (
        <DynamicProjectMap 
          center={TIMISOARA_CENTER} 
          zoom={INITIAL_ZOOM} 
          projects={MOCK_PROJECTS} 
          isSidebarOpen={isSidebarOpen} 
        />
      )}
    </MainLayout>
  );
}
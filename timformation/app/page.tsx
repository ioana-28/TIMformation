// timformation/app/page.tsx

'use client'; 
import dynamic from 'next/dynamic'; 
import MainLayout from '@/components/mainLayout'; // Correct import name
import { MOCK_PROJECTS } from '@/components/ProjectList'; // Importă proiectele pentru hartă

// Define center coordinates (păstrate)
const TIMISOARA_CENTER: [number, number] = [45.7489, 21.2087]; 
const INITIAL_ZOOM = 14; 

// 2. Dynamic Import: Load the map only on the client, disable SSR
const DynamicProjectMap = dynamic(
  () => import('@/components/Map'), // Corrected path to ProjectMap
  { 
    ssr: false, 
    loading: () => <p style={{ padding: '20px', textAlign: 'center' }}>Harta se încarcă...</p>
  }
);


export default function Home() {
  return (
    <MainLayout>
      {/* 3. Utilizează componenta dinamică */}
      <DynamicProjectMap 
        center={TIMISOARA_CENTER} 
        zoom={INITIAL_ZOOM} 
        projects={MOCK_PROJECTS} 
      />
    </MainLayout>
  );
}
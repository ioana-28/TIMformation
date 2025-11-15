// timformation/app/page.tsx

'use client'; 
import dynamic from 'next/dynamic'; 
import MainLayout from '@/components/mainLayout'; // CORRECTED: Capital M
import { MOCK_PROJECTS } from '@/components/ProjectList'; 

// Define center coordinates 
const TIMISOARA_CENTER: [number, number] = [45.753, 21.229]; 
// 🚨 FIX: Zoom out to see the entire boundary (level 11 is a good start)
const INITIAL_ZOOM = 11; 

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
    <MainLayout>
      <DynamicProjectMap 
        center={TIMISOARA_CENTER} 
        zoom={INITIAL_ZOOM} 
        projects={MOCK_PROJECTS} 
      />
    </MainLayout>
  );
}
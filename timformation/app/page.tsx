// timformation/app/page.tsx

'use client'; 
import dynamic from 'next/dynamic'; 
import MainLayout from '@/components/mainLayout';
import { MOCK_PROJECTS } from '@/components/ProjectList'; 

// Define center coordinates (Piața Victoriei area is a good focal point)
// Lat: 45.7538, Lng: 21.2257
const TIMISOARA_CENTER: [number, number] = [45.7538, 21.2257]; 

// 🚨 FIX: Zoom increased to 13-14 to start in the city center, 
// rather than zoomed out to see the entire boundary (which was 11-12).
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
    <MainLayout>
      <DynamicProjectMap 
        center={TIMISOARA_CENTER} 
        zoom={INITIAL_ZOOM} // Now starts closer to the center
        projects={MOCK_PROJECTS} 
      />
    </MainLayout>
  );
}
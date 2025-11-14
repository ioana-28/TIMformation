// timformation/app/page.tsx

'use client'; 
import MainLayout from '@/components/mainLayout';
import React from 'react';

export default function Home() {
  return (
    <MainLayout>
      {/* CONTENT INSIDE MainLayout is the Map Area */}
      <div style={{ 
        height: '100%', 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#eee' 
      }}>
        {/* This is where your Map component will go! */}
        <h1>Aici va fi Harta Proiectelor Timișoara</h1>
      </div>
      {/* Note: The map zoom controls will be built into the map library itself */}
    </MainLayout>
  );
}
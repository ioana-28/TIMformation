// timformation/components/MainLayout.tsx

'use client'; 
import React, { useState } from 'react'; 
import Header from './Header'; 
import ProjectList from './ProjectList'; 

// Stiluri pentru containerul principal
const pageContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh', 
  overflow: 'hidden', 
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const contentAreaStyle: React.CSSProperties = {
    display: 'flex',
    flexGrow: 1, 
    overflow: 'hidden', 
  };
  
  // Stilul containerului hărții (se redimensionează lin)
  const mapContainerStyle: React.CSSProperties = {
    flexGrow: 1, 
    minWidth: 0, 
    height: '100%', 
    position: 'relative',
    transition: 'flex-grow 0.3s ease-in-out', 
  };

  return (
    <div style={pageContainerStyle}>
        {/* Antetul primește funcția de comutare și starea */}
        <Header onMenuToggle={toggleSidebar} isOpen={isSidebarOpen} /> 

        <div style={contentAreaStyle}>

            {/* Lista de proiecte primește starea sidebar-ului */}
            <ProjectList isOpen={isSidebarOpen} /> 

            {/* Zona hărții */}
            <div style={mapContainerStyle}>
                {children}
            </div>

        </div>
    </div>
  );
}
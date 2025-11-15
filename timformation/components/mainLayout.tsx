// timformation/components/MainLayout.tsx

'use client'; 
import React, { useState } from 'react'; 
import Header from './Header'; 
import ProjectList from './ProjectList'; 

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

// Map Container style - ensures smooth resizing
const mapContainerStyle: React.CSSProperties = { 
    flexGrow: 1, 
    minWidth: 0, 
    height: '100%', 
    position: 'relative',
    transition: 'flex-grow 0.3s ease-in-out', 
};

// 🚨 FIX 1: Define children as a function that accepts 'isSidebarOpen'
interface MainLayoutProps {
    children: (isSidebarOpen: boolean) => React.ReactNode; 
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div style={pageContainerStyle}>
        {/* Header receives the state and toggle function */}
        <Header onMenuToggle={toggleSidebar} isOpen={isSidebarOpen} /> 

        <div style={contentAreaStyle}>

            <ProjectList isOpen={isSidebarOpen} /> 

            {/* 🚨 FIX 2: Execute the children function, passing the state */}
            <div style={mapContainerStyle}>
                {children(isSidebarOpen)} 
            </div>

        </div>
    </div>
  );
}
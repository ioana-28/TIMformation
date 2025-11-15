// timformation/components/MainLayout.tsx

'use client'; 
import React, { useState } from 'react'; 
import Header from './Header'; 
import ProjectList, { MOCK_PROJECTS, Project } from './ProjectList'; // 🚨 Import Project type and data
import ProjectDetailsModal from './ProjectDetailsModal'; 

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
const mapContainerStyle: React.CSSProperties = { 
    flexGrow: 1, 
    minWidth: 0, 
    height: '100%', 
    position: 'relative',
    transition: 'flex-grow 0.3s ease-in-out', 
};

// 🚨 FIX: Define children as a function that accepts state AND the modal function
interface MainLayoutProps {
    children: (isSidebarOpen: boolean, openDetailsModal: (project: Project) => void) => React.ReactNode; 
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // State uses the imported Project type
  const [selectedProject, setSelectedProject] = useState<Project | null>(null); 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Function to open the modal and ensure the full project object is passed
  const openDetailsModal = (project: Project) => {
    // Finds the full project data from the array (if only an ID was passed, though here we pass the full object)
    const fullProject = MOCK_PROJECTS.find(p => p.id === project.id) || project;
    setSelectedProject(fullProject);
  };
  
  // Function to close the modal
  const closeDetailsModal = () => {
    setSelectedProject(null);
  };
  
  return (
    <div style={pageContainerStyle}>
        {/* Header receives the state and toggle function */}
        <Header onMenuToggle={toggleSidebar} isOpen={isSidebarOpen} /> 

        <div style={contentAreaStyle}>
            
            {/* ProjectList receives the click handler */}
            <ProjectList isOpen={isSidebarOpen} onProjectClick={openDetailsModal} /> 

            {/* Execute the children function (rendering the map) and pass the state/function */}
            <div style={mapContainerStyle}>
                {children(isSidebarOpen, openDetailsModal)} 
            </div>
            
            {/* 💥 MODAL RENDERED HERE 💥 */}
            {selectedProject && (
                <ProjectDetailsModal project={selectedProject} onClose={closeDetailsModal} />
            )}

        </div>
    </div>
  );
}
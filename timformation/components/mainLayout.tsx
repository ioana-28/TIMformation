// timformation/components/MainLayout.tsx

'use client'; 
import React, { useState } from 'react'; 
import Header from './Header'; 
import ProjectList, { Project, MOCK_PROJECTS } from './ProjectList'; // Import Project type and data
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

// Define the children render prop type
interface MainLayoutProps {
    children: (isSidebarOpen: boolean, openDetailsModal: (project: Project) => void) => React.ReactNode; 
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null); 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Function to open the modal
  const openDetailsModal = (project: Project) => {
    // Ensures we pass the full project object including description
    const fullProject = MOCK_PROJECTS.find(p => p.id === project.id) || project;
    setSelectedProject(fullProject);
  };
  
  // Function to close the modal
  const closeDetailsModal = () => {
    setSelectedProject(null);
  };
  
  return (
    <div style={pageContainerStyle}>
        <Header onMenuToggle={toggleSidebar} isOpen={isSidebarOpen} /> 

        <div style={contentAreaStyle}>

            <ProjectList isOpen={isSidebarOpen} onProjectClick={openDetailsModal} /> 

            {/* Execute the children function, passing the state and the click handler */}
            <div style={mapContainerStyle}>
                {children(isSidebarOpen, openDetailsModal)} 
            </div>
            
            {/* MODAL RENDERED HERE */}
            {selectedProject && (
                <ProjectDetailsModal project={selectedProject} onClose={closeDetailsModal} />
            )}

        </div>
    </div>
  );
}
// timformation/components/MainLayout.tsx

'use client'; 
import React, { useState } from 'react'; 
import Header from './Header'; 
import ProjectList, { MOCK_PROJECTS, Project } from './ProjectList'; // Import Project type and data
import ProjectDetailsModal from './ProjectDetailsModal'; 

// --- 1. Style Definitions (REQUIRED FIXES) ---
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
// ---------------------------------------------

// 🚨 FIX 1: Define the MainLayoutProps interface
interface MainLayoutProps {
    children: (
        isSidebarOpen: boolean, 
        openDetailsModal: (project: Project) => void, 
        filteredProjects: Project[] // Pass filtered projects to children (Map)
    ) => React.ReactNode; 
}

export default function MainLayout({ children }: MainLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null); 
    
    // 🚨 NEW STATES: Centralized Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All'); 

    // --- FILTERING LOGIC ---
    const filteredProjects = MOCK_PROJECTS.filter(project => {
        const term = searchTerm.toLowerCase();
        const matchesSearch = (
            project.name.toLowerCase().includes(term) ||
            project.designer.toLowerCase().includes(term) ||
            project.location.toLowerCase().includes(term)
        );
        const matchesStatus = (
            statusFilter === 'All' || project.status === statusFilter
        );
        return matchesSearch && matchesStatus;
    });
    // -------------------------

    // 🚨 FIX 2: Implement toggleSidebar
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    
    // 🚨 FIX 3: Implement openDetailsModal
    const openDetailsModal = (project: Project) => {
        // Ensure we pass the full project object including description
        const fullProject = MOCK_PROJECTS.find(p => p.id === project.id) || project;
        setSelectedProject(fullProject);
    };
    
    // 🚨 FIX 4: Implement closeDetailsModal
    const closeDetailsModal = () => {
        setSelectedProject(null);
    };
    
    return (
        <div style={pageContainerStyle}>
            <Header onMenuToggle={toggleSidebar} isOpen={isSidebarOpen} /> 

            <div style={contentAreaStyle}>
                {/* 🚨 ProjectList receives the current filter states and setters 🚨 */}
                <ProjectList 
                    isOpen={isSidebarOpen} 
                    onProjectClick={openDetailsModal} 
                    setSearchTerm={setSearchTerm} 
                    setStatusFilter={setStatusFilter} 
                    filteredProjects={filteredProjects} // Pass results back to list for rendering
                /> 

                {/* Execute children (the map component), passing state and filtered data */}
                <div style={mapContainerStyle}>
                    {children(isSidebarOpen, openDetailsModal, filteredProjects)} 
                </div>
                
                {/* Modal Render */}
                {selectedProject && (
                    <ProjectDetailsModal project={selectedProject} onClose={closeDetailsModal} />
                )}
            </div>
        </div>
    );
}
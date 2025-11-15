// timformation/components/ProjectDetailsModal.tsx (NEW FILE)

import React from 'react';

// Define the Project type (must match the one used everywhere)
interface Project {
    id: number; name: string; status: string; designer: string; location: string; description: string;
    // We assume lat/lng aren't needed in the modal itself, but include them for type consistency
    lat: number; lng: number; 
}

interface ModalProps {
    project: Project;
    onClose: () => void;
}

const modalBackdropStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1000,
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    // Allow closing by clicking outside the content
    cursor: 'pointer', 
};

const modalContentStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    maxWidth: '600px',
    width: '90%',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    cursor: 'default', // Reset cursor inside modal content
    maxHeight: '80vh', // Prevent modal from exceeding screen height
    overflowY: 'auto', // Allow internal scrolling
};

export default function ProjectDetailsModal({ project, onClose }: ModalProps) {
    
    const getStatusTagStyle = (status: string) => {
        switch (status) {
            case 'Completed': return { bg: '#dcf8e5', text: '#3c763d' }; 
            case 'Planning': return { bg: '#f0e0d0', text: '#8a6d3b' }; 
            case 'In Progress': return { bg: '#cce5ff', text: '#31708f' }; 
            default: return { bg: '#f9f9f9', text: '#666' };
        }
    };
    const statusStyle = getStatusTagStyle(project.status);

    return (
        <div style={modalBackdropStyle} onClick={onClose}>
            <div style={modalContentStyle} onClick={e => e.stopPropagation()}> 
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0, color: '#130852ff' }}>{project.name}</h2>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '1.5em', cursor: 'pointer', color: '#555' }}>
                        &times;
                    </button>
                </div>
                
                <span 
                    style={{ 
                        backgroundColor: statusStyle.bg, color: statusStyle.text, padding: '5px 10px', 
                        borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9em', display: 'inline-block', marginBottom: '15px'
                    }}
                >
                    Status: {project.status}
                </span>

                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px', color: '#333' }}>Detalii Proiect</h3>
                
                <p><strong>Locație:</strong> {project.location}</p>
                <p><strong>Proiectant:</strong> {project.designer}</p>
                <p><strong>Descriere Completă:</strong> {project.description}</p>
                
                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px', marginTop: '30px', color: '#333' }}>Termene și Etape</h3>
                <p>Stadiu detaliat al lucrărilor...</p>
                
            </div>
        </div>
    );
}
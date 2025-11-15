// timformation/components/ProjectDetailsModal.tsx

import React, { useState } from 'react';
import { Project } from './ProjectList'; // Import the unified Project type

// Define the Comment type (for local state)
interface Comment {
    id: number;
    user: string;
    text: string;
    date: string;
}

interface ModalProps {
    project: Project;
    onClose: () => void;
}

// --- Style Definitions (Simplified for brevity) ---
const modalBackdropStyle: React.CSSProperties = { /* ... (styles omitted for brevity) */ 
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 1000,
    display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', 
};
const modalContentStyle: React.CSSProperties = { /* ... (styles omitted for brevity) */ 
    backgroundColor: 'white', padding: '30px', borderRadius: '12px', maxWidth: '600px', width: '90%', 
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)', cursor: 'default', maxHeight: '80vh', overflowY: 'auto', 
};
const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', marginBottom: '10px'
};

export default function ProjectDetailsModal({ project, onClose }: ModalProps) {
    // 1. State for managing comments and input
    const [comments, setComments] = useState<Comment[]>([
        // Mock Comments (Replace with API fetch later)
        { id: 1, user: 'Cetățean_TM', text: 'Sper să termine trotuarele în Piața Unirii înainte de iarnă.', date: 'ieri' },
        { id: 2, user: 'Primăria', text: 'Termenul estimat este realist. Mulțumim pentru feedback!', date: 'astăzi' },
    ]);
    const [newCommentText, setNewCommentText] = useState('');

    // Helper to get status color
    const getStatusTagStyle = (status: string) => { /* ... */ 
        switch (status) {
            case 'Completed': return { bg: '#dcf8e5', text: '#3c763d' }; 
            case 'Planning': return { bg: '#f0e0d0', text: '#8a6d3b' }; 
            case 'In Progress': return { bg: '#cce5ff', text: '#31708f' }; 
            default: return { bg: '#f9f9f9', text: '#666' };
        }
    };
    const statusStyle = getStatusTagStyle(project.status);

    // 2. Handler for adding a new comment
    const handlePostComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCommentText.trim() === '') return;

        // 🚨 FUTURE: Replace this client-side mock with an async POST request to the Node.js API
        
        const newComment: Comment = {
            id: Date.now(),
            user: 'Utilizator Curent', // Replace with actual authenticated username
            text: newCommentText.trim(),
            date: new Date().toLocaleDateString('ro-RO'),
        };

        setComments([newComment, ...comments]); // Add new comment to the top
        setNewCommentText('');
    };

    return (
        <div style={modalBackdropStyle} onClick={onClose}>
            <div style={modalContentStyle} onClick={e => e.stopPropagation()}> 
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0, color: '#130852ff' }}>{project.name}</h2>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '1.5em', cursor: 'pointer', color: '#555' }}>
                        &times;
                    </button>
                </div>
                
                {/* Project Status Tag */}
                <span 
                    style={{ 
                        backgroundColor: statusStyle.bg, color: statusStyle.text, padding: '5px 10px', 
                        borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9em', display: 'inline-block', marginBottom: '15px'
                    }}
                >
                    Status: {project.status}
                </span>

                {/* --- Detalii Proiect --- */}
                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px', color: '#333' }}>Detalii Proiect</h3>
                <p><strong>Locație:</strong> {project.location}</p>
                <p><strong>Proiectant:</strong> {project.designer}</p>
                <p><strong>Descriere Completă:</strong> {project.description}</p>
                
                {/* --- Secțiunea de Comentarii --- */}
                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px', marginTop: '30px', color: '#333' }}>
                    Comentarii ({comments.length})
                </h3>

                {/* Formular Postare Comentariu */}
                <form onSubmit={handlePostComment} style={{ marginBottom: '20px', borderBottom: '1px dashed #eee', paddingBottom: '15px' }}>
                    <textarea
                        style={{ ...inputStyle, minHeight: '60px' }}
                        placeholder="Adaugă un comentariu public..."
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        required
                    />
                    <button 
                        type="submit" 
                        style={{ 
                            padding: '8px 15px', backgroundColor: '#31708f', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.9em', float: 'right'
                        }}
                    >
                        Postează Comentariul
                    </button>
                    <div style={{ clear: 'both' }}></div> {/* Clear float */}
                </form>

                {/* Listă Comentarii */}
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {comments.map(comment => (
                        <div key={comment.id} style={{ borderBottom: '1px dotted #ccc', padding: '10px 0' }}>
                            <p style={{ margin: '0 0 5px 0' }}>
                                <strong>{comment.user}</strong> 
                                <span style={{ fontSize: '0.8em', color: '#999', marginLeft: '10px' }}>
                                    — {comment.date}
                                </span>
                            </p>
                            <p style={{ margin: 0 }}>{comment.text}</p>
                        </div>
                    ))}
                    {comments.length === 0 && <p style={{ color: '#666' }}>Fii primul care comentează acest proiect!</p>}
                </div>
                
            </div>
        </div>
    );
}
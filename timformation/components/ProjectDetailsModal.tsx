// timformation/components/ProjectDetailsModal.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { Project } from './ProjectList'; // Import the unified Project type
import { createClient } from '@/libs/supabase/client';
import type { User } from '@supabase/supabase-js';

// Define the Comment type (for local state)
interface Comment {
    id: number;
    project_id: number;
    author_id: string;
    author_name: string;
    content: string;
    created_at: string;
}

interface ModalProps {
    project: Project;
    onClose: () => void;
}

// --- Style Definitions (Simplified for brevity) ---
const modalBackdropStyle: React.CSSProperties = { /* ... (styles omitted for brevity) */ 
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 2000,
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
    const [comments, setComments] = useState<Comment[]>([]);
    const [newCommentText, setNewCommentText] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const supabase = useMemo(() => createClient(), []);

    // Fetch current user and project comments when modal opens / project changes
    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoadingComments(true);

            // get current user (if any)
            try {
                const { data: userData } = await supabase.auth.getUser();
                if (!mounted) return;
                setUser(userData?.user ?? null);
            } catch (e) {
                console.warn('Error fetching user from Supabase', e);
            }

            // fetch comments for this project
            try {
                const { data, error } = await supabase
                    .from('comments')
                    .select('*')
                    .eq('project_id', project.id)
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('Error fetching comments:', error);
                } else if (data) {
                    if (!mounted) return;
                    // map to local Comment shape (ensure author_name exists)
                    type DBComment = {
                        id: number;
                        project_id: number;
                        author_id: string;
                        author_name: string;
                        content: string;
                        created_at: string;
                    };
                    const mapped: Comment[] = (data as DBComment[]).map((c) => ({
                        id: c.id,
                        project_id: c.project_id,
                        author_id: c.author_id,
                        author_name: c.author_name,
                        content: c.content,
                        created_at: c.created_at,
                    }));
                    setComments(mapped);
                }
            } catch (e) {
                console.error('Unexpected error fetching comments', e);
            }

            setLoadingComments(false);
        }

        load();

        return () => {
            mounted = false;
        };
    }, [project.id, supabase]);

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
    const handlePostComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newCommentText.trim() === '') return;

        if (!user) {
            // Shouldn't happen because UI will disable the form, but guard anyway
            alert('Trebuie să fii autentificat pentru a posta un comentariu.');
            return;
        }

        const payload = {
            project_id: project.id,
            author_id: user.id,
            author_name: (user.user_metadata && user.user_metadata.full_name) || user.email || 'Utilizator',
            content: newCommentText.trim(),
        };

        try {
            const { data, error } = await supabase.from('comments').insert(payload).select().single();
            if (error) {
                console.error('Error inserting comment:', error);
                alert('A apărut o eroare la postarea comentariului.');
                return;
            }

            const inserted: Comment = {
                id: data.id,
                project_id: data.project_id,
                author_id: data.author_id ?? null,
                author_name: data.author_name ?? (data.author_id ?? 'Utilizator'),
                content: data.content,
                created_at: data.created_at,
            };

            setComments(prev => [inserted, ...prev]);
            setNewCommentText('');
        } catch (e) {
            console.error('Unexpected error posting comment', e);
            alert('A apărut o eroare la postarea comentariului.');
        }
    };

    return (
        <div style={modalBackdropStyle} onClick={onClose}>
            <div style={modalContentStyle} onClick={e => e.stopPropagation()}> 

                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0, color: '#000000ff' }}>{project.title}</h2>
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
                        disabled={!user}
                    />
                    {!user && (
                        <p style={{ color: '#b00', margin: '6px 0' }}>Trebuie să fii autentificat pentru a posta un comentariu.</p>
                    )}
                    <button 
                        type="submit" 
                        disabled={!user}
                        style={{ 
                            padding: '8px 15px', backgroundColor: '#31708f', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.9em', float: 'right', opacity: !user ? 0.6 : 1, cursor: !user ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Postează Comentariul
                    </button>
                    <div style={{ clear: 'both' }}></div> {/* Clear float */}
                </form>

                {/* Listă Comentarii */}
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {loadingComments ? (
                        <p style={{ color: '#666' }}>Se încarcă comentariile...</p>
                    ) : comments.length > 0 ? (
                        comments.map(comment => (
                            <div key={comment.id} style={{ borderBottom: '1px dotted #ccc', padding: '10px 0' }}>
                                <p style={{ margin: '0 0 5px 0' }}>
                                    <strong>{comment.author_name}</strong>
                                    <span style={{ fontSize: '0.8em', color: '#999', marginLeft: '10px' }}>
                                        — {comment.created_at}
                                    </span>
                                </p>
                                <p style={{ margin: 0 }}>{comment.content}</p>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: '#666' }}>Fii primul care comentează acest proiect!</p>
                    )}
                </div>
                
            </div>
        </div>
    );
}
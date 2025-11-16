// timformation/components/ProjectDetailsModal.tsx

import React, { useState } from 'react';
import { Project } from './ProjectList'; 
import { Montserrat } from 'next/font/google'; 

const montserrat = Montserrat({
    subsets: ['latin'],
    display: 'swap',
    weight: ['400', '700', '900'], 
    variable: '--font-montserrat', 
});


// Define the Comment type (for local state)
interface Comment {
    id: number; user: string; text: string; date: string;
}

interface ModalProps {
    project: Project; onClose: () => void;
}

// --- Style Definitions ---
const ACCENT_DARK_BLUE = '#130852ff';
const ACCENT_ACTION_BLUE = '#84a6deff';
const NEUTRAL_FONT_COLOR = '#222'; 
const NEUTRAL_LABEL_COLOR = '#000'; 
const LIGHT_BLUE_BOX = '#fff3f0ff'; 
const DARK_BLUE_COMMENT_BG = '#1e3a63'; 

const modalBackdropStyle: React.CSSProperties = { 
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 2000,
    display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', 
};

const modalContentStyle: React.CSSProperties = { 
    backgroundColor: 'white', padding: '30px', 
    borderRadius: '12px', maxWidth: '650px', 
    width: '90%', 
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)', cursor: 'default', maxHeight: '90vh', 
    overflowY: 'auto', 
};

const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', marginBottom: '10px'
};

// 🛠️ FIX 1: Fundalul sticky este setat la ALB pentru a acoperi fundalul negru al backdrop-ului
const stickyHeaderStyle: React.CSSProperties = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    position: 'sticky', top: -30, 
    backgroundColor: '#84a6deff', // 🚨 FIX: Fundal ALB pentru a acoperi marginea negativă
    padding: '30px 0 15px 0', margin: '0 -30px 0px', 
    width: 'calc(100% + 60px)', zIndex: 100, 
    borderBottom: '1px solid #eee',
};

const sectionHeaderStyle: React.CSSProperties = {
    borderBottom: '1px solid #c7c7c7', 
    paddingBottom: '5px', 
    marginTop: '35px', 
    marginBottom: '15px',
    color: ACCENT_DARK_BLUE, 
    fontSize: '1.25em',
    fontWeight: '700',
};

const commentsContainerStyle: React.CSSProperties = {
    padding: '25px', 
    backgroundColor: DARK_BLUE_COMMENT_BG, 
    color: 'white', 
    borderRadius: '8px',
    boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.1)', 
    marginTop: '40px',
    marginBottom: '20px', 
};


// Funcție de ajutor pentru a afișa valoarea sau un N/A
const formatValue = (value: string | number | undefined, isCurrency = false, isDate = false) => { /* ... */ return String(value); };
const getStatusTagStyle = (status: string) => { /* ... */ 
    switch (status) {
        case 'Finalizat': return { bg: '#a0c4ff', text: '#00287a' }; 
        case 'În Planificare': return { bg: '#fcf8e3', text: '#8a6d3b' }; 
        case 'În Desfășurare': return { bg: '#d9b380', text: '#333333' }; 
        default: return { bg: '#f9f9f9', text: '#666' };
    }
};


export default function ProjectDetailsModal({ project, onClose }: ModalProps) {
    const [comments, setComments] = useState<any[]>([
        { id: 1, user: 'Cetățean_TM', text: 'Sper să termine trotuarele în Piața Unirii înainte de iarnă.', date: 'ieri' },
        { id: 2, user: 'Primăria', text: 'Termenul estimat este realist. Mulțumim pentru feedback!', date: 'astăzi' },
    ]);
    const [newCommentText, setNewCommentText] = useState('');

    const statusStyle = getStatusTagStyle(project.status);
    const totalValueDisplay = formatValue(project.total_value, true);

    const handlePostComment = (e: React.FormEvent) => { /* ... */ };

    return (
        <div style={modalBackdropStyle} onClick={onClose}>
            <div style={modalContentStyle} onClick={e => e.stopPropagation()}> 
                
                {/* STICKY HEADER SECTION (Fundal Alb) */}
                <div style={stickyHeaderStyle}>
                    <div style={{ paddingLeft: 30 }}> 
                        <h2 
                            className={montserrat.className} 
                            style={{ 
                                margin: 0, 
                                // 🛠️ FIX 2: Aplică culoarea accentului pentru titlu (Navy)
                                color: ACCENT_DARK_BLUE, 
                                fontSize: '1.9em', 
                                fontWeight: '900' 
                            }}
                        >
                            {project.title ?? project.name}
                        </h2> 
                        <span 
                            style={{ 
                                backgroundColor: statusStyle.bg, color: statusStyle.text, padding: '5px 10px', 
                                borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9em', display: 'inline-block', marginTop: '10px'
                            }}
                        >
                            Stare: {project.status}
                        </span>
                    </div>

                    <button onClick={onClose} style={{ 
                        border: 'none', background: 'none', fontSize: '1.8em', cursor: 'pointer', color: '#555',
                        padding: '30px 30px 0 0', 
                        position: 'absolute', top: 0, right: 0
                    }}>
                        &times;
                    </button>
                </div>
                
                {/* --- Detalii Proiect (Conținut Principal) --- */}
                <div style={{ padding: '0 30px' }}> 
                    
                    {/* Secțiunea 1: Detalii Generale */}
                    <h3 style={sectionHeaderStyle}>Detalii Generale</h3>
                    
                    <p style={{marginBottom: 10, color: NEUTRAL_FONT_COLOR, fontSize: '1em'}}>
                        <strong style={{color: NEUTRAL_LABEL_COLOR}}>Titlu:</strong> {project.title ?? project.name}
                    </p>
                    <p style={{marginBottom: 10, color: NEUTRAL_FONT_COLOR, fontSize: '1em'}}>
                        <strong style={{color: NEUTRAL_LABEL_COLOR}}>Proiectant:</strong> {formatValue(project.designer)}
                    </p>
                    <p style={{marginBottom: 10, color: NEUTRAL_FONT_COLOR, fontSize: '1em'}}>
                        <strong style={{color: NEUTRAL_LABEL_COLOR}}>Locație:</strong> {formatValue(project.location)}
                    </p>
                    <p style={{marginBottom: 10, color: NEUTRAL_FONT_COLOR, fontSize: '1em'}}>
                        <strong style={{color: NEUTRAL_LABEL_COLOR}}>Beneficiar:</strong> {formatValue(project.beneficiary)}
                    </p>
                    <p style={{marginBottom: 10, color: NEUTRAL_FONT_COLOR, fontSize: '1em'}}>
                        <strong style={{color: NEUTRAL_LABEL_COLOR}}>Categorie:</strong> {formatValue(project.category)}
                    </p>
                    <p style={{marginBottom: 10, color: NEUTRAL_FONT_COLOR, fontSize: '1em'}}>
                        <strong style={{color: NEUTRAL_LABEL_COLOR}}>Descriere Completă:</strong> {project.description}
                    </p>
                    
                    {/* Secțiunea 2: Valori și Durate */}
                    <h3 style={sectionHeaderStyle}>Financiar & Termene</h3>
                    
                    <p style={{marginBottom: 10, color: NEUTRAL_FONT_COLOR, fontSize: '1em'}}>
                        <strong style={{color: NEUTRAL_LABEL_COLOR}}>Valoare Totală:</strong> {totalValueDisplay}
                    </p>
                    <p style={{marginBottom: 10, color: NEUTRAL_FONT_COLOR, fontSize: '1em'}}>
                        <strong style={{color: NEUTRAL_LABEL_COLOR}}>Durată Realizare:</strong> {formatValue(project.realization_duration_months) + (project.realization_duration_months ? ' luni' : '')}
                    </p>
                    <p style={{marginBottom: 10, color: NEUTRAL_FONT_COLOR, fontSize: '1em'}}>
                        <strong style={{color: NEUTRAL_LABEL_COLOR}}>Durată Execuție:</strong> {formatValue(project.execution_duration_months) + (project.execution_duration_months ? ' luni' : '')}
                    </p>
                    

                    {/* Secțiunea 3: Documentație și Log */}
                    <h3 style={sectionHeaderStyle}>Documentație și Log</h3>

                    <p style={{marginBottom: 10, color: NEUTRAL_FONT_COLOR, fontSize: '1em'}}>
                        <strong style={{color: NEUTRAL_LABEL_COLOR}}>Ultima Modificare:</strong> {formatValue(project.latest_change)}
                    </p>
                    
                    {project.latest_decision_url && (
                        <p style={{marginBottom: 10, color: NEUTRAL_FONT_COLOR, fontSize: '1em'}}>
                            <strong style={{color: NEUTRAL_LABEL_COLOR}}>Link Decizie:</strong> <a href={project.latest_decision_url} target="_blank" rel="noopener noreferrer" style={{ color: ACCENT_ACTION_BLUE, fontWeight: 'bold' }}>
                                Vezi documentul oficial 🔗
                            </a>
                        </p>
                    )}
                    
                    <p style={{marginBottom: 10, color: NEUTRAL_FONT_COLOR, fontSize: '1em'}}>
                        <strong style={{color: NEUTRAL_LABEL_COLOR}}>Creat la:</strong> {formatValue(project.created_at, false, true)}
                    </p>
                    <p style={{marginBottom: 10, color: NEUTRAL_FONT_COLOR, fontSize: '1em'}}>
                        <strong style={{color: NEUTRAL_LABEL_COLOR}}>Actualizat la:</strong> {formatValue(project.updated_at, false, true)}
                    </p>

                    
                    {/* Secțiunea 4: Descriere */}
                    <h3 style={sectionHeaderStyle}>Descriere</h3>
                    <p style={{marginBottom: 20, color: NEUTRAL_FONT_COLOR, fontSize: '1em'}}>{project.description}</p> 
                    
                    
                    {/* 💥 SECȚIUNEA DE COMENTARII ÎNCADRATĂ (Albastru Închis - Navy) 💥 */}
                    <div style={commentsContainerStyle}>
                        <h3 style={{ borderBottom: '1px solid #3d699aff', paddingBottom: '5px', margin: '0 0 20px 0', color: 'white' }}>
                            Comentarii ({comments.length})
                        </h3>

                        {/* Formular Postare Comentariu */}
                        <form onSubmit={handlePostComment} style={{ marginBottom: '20px', borderBottom: '1px dashed #5a80aaff', paddingBottom: '15px' }}>
                            <textarea
                                style={{ ...inputStyle, minHeight: '60px', backgroundColor: 'white', color: NEUTRAL_FONT_COLOR }}
                                placeholder="Adaugă un comentariu public..."
                                value={newCommentText}
                                onChange={(e) => setNewCommentText(e.target.value)}
                                required
                            />
                            <button 
                                type="submit" 
                                style={{ 
                                    padding: '8px 15px', backgroundColor: ACCENT_ACTION_BLUE, color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.9em', float: 'right'
                                }}
                            >
                                Postează Comentariul
                            </button>
                            <div style={{ clear: 'both' }}></div>
                        </form>

                        {/* Listă Comentarii */}
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {comments.map(comment => (
                                <div key={comment.id} style={{ borderBottom: '1px dotted #88aadd', padding: '15px 0' }}>
                                    <p style={{ margin: '0 0 5px 0' }}>
                                        <strong style={{ color: '#c0d6ff' }}>{comment.user}</strong> 
                                        <span style={{ fontSize: '0.8em', color: '#c0d6ff', marginLeft: '10px' }}>
                                            — {comment.date}
                                        </span>
                                    </p>
                                    <p style={{ margin: 0, color: '#f0f4ff' }}>{comment.text}</p>
                                </div>
                            ))}
                            {comments.length === 0 && <p style={{ color: '#c0d6ff' }}>Fii primul care comentează acest proiect!</p>}
                        </div>
                    </div> 
                </div>
            </div>
        </div>
    );
}
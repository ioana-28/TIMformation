// timformation/app/request/page.tsx

'use client'; 
import React, { useState } from 'react';
import Header from '@/components/Header'; 

// --- 1. Style Definitions ---
const ACCENT_DARK_BLUE = '#130852ff'; 
const ACCENT_LIGHT_BLUE = '#31708f'; 
const NEUTRAL_LIGHT_BG = '#fafafa'; 
const NEUTRAL_FONT_COLOR = '#333';

const pageWrapperStyle: React.CSSProperties = {
    minHeight: '100vh', 
    backgroundColor: NEUTRAL_LIGHT_BG,
};

const formContainerStyle: React.CSSProperties = {
    maxWidth: '700px',
    margin: '30px auto',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '12px', 
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
};

const inputGroupStyle: React.CSSProperties = {
    marginBottom: '20px',
};

const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold', 
    color: NEUTRAL_FONT_COLOR,
    fontSize: '1em', 
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    border: '1px solid #bbb', 
    borderRadius: '8px', 
    boxSizing: 'border-box',
    fontSize: '1em',
    color: NEUTRAL_FONT_COLOR, 
};

export default function RequestPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form Submitted (Client-side simulation)");
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 5000); 
    };

    return (
        <div style={pageWrapperStyle}>
            <Header onMenuToggle={() => {}} isOpen={false} />

            <div style={{ paddingTop: '20px', paddingLeft: '20px', paddingRight: '20px' }}>
                <div style={formContainerStyle}>
                    
                    {isSubmitted ? (
                        // --- Success Message ---
                        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#dcf8e5', borderRadius: '8px' }}>
                            <h2 style={{ color: '#3c763d', margin: '0 0 10px 0' }}>Cererea a fost trimisă cu succes!</h2>
                            <p style={{ color: '#3c763d' }}>Vă mulțumim. Un reprezentant al Primăriei vă va răspunde în cel mai scurt timp posibil.</p>
                        </div>
                        
                    ) : (
                        // --- Form Content ---
                        <>
                            <h1 style={{ 
                                color: ACCENT_DARK_BLUE, 
                                marginTop: 0, 
                                fontSize: '2.2em',
                                fontWeight: '900'
                            }}>
                                Cerere Informații / Contact Primărie
                            </h1>
                            
                            <p style={{ marginBottom: '30px', color: '#444', fontSize: '1.05em' }}>
                                Utilizați formularul de mai jos pentru a trimite o întrebare, o sugestie, sau pentru a solicita documente referitoare la proiectele orașului.
                            </p>
                            
                            <form onSubmit={handleSubmit}>
                                <div style={inputGroupStyle}>
                                    <label htmlFor="name" style={labelStyle}>Numele dumneavoastră complet:</label>
                                    <input type="text" id="name" style={inputStyle} required />
                                </div>
                                
                                <div style={inputGroupStyle}>
                                    <label htmlFor="email" style={labelStyle}>Email-ul dumneavoastră:</label>
                                    <input type="email" id="email" style={inputStyle} required />
                                </div>

                                <div style={inputGroupStyle}>
                                    <label htmlFor="subject" style={labelStyle}>Subiectul cererii:</label>
                                    <input type="text" id="subject" style={inputStyle} placeholder="ex: Solicitare documentație proiect Pod Central" required />
                                </div>
                                
                                
                                <div style={inputGroupStyle}>
                                    <label htmlFor="message" style={labelStyle}>Mesajul dumneavoastră:</label>
                                    <textarea id="message" style={{ ...inputStyle, minHeight: '150px' }} required />
                                </div>
                                
                                <button 
                                    type="submit" 
                                    style={{ 
                                        padding: '12px 25px', 
                                        backgroundColor: ACCENT_DARK_BLUE, 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '1em',
                                        fontWeight: 'bold',
                                        transition: 'background-color 0.2s',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = ACCENT_LIGHT_BLUE}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ACCENT_DARK_BLUE}
                                >
                                    Trimite Cererea
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
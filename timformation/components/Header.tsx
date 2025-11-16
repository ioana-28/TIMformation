// timformation/components/Header.tsx

import Link from 'next/link';
import React from 'react';
import { User, SupabaseClient } from '@supabase/supabase-js';

// 1. DEFINIREA FONTULUI GOLDMAN (Singurul necesar)
import { Goldman } from 'next/font/google';

const goldman = Goldman({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'], 
  variable: '--font-goldman', 
});


interface HeaderProps {
    onMenuToggle: () => void;
    isOpen: boolean; 
    user?: User | null;            
    supabase?: SupabaseClient; 
}

// 2. STILURILE PENTRU HEADER (Definiții duplicate REZOLVATE)
const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    // Am păstrat doar una dintre definițiile de culoare:
    backgroundColor: '#08205b', 
    borderBottom: '1px solid #2452a7ff',
    boxShadow: '0 2px 4px rgba(16, 136, 60, 0.05)',
    height: '60px', 
    // APLICARE FONT: Goldman pentru toate elementele din header
    fontFamily: 'var(--font-goldman), sans-serif', 
};

// 3. STILURILE PENTRU LINK-URI (Definiții duplicate REZOLVATE)
const linkStyle: React.CSSProperties = {
    marginLeft: '20px',
    textDecoration: 'none',
    // Am păstrat doar una dintre definițiile de culoare:
    color: '#d0e4ff',
    fontSize: '1em',
    // Nu mai este necesară aplicarea explicită a fontFamily aici, moștenește de la headerStyle.
};

// 4. STILURILE PENTRU ICON (Cu culoare unificată)
const iconBaseStyle: React.CSSProperties = {
    fontSize: '1.5em', 
    cursor: 'pointer', 
    marginRight: '15px',
    color: '#f4ece4ff', // Culoare deschisă unificată
    transition: 'transform 0.3s ease-in-out', 
};

export default function Header({ onMenuToggle, isOpen, user, supabase }: HeaderProps) {

    const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    
    }
  };

    // 5. STILUL ROTIT (Definiție duplicată REZOLVATĂ)
    const iconRotatedStyle: React.CSSProperties = {
        ...iconBaseStyle,
        transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', 
    };

    return (
        <header style={headerStyle} className={goldman.variable}>

            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span 
                    style={iconRotatedStyle} // Aplicare stil rotit
                    onClick={onMenuToggle}
                >
                    ☰ 
                </span>
                
                <Link 
                    href="/" 
                    style={{ 
                        textDecoration: 'none', 
                        fontFamily: 'var(--font-goldman), sans-serif', // Aplicare explicită pentru titlu
                        color: '#f4ece4ff', 
                        fontSize: '1.4em', 
                        fontWeight: 'bold' 
                    }}
                >
                    TIMformation
                </Link>
            </div>


            {/* Right Side: Navigation Links */}
            <nav style={{ display: 'flex' }}>
                {user ? (
                    <>
                        <span style={{ color: '#87b7ff', marginRight: '15px' }}>{user.email}</span>
                        <button
                        onClick={handleLogout}
                        style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: '#2452a7', color: '#f4ece4ff', cursor: 'pointer' }}
                        >
                        Logout
                        </button>
                    </>
                    ) : (
                    <>
                        <Link href="/login" style={linkStyle}>Login</Link>
                        <Link href="/register" style={linkStyle}>Register</Link>
                    </>
                )}
                <Link href="/request" style={linkStyle}>
                    Send Request
                </Link>
                <Link href="/Q&A" style={linkStyle}>
                    Q&A
                </Link>
                
                
                
            </nav>
        </header>
    );
}
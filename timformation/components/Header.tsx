import Link from 'next/link';
import React from 'react';
import { User, SupabaseClient } from '@supabase/supabase-js';
import { usePathname } from "next/navigation";   // ✅ IMPORTAT

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

// 2. Stiluri
const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 24px',
    backgroundColor: '#08205b', 
    borderBottom: '2px solid #2452a7ff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    height: '70px', 
    fontFamily: 'var(--font-goldman), sans-serif', 
};

const leftContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
};

const logoStyle: React.CSSProperties = {
    textDecoration: 'none',
    fontFamily: 'var(--font-goldman), sans-serif',
    color: '#f4ece4ff', 
    fontSize: '1.6em', 
    fontWeight: 'bold',
    letterSpacing: '0.5px',
    transition: 'color 0.2s ease',
};

const navContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
};

const linkStyle: React.CSSProperties = {
    textDecoration: 'none',
    color: '#d0e4ff',
    fontSize: '0.9em',
    fontWeight: '500',
    transition: 'color 0.2s ease',
    padding: '8px 16px',
};

const adminButtonStyle: React.CSSProperties = {
    padding: '8px 16px',
    backgroundColor: '#f4ece4ff',
    color: '#08205b',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '0.9em',
    transition: 'all 0.2s ease',
    border: 'none',
    cursor: 'pointer',
};

const logoutButtonStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '6px',
    backgroundColor: '#2452a7',
    color: '#f4ece4ff',
    cursor: 'pointer',
    border: 'none',
    fontWeight: '600',
    fontSize: '0.9em',
    transition: 'all 0.2s ease',
};

const userEmailStyle: React.CSSProperties = {
    color: '#a8c5ff',
    fontSize: '0.9em',
    fontWeight: '500',
    padding: '8px 16px'
};

const iconBaseStyle: React.CSSProperties = {
    fontSize: '1.6em', 
    cursor: 'pointer',
    color: '#f4ece4ff',
    transition: 'transform 0.3s ease-in-out',
    padding: '8px',
};

export default function Header({ onMenuToggle, isOpen, user, supabase }: HeaderProps) {

    const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    
    }
  };

    const pathname = usePathname();

    return (
        <header style={headerStyle} className={goldman.variable}>
             
            <div style={leftContainerStyle}>
                {pathname === "/" && (
                    <span 
                        style={{
                            ...iconBaseStyle,
                            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                        }}
                        onClick={onMenuToggle}
                    >
                        ☰
                    </span>
                )}

                <Link 
                    href="/" 
                    style={logoStyle}
                >
                    TIMformation
                </Link>
            </div>

            <nav style={navContainerStyle}>
                {user ? (
                    <>
                        <span style={userEmailStyle}>{user.email}</span>
                        <button
                            onClick={handleLogout}
                            style={logoutButtonStyle}
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
                <Link href="/admin" style={adminButtonStyle}>
                    Admin
                </Link>
            </nav>

        </header>
    );
}

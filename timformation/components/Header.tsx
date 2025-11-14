// timformation/components/Header.tsx (TOATE ELEMENTELE FOLOSESC GOLDMAN)

import Link from 'next/link';
import React from 'react';

// 1. DEFINIREA FONTULUI GOLDMAN (Singurul necesar)
import { Goldman } from 'next/font/google';

const goldman = Goldman({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'], 
  variable: '--font-goldman', 
});

// AICI nu mai importăm Inter


interface HeaderProps {
    onMenuToggle: () => void;
    isOpen: boolean; 
}


// 2. APLICAREA FONTULUI PRINCIPAL (Goldman) pe header
const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#220453ff',
    borderBottom: '1px solid #226bafff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    height: '60px', 
    // APLICARE: Goldman pentru toate elementele care moștenesc stilul
    fontFamily: 'var(--font-goldman), sans-serif', 
};

// 3. APLICAREA FONTULUI PENTRU LINK-URI (Goldman - Moștenit de la headerStyle, dar îl putem seta explicit)
const linkStyle: React.CSSProperties = {
    marginLeft: '20px',
    textDecoration: 'none',
    color: '#F0E7D5', 
    fontSize: '1em',
    // Aplicare explicită Goldman pentru siguranță
    fontFamily: 'var(--font-goldman), sans-serif', 
};


// Define the style for the hamburger icon
const iconBaseStyle: React.CSSProperties = {
    fontSize: '1.5em', 
    cursor: 'pointer', 
    marginRight: '15px',
    color: '#F0E7D5',
    transition: 'transform 0.3s ease-in-out', 
};

export default function Header({ onMenuToggle, isOpen }: HeaderProps) {

    const iconRotatedStyle: React.CSSProperties = {
        ...iconBaseStyle,
        transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', 
    };
  return (
    // 4. Se adaugă clasa Goldman la header
    <header style={headerStyle} className={goldman.variable}>

      {/* Left Side: Logo and Title */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
            
            <span 
              style={iconRotatedStyle} 
              onClick={onMenuToggle}
            >
              ☰ 
            </span> 
            
            <Link 
              href="/" 
              style={{ 
                textDecoration: 'none', 
                // APLICARE: Goldman pentru titlu (pentru a asigura font-weight corect)
                fontFamily: 'var(--font-goldman), sans-serif', 
                color: '#F0E7D5', 
                fontSize: '1.4em', 
                fontWeight: 'bold' 
              }}
            >
              TIMformation
            </Link>
          </div>

      {/* Right Side: Action Buttons */}
      <nav style={{ display: 'flex' }}>
        <Link href="/request" style={linkStyle}>
          Send Request
        </Link>
        <Link href="/chat" style={linkStyle}>
          Chat
        </Link>
        <Link href="/vote" style={linkStyle}>
          Vote
        </Link>
        {/* Profile Icon Placeholder */}
        <span style={{ ...linkStyle, marginLeft: '30px' }}>👤</span> 
      </nav>
    </header>
  );
}
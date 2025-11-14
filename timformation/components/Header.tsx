// timformation/components/Header.tsx (New Top Bar Structure)
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
  height: '60px', // Fixed height for the header
};

// 3. APLICAREA FONTULUI PENTRU LINK-URI (Goldman - Moștenit de la headerStyle, dar îl putem seta explicit)
const linkStyle: React.CSSProperties = {
  marginLeft: '20px',
  textDecoration: 'none',
  color: '#e19956ff',
  fontSize: '1em',
};



const iconBaseStyle: React.CSSProperties = {
    fontSize: '1.5em', 
    cursor: 'pointer', 
    marginRight: '15px',
    // 2. ADD Transition for smooth rotation
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

     
      <div style={{ display: 'flex', alignItems: 'center' }}>
            
            <span 
              style={iconRotatedStyle} 
              onClick={onMenuToggle}
            >
              ☰ 
            </span> 
            
            <Link href="/" style={{ textDecoration: 'none', color: '#333', fontSize: '1.4em', fontWeight: 'bold' }}>
              TIMformation
            </Link>
          </div>


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
       
        <span style={{ ...linkStyle, marginLeft: '30px' }}>👤</span> 
      </nav>
    </header>
  );
}
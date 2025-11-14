
import Link from 'next/link';
import React from 'react';

interface HeaderProps {
    onMenuToggle: () => void;
    isOpen: boolean; 
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
  backgroundColor: '#130852ff',
  borderBottom: '1px solid #2452a7ff',
  boxShadow: '0 2px 4px rgba(16, 136, 60, 0.05)',
  height: '60px', 
};

const linkStyle: React.CSSProperties = {
  marginLeft: '20px',
  textDecoration: 'none',
  color: '#9bb1d3ff',
  fontSize: '1em',
};



const iconBaseStyle: React.CSSProperties = {
    fontSize: '1.5em', 
    cursor: 'pointer', 
    marginRight: '15px',
  
    transition: 'transform 0.3s ease-in-out', 
};

export default function Header({ onMenuToggle, isOpen }: HeaderProps) {

    const iconRotatedStyle: React.CSSProperties = {
        ...iconBaseStyle,
        transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', 
    };
  return (
    <header style={headerStyle}>

     
      <div style={{ display: 'flex', alignItems: 'center' }}>
            
            <span 
              style={iconRotatedStyle} 
              onClick={onMenuToggle}
            >
              ☰ 
            </span> 
            
            <Link href="/" style={{ textDecoration: 'none', color: '#92765fff', fontSize: '1.4em', fontWeight: 'bold' }}>
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
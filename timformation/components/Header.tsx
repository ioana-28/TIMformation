// timformation/components/Header.tsx (New Top Bar Structure)
import Link from 'next/link';
import React from 'react';

interface HeaderProps {
    onMenuToggle: () => void;
    isOpen: boolean; // <-- ADDED: To determine icon state
}

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

const linkStyle: React.CSSProperties = {
  marginLeft: '20px',
  textDecoration: 'none',
  color: '#e19956ff',
  fontSize: '1em',
};


// Define the style for the hamburger icon
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
        transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', // Rotate 90 degrees when open
    };
  return (
    <header style={headerStyle}>

      {/* Left Side: Logo and Title */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
            
            <span 
              style={iconRotatedStyle} // <-- Apply the dynamic style
              onClick={onMenuToggle}
            >
              ☰ {/* Using the standard hamburger character */}
            </span> 
            
            <Link href="/" style={{ textDecoration: 'none', color: '#333', fontSize: '1.4em', fontWeight: 'bold' }}>
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
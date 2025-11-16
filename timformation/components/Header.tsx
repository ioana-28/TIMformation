// timformation/components/Header.tsx

import Link from 'next/link';
import React from 'react';
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
}

// 2. Stiluri
const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#08205b', 
    borderBottom: '1px solid #2452a7ff',
    boxShadow: '0 2px 4px rgba(16, 136, 60, 0.05)',
    height: '60px', 
    fontFamily: 'var(--font-goldman), sans-serif', 
};

const linkStyle: React.CSSProperties = {
    marginLeft: '20px',
    textDecoration: 'none',
    color: '#d0e4ff',
    fontSize: '1em',
};

const iconBaseStyle: React.CSSProperties = {
    fontSize: '1.5em', 
    cursor: 'pointer', 
    marginRight: '15px',
    color: '#f4ece4ff',
    transition: 'transform 0.3s ease-in-out',
};

export default function Header({ onMenuToggle, isOpen }: HeaderProps) {

    const pathname = usePathname();  // ✅ DETECTEAZĂ PAGINA CURENTĂ DIN NEXT.JS

    const iconRotatedStyle: React.CSSProperties = {
        ...iconBaseStyle,
        transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', 
    };

    return (
        <header style={headerStyle} className={goldman.variable}>
             
            <div style={{ display: 'flex', alignItems: 'center' }}>

                {/* ✅ AICI E FIX-UL — apare DOAR pe "/" FĂRĂ REFRESH */}
                { pathname === "/" && (
                    <span 
                        style={iconRotatedStyle}
                        onClick={onMenuToggle}
                    >
                        ☰
                    </span>
                )}

                <Link 
                    href="/" 
                    style={{ 
                        textDecoration: 'none',
                        fontFamily: 'var(--font-goldman), sans-serif',
                        color: '#f4ece4ff', 
                        fontSize: '1.4em', 
                        fontWeight: 'bold' 
                    }}
                >
                    TIMformation
                </Link>
            </div>

            <nav style={{ display: 'flex' }}>
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

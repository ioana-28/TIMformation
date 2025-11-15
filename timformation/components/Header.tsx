'use client';

import Link from 'next/link';
import React from 'react';
import { User, SupabaseClient } from '@supabase/supabase-js';
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
  user?: User | null;               // 🔹 primim user
  supabase?: SupabaseClient;        // 🔹 primim supabase ca să putem da logout
}

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

export default function Header({ onMenuToggle, isOpen, user, supabase }: HeaderProps) {

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      // ⚡️ nu mai trebuie redirect, MainLayout va reseta user la null
    }
  };

  return (
    <header style={headerStyle} className={goldman.variable}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#f4ece4ff', fontSize: '1.4em', fontWeight: 'bold' }}>
          TIMformation
        </Link>
      </div>

      <nav style={{ display: 'flex', alignItems: 'center' }}>
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
      </nav>
    </header>
    );

}


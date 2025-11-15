'use client';

import React, { useState } from 'react';
import { createClient } from '@/libs/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const supabase = createClient();

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setMessage(error.message);
    else {
      setMessage('✅ Logged in successfully!');
      setTimeout(() => router.push('/'), 1000); // redirecționare după login
    }
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
      background: '#08205b',
      fontFamily: 'var(--font-goldman), sans-serif'
    }}>
      <form 
        onSubmit={handleLogin} 
        style={{
          display: 'flex', flexDirection: 'column', gap: '15px', padding: '30px',
          background: '#0C2B4E', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
          width: '350px', color: '#fff'
        }}
      >
        <h2 style={{ margin: 0, marginBottom: '10px', textAlign: 'center', color: '#f4ece4ff' }}>
          TIMformation Login
        </h2>

        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required
          style={{
            padding: '10px', borderRadius: '8px', border: '1px solid #2452a7ff',
            backgroundColor: '#f4ece4ff', color: '#08205b', fontWeight: 'bold'
          }}
        />

        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required
          style={{
            padding: '10px', borderRadius: '8px', border: '1px solid #2452a7ff',
            backgroundColor: '#f4ece4ff', color: '#08205b', fontWeight: 'bold'
          }}
        />

        <button 
          type="submit" 
          style={{
            padding: '12px', borderRadius: '8px', border: 'none',
            backgroundColor: '#f4ece4ff', color: '#08205b', fontWeight: 'bold',
            cursor: 'pointer', transition: '0.3s'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#d0e4ff'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f4ece4ff'}
        >
          Login
        </button>

        {message && <p style={{ textAlign: 'center', color: '#ffcccb' }}>{message}</p>}

        <p style={{ fontSize: '0.85em', textAlign: 'center', marginTop: '10px' }}>
          Don't have an account? <Link href="/register" style={{ color: '#d0e4ff', textDecoration: 'underline' }}>Register</Link>
        </p>
      </form>
    </div>
  );
}

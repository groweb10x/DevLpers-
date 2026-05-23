'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      alert('Please fill all fields!');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      const role = data.user?.user_metadata?.role;
      if (role === 'developer') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/buyer-dashboard';
      }
    }
  };

  return (
    <main style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
    }}>

      <div style={{
        position: 'absolute', top: '30%', left: '50%',
        transform: 'translateX(-50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(108,99,255,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: '440px',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '2.5rem',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', color: 'var(--accent)' }}>
              Dev<span style={{ color: 'var(--text)' }}>Market</span>
            </span>
          </Link>
        </div>

        <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', textAlign: 'center', marginBottom: '0.5rem' }}>
          Welcome Back
        </h1>
        <p style={{ color: 'var(--muted)', textAlign: 'center', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Log in to your DevMarket account
        </p>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
          {[
            { label: 'Email Address', name: 'email', type: 'email', placeholder: 'ali@example.com' },
            { label: 'Password', name: 'password', type: 'password', placeholder: '••••••••' },
          ].map(field => (
            <div key={field.name}>
              <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '0.4rem' }}>
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={form[field.name as keyof typeof form]}
                onChange={handleInput}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                style={{
                  width: '100%', padding: '12px 14px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px', color: 'var(--text)',
                  fontSize: '0.9rem', outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--accent)'}
                onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'}
              />
            </div>
          ))}
        </div>

        {/* Forgot Password */}
        <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
          <Link href="#" style={{ color: 'var(--accent)', fontSize: '0.83rem', textDecoration: 'none' }}>
            Forgot Password?
          </Link>
        </div>

        {/* Login Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', padding: '14px',
            background: loading ? 'var(--border)' : 'var(--accent)',
            border: 'none', borderRadius: '10px',
            color: '#fff', fontFamily: 'Syne',
            fontWeight: 600, fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}>
          {loading ? 'Logging in...' : 'Log In →'}
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>new here?</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/signup" style={{ textDecoration: 'none', flex: 1 }}>
            <button style={{
              width: '100%', padding: '12px',
              background: 'rgba(108,99,255,0.1)',
              border: '1px solid rgba(108,99,255,0.3)',
              borderRadius: '10px', color: 'var(--accent)',
              fontFamily: 'Syne', fontWeight: 600, fontSize: '0.9rem',
              cursor: 'pointer',
            }}>💻 Join as Dev</button>
          </Link>
          <Link href="/signup" style={{ textDecoration: 'none', flex: 1 }}>
            <button style={{
              width: '100%', padding: '12px',
              background: 'rgba(255,101,132,0.1)',
              border: '1px solid rgba(255,101,132,0.3)',
              borderRadius: '10px', color: 'var(--accent2)',
              fontFamily: 'Syne', fontWeight: 600, fontSize: '0.9rem',
              cursor: 'pointer',
            }}>🏢 Hire a Dev</button>
          </Link>
        </div>

      </div>
    </main>
  );
}
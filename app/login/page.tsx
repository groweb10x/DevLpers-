'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError('Please fill all fields!');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      const role = data.user?.user_metadata?.role;
      window.location.href = role === 'developer' ? '/dashboard' : '/buyer-dashboard';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', flexDirection: 'column' }}>

      {/* NAVBAR */}
      <nav style={{
        background: '#fff', borderBottom: '1px solid var(--border)',
        padding: '0 5%', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '1rem', color: '#fff',
          }}>D</div>
          <span style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '1.3rem', color: 'var(--text)' }}>
            Dev<span style={{ color: 'var(--accent)' }}>Lpers</span>
          </span>
        </Link>
        <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
          New to DevLpers?{' '}
          <Link href="/signup" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Join now</Link>
        </p>
      </nav>

      {/* MAIN */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--text)' }}>
              Sign in to DevLpers
            </h1>
            <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
              Welcome back! Please enter your details.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: '6px', padding: '0.75rem 1rem',
              color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem',
            }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{
            background: '#fff', border: '1px solid var(--border)',
            borderRadius: '8px', padding: '2rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>

            {/* Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Email Address', name: 'email', type: 'email', placeholder: 'name@example.com' },
                { label: 'Password', name: 'password', type: 'password', placeholder: '••••••••' },
              ].map(field => (
                <div key={field.name}>
                  <label style={{ display: 'block', color: 'var(--text)', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem' }}>
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
                      width: '100%', padding: '10px 14px',
                      border: '1px solid var(--border)',
                      borderRadius: '6px', color: 'var(--text)',
                      fontSize: '0.9rem', outline: 'none',
                      boxSizing: 'border-box', background: '#fff',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--accent)'}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'}
                  />
                </div>
              ))}
            </div>

            {/* Forgot Password */}
            <div style={{ textAlign: 'right', marginBottom: '1.5rem', marginTop: '-0.5rem' }}>
              <Link href="#" style={{ color: 'var(--accent)', fontSize: '0.83rem', textDecoration: 'none', fontWeight: 500 }}>
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button onClick={handleSubmit} disabled={loading} style={{
              width: '100%', padding: '12px',
              background: loading ? '#a7f3d0' : 'var(--accent)',
              border: 'none', borderRadius: '6px',
              color: '#fff', fontWeight: 700, fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = 'var(--accent-dark)'; }}
              onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = 'var(--accent)'; }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>or continue with</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>

            {/* Google Button */}
            <button style={{
              width: '100%', padding: '11px',
              background: '#fff', border: '1px solid var(--border)',
              borderRadius: '6px', color: 'var(--text)',
              fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
            >
              🌐 Continue with Google
            </button>
          </div>

          <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: '0.85rem', marginTop: '1.5rem' }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
              Sign up free
            </Link>
          </p>

          {/* Join Options */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <Link href="/signup" style={{ textDecoration: 'none', flex: 1 }}>
              <button style={{
                width: '100%', padding: '11px',
                background: '#f0fdf4', border: '1px solid #bbf7d0',
                borderRadius: '6px', color: 'var(--accent)',
                fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
              }}>💻 Join as Developer</button>
            </Link>
            <Link href="/signup" style={{ textDecoration: 'none', flex: 1 }}>
              <button style={{
                width: '100%', padding: '11px',
                background: '#fff7ed', border: '1px solid #fed7aa',
                borderRadius: '6px', color: 'var(--accent2)',
                fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
              }}>🏢 Hire a Developer</button>
            </Link>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        textAlign: 'center', padding: '1.5rem',
        borderTop: '1px solid var(--border)',
        color: 'var(--muted)', fontSize: '0.8rem',
      }}>
        © 2026 DevLpers · <Link href="#" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Privacy</Link> · <Link href="#" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Terms</Link>
      </div>
    </div>
  );
}
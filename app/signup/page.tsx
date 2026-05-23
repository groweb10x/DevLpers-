'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function SignUp() {
  const [role, setRole] = useState<'developer' | 'buyer' | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      alert('Please fill all fields!');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.name,
          role: role,
        }
      }
    });
    setLoading(false);
    if (error) {
      alert(error.message);
    } else {
      alert('Account created successfully!');
      window.location.href = role === 'developer' ? '/dashboard' : '/buyer-dashboard';
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
        width: '100%', maxWidth: '480px',
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

        {/* STEP 1 - Role Selection */}
        {step === 1 && (
          <>
            <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', textAlign: 'center', marginBottom: '0.5rem' }}>
              Join DevMarket
            </h1>
            <p style={{ color: 'var(--muted)', textAlign: 'center', fontSize: '0.9rem', marginBottom: '2rem' }}>
              First, tell us who you are
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div onClick={() => setRole('developer')} style={{
                border: `2px solid ${role === 'developer' ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: '14px', padding: '1.5rem',
                cursor: 'pointer', transition: 'all 0.2s',
                background: role === 'developer' ? 'rgba(108,99,255,0.08)' : 'transparent',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: 'rgba(108,99,255,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem',
                  }}>💻</div>
                  <div>
                    <div style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: '0.2rem' }}>I am a Developer</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.83rem' }}>Showcase skills, get hired, earn money</div>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      border: `2px solid ${role === 'developer' ? 'var(--accent)' : 'var(--border)'}`,
                      background: role === 'developer' ? 'var(--accent)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.6rem', color: '#fff',
                    }}>{role === 'developer' ? '✓' : ''}</div>
                  </div>
                </div>
              </div>

              <div onClick={() => setRole('buyer')} style={{
                border: `2px solid ${role === 'buyer' ? 'var(--accent2)' : 'var(--border)'}`,
                borderRadius: '14px', padding: '1.5rem',
                cursor: 'pointer', transition: 'all 0.2s',
                background: role === 'buyer' ? 'rgba(255,101,132,0.08)' : 'transparent',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: 'rgba(255,101,132,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem',
                  }}>🏢</div>
                  <div>
                    <div style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: '0.2rem' }}>I am a Buyer / Client</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.83rem' }}>Hire top developers, build faster</div>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      border: `2px solid ${role === 'buyer' ? 'var(--accent2)' : 'var(--border)'}`,
                      background: role === 'buyer' ? 'var(--accent2)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.6rem', color: '#fff',
                    }}>{role === 'buyer' ? '✓' : ''}</div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => role && setStep(2)}
              style={{
                width: '100%', padding: '14px',
                background: role ? (role === 'developer' ? 'var(--accent)' : 'var(--accent2)') : 'var(--border)',
                border: 'none', borderRadius: '10px',
                color: role ? '#fff' : 'var(--muted)',
                fontFamily: 'Syne', fontWeight: 600, fontSize: '1rem',
                cursor: role ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
              }}
            >Continue →</button>

            <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem', marginTop: '1.5rem' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Log In</Link>
            </p>
          </>
        )}

        {/* STEP 2 - Form */}
        {step === 2 && (
          <>
            <button onClick={() => setStep(1)} style={{
              background: 'transparent', border: 'none',
              color: 'var(--muted)', cursor: 'pointer',
              fontSize: '0.85rem', marginBottom: '1.5rem',
              padding: 0, display: 'flex', alignItems: 'center', gap: '4px',
            }}>← Back</button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: role === 'developer' ? 'rgba(108,99,255,0.15)' : 'rgba(255,101,132,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem',
              }}>{role === 'developer' ? '💻' : '🏢'}</div>
              <div>
                <div style={{ fontFamily: 'Syne', fontWeight: 700 }}>
                  {role === 'developer' ? 'Developer Account' : 'Buyer Account'}
                </div>
                <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Fill in your details</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Ali Hassan' },
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
                    style={{
                      width: '100%', padding: '12px 14px',
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px', color: 'var(--text)',
                      fontSize: '0.9rem', outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => (e.target as HTMLElement).style.borderColor = role === 'developer' ? 'var(--accent)' : 'var(--accent2)'}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading ? 'var(--border)' : role === 'developer' ? 'var(--accent)' : 'var(--accent2)',
                border: 'none', borderRadius: '10px',
                color: '#fff', fontFamily: 'Syne',
                fontWeight: 600, fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}>
              {loading ? 'Creating Account...' : `Create ${role === 'developer' ? 'Developer' : 'Buyer'} Account`}
            </button>

            <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.78rem', marginTop: '1rem', lineHeight: 1.6 }}>
              By signing up, you agree to our{' '}
              <Link href="#" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Terms</Link>{' '}
              and{' '}
              <Link href="#" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Privacy Policy</Link>
            </p>
          </>
        )}

      </div>
    </main>
  );
}
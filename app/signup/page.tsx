'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function SignUp() {
  const [role, setRole] = useState<'developer' | 'buyer' | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      setError('Please fill all fields!');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters!');
      return;
    }
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.name, role: role }
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Welcome email bhejo
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'welcome',
          to: form.email,
          name: form.name,
        }),
      });
    } catch (e) {
      console.log('Email error:', e);
    }

    setLoading(false);
    window.location.href = role === 'developer' ? '/dashboard' : '/buyer-dashboard';
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
          Already a member?{' '}
          <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </nav>

      {/* MAIN */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--text)' }}>
              {step === 1 ? 'Join DevLpers' : `Create ${role === 'developer' ? 'Developer' : 'Client'} Account`}
            </h1>
            <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
              {step === 1 ? 'Start hiring or get hired today' : 'Fill in your details to get started'}
            </p>
          </div>

          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: '6px', padding: '0.75rem 1rem',
              color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem',
            }}>⚠️ {error}</div>
          )}

          <div style={{
            background: '#fff', border: '1px solid var(--border)',
            borderRadius: '8px', padding: '2rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>

            {/* STEP 1 - Role Selection */}
            {step === 1 && (
              <>
                <p style={{ color: 'var(--text)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '1rem' }}>
                  I want to...
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>

                  {/* Developer */}
                  <div onClick={() => setRole('developer')} style={{
                    border: `2px solid ${role === 'developer' ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: '8px', padding: '1.25rem',
                    cursor: 'pointer', transition: 'all 0.2s',
                    background: role === 'developer' ? '#f0fdf4' : '#fff',
                    display: 'flex', alignItems: 'center', gap: '1rem',
                  }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '8px',
                      background: role === 'developer' ? '#dcfce7' : '#f5f5f5',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.5rem', flexShrink: 0,
                    }}>💻</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '0.2rem' }}>Work as a Developer</div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>Find clients, showcase skills, earn money</div>
                    </div>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      border: `2px solid ${role === 'developer' ? 'var(--accent)' : 'var(--border)'}`,
                      background: role === 'developer' ? 'var(--accent)' : '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: '0.65rem', flexShrink: 0,
                    }}>{role === 'developer' ? '✓' : ''}</div>
                  </div>

                  {/* Buyer */}
                  <div onClick={() => setRole('buyer')} style={{
                    border: `2px solid ${role === 'buyer' ? 'var(--accent2)' : 'var(--border)'}`,
                    borderRadius: '8px', padding: '1.25rem',
                    cursor: 'pointer', transition: 'all 0.2s',
                    background: role === 'buyer' ? '#fff7ed' : '#fff',
                    display: 'flex', alignItems: 'center', gap: '1rem',
                  }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '8px',
                      background: role === 'buyer' ? '#fed7aa' : '#f5f5f5',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.5rem', flexShrink: 0,
                    }}>🏢</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '0.2rem' }}>Hire a Developer</div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>Post jobs, hire top talent, build faster</div>
                    </div>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      border: `2px solid ${role === 'buyer' ? 'var(--accent2)' : 'var(--border)'}`,
                      background: role === 'buyer' ? 'var(--accent2)' : '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: '0.65rem', flexShrink: 0,
                    }}>{role === 'buyer' ? '✓' : ''}</div>
                  </div>
                </div>

                <button onClick={() => role && setStep(2)} style={{
                  width: '100%', padding: '12px',
                  background: role ? 'var(--accent)' : '#e4e5e7',
                  border: 'none', borderRadius: '6px',
                  color: role ? '#fff' : 'var(--muted)',
                  fontWeight: 700, fontSize: '0.95rem',
                  cursor: role ? 'pointer' : 'not-allowed',
                }}>Continue →</button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                  <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>or</span>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                </div>

                <button style={{
                  width: '100%', padding: '11px',
                  background: '#fff', border: '1px solid var(--border)',
                  borderRadius: '6px', color: 'var(--text)',
                  fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                }}>
                  🌐 Continue with Google
                </button>
              </>
            )}

            {/* STEP 2 - Form */}
            {step === 2 && (
              <>
                <button onClick={() => setStep(1)} style={{
                  background: 'transparent', border: 'none',
                  color: 'var(--text2)', cursor: 'pointer',
                  fontSize: '0.85rem', marginBottom: '1.25rem',
                  padding: 0, display: 'flex', alignItems: 'center', gap: '4px',
                }}>← Back</button>

                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  background: role === 'developer' ? '#f0fdf4' : '#fff7ed',
                  border: `1px solid ${role === 'developer' ? '#bbf7d0' : '#fed7aa'}`,
                  borderRadius: '6px', padding: '6px 12px',
                  fontSize: '0.82rem', fontWeight: 600,
                  color: role === 'developer' ? 'var(--accent)' : 'var(--accent2)',
                  marginBottom: '1.25rem',
                }}>
                  {role === 'developer' ? '💻 Developer Account' : '🏢 Client Account'}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  {[
                    { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Ali Hassan' },
                    { label: 'Email Address', name: 'email', type: 'email', placeholder: 'ali@example.com' },
                    { label: 'Password', name: 'password', type: 'password', placeholder: 'Min. 6 characters' },
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
                        style={{
                          width: '100%', padding: '10px 14px',
                          border: '1px solid var(--border)',
                          borderRadius: '6px', color: 'var(--text)',
                          fontSize: '0.9rem', outline: 'none',
                          boxSizing: 'border-box', background: '#fff',
                        }}
                        onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--accent)'}
                        onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'}
                      />
                    </div>
                  ))}
                </div>

                <button onClick={handleSubmit} disabled={loading} style={{
                  width: '100%', padding: '12px',
                  background: loading ? '#a7f3d0' : 'var(--accent)',
                  border: 'none', borderRadius: '6px',
                  color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}>
                  {loading ? 'Creating Account...' : `Create ${role === 'developer' ? 'Developer' : 'Client'} Account`}
                </button>

                <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.78rem', marginTop: '1rem', lineHeight: 1.6 }}>
                  By joining, you agree to our{' '}
                  <Link href="#" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Terms</Link>{' '}
                  and{' '}
                  <Link href="#" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Privacy Policy</Link>
                </p>
              </>
            )}
          </div>

          <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: '0.85rem', marginTop: '1.5rem' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>

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
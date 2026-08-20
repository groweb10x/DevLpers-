'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [socialLoading, setSocialLoading] = useState('');

  const handleLogin = async () => {
    if (!email || !password) { setError('Please fill all fields!'); return; }
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Role based redirect
    const role = data.user?.user_metadata?.role || 'developer';
    if (role === 'client') window.location.href = '/buyer-dashboard';
    else window.location.href = '/dashboard';
  };

  const handleGitHub = async () => {
    setSocialLoading('github');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) { setError(error.message); setSocialLoading(''); }
  };

  const handleGoogle = async () => {
    setSocialLoading('google');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) { setError(error.message); setSocialLoading(''); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>

      {/* NAVBAR */}
      <nav style={{
        background: '#fff', borderBottom: '1px solid #e4e5e7',
        padding: '0 5%', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#1dbf73', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', color: '#fff' }}>D</div>
          <span style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '1.3rem', color: '#404145' }}>
            Dev<span style={{ color: '#1dbf73' }}>Lpers</span>
          </span>
        </Link>
        <p style={{ color: '#62646a', fontSize: '0.9rem' }}>
          New to DevLpers?{' '}
          <Link href="/signup" style={{ color: '#1dbf73', fontWeight: 600, textDecoration: 'none' }}>Join Free</Link>
        </p>
      </nav>

      {/* MAIN */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '1.75rem', marginBottom: '0.5rem', color: '#1a1a2e' }}>
              Welcome Back 👋
            </h1>
            <p style={{ color: '#62646a', fontSize: '0.9rem' }}>Sign in to your DevLpers account</p>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.75rem 1rem', color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem' }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>

            {/* SOCIAL BUTTONS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>

              {/* GitHub */}
              <button onClick={handleGitHub} disabled={!!socialLoading} style={{
                width: '100%', padding: '12px',
                background: socialLoading === 'github' ? '#f0f0f0' : '#24292e',
                border: 'none', borderRadius: '8px',
                color: '#fff', fontWeight: 600, fontSize: '0.9rem',
                cursor: socialLoading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                transition: 'all 0.2s',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                {socialLoading === 'github' ? 'Connecting...' : 'Continue with GitHub'}
              </button>

              {/* Google */}
              <button onClick={handleGoogle} disabled={!!socialLoading} style={{
                width: '100%', padding: '12px',
                background: socialLoading === 'google' ? '#f0f0f0' : '#fff',
                border: '1px solid #e4e5e7', borderRadius: '8px',
                color: '#404145', fontWeight: 600, fontSize: '0.9rem',
                cursor: socialLoading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                transition: 'all 0.2s',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {socialLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
              </button>
            </div>

            {/* DIVIDER */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1, height: '1px', background: '#e4e5e7' }} />
              <span style={{ color: '#95979d', fontSize: '0.8rem' }}>or sign in with email</span>
              <div style={{ flex: 1, height: '1px', background: '#e4e5e7' }} />
            </div>

            {/* EMAIL FORM */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', color: '#404145', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="ali@example.com"
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  style={{
                    width: '100%', padding: '11px 14px',
                    border: '1px solid #e4e5e7', borderRadius: '8px',
                    fontSize: '0.9rem', outline: 'none', color: '#404145',
                    boxSizing: 'border-box', background: '#fff',
                  }}
                  onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                  onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
                />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <label style={{ color: '#404145', fontSize: '0.85rem', fontWeight: 500 }}>Password</label>
                  <Link href="/forgot-password" style={{ color: '#1dbf73', fontSize: '0.82rem', textDecoration: 'none' }}>
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Your password"
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  style={{
                    width: '100%', padding: '11px 14px',
                    border: '1px solid #e4e5e7', borderRadius: '8px',
                    fontSize: '0.9rem', outline: 'none', color: '#404145',
                    boxSizing: 'border-box', background: '#fff',
                  }}
                  onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                  onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
                />
              </div>
            </div>

            <button onClick={handleLogin} disabled={loading} style={{
              width: '100%', padding: '12px',
              background: loading ? '#a7f3d0' : '#1dbf73',
              border: 'none', borderRadius: '8px',
              color: '#fff', fontWeight: 700, fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </div>

          <p style={{ textAlign: 'center', color: '#62646a', fontSize: '0.85rem', marginTop: '1.5rem' }}>
            Don't have an account?{' '}
            <Link href="/signup" style={{ color: '#1dbf73', fontWeight: 600, textDecoration: 'none' }}>Join Free</Link>
          </p>

          {/* Developer Note */}
          <div style={{ marginTop: '1.5rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.85rem', textAlign: 'center' }}>
            <p style={{ color: '#1dbf73', fontSize: '0.78rem', fontWeight: 500 }}>
              👨‍💻 Developer? Sign in with GitHub for instant access!
            </p>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '1.5rem', borderTop: '1px solid #e4e5e7', color: '#95979d', fontSize: '0.8rem' }}>
        © 2026 DevLpers · <Link href="#" style={{ color: '#95979d', textDecoration: 'none' }}>Privacy</Link> · <Link href="#" style={{ color: '#95979d', textDecoration: 'none' }}>Terms</Link>
      </div>
    </div>
  );
}
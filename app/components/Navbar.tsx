'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(10,10,15,0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 5%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px',
      }}>

        {/* LOGO */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Syne', fontWeight: 800, fontSize: '1rem', color: '#fff',
          }}>D</div>
          <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.4rem', color: 'var(--accent)' }}>
            Dev<span style={{ color: 'var(--text)' }}>Lpers</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="desktop-nav" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {[
            { label: 'Browse Devs', href: '/developers' },
            { label: 'Find Jobs', href: '/jobs' },
            { label: 'How it Works', href: '/#how-it-works' },
            { label: 'Pricing', href: '/pricing' },
          ].map(item => (
            <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
              <span style={{
                color: 'var(--muted)', fontSize: '0.9rem',
                transition: 'color 0.2s', cursor: 'pointer',
              }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = 'var(--text)'}
                onMouseLeave={e => (e.target as HTMLElement).style.color = 'var(--muted)'}
              >{item.label}</span>
            </Link>
          ))}
        </div>

        {/* RIGHT BUTTONS — DESKTOP */}
        <div className="desktop-nav" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user ? (
            <>
              <Link href={user.user_metadata?.role === 'developer' ? '/dashboard' : '/buyer-dashboard'}>
                <button style={{
                  background: 'transparent', border: '1px solid var(--border)',
                  color: 'var(--text)', padding: '8px 20px', borderRadius: '8px',
                  cursor: 'pointer', fontSize: '0.9rem'
                }}>Dashboard</button>
              </Link>
              <button onClick={handleLogout} style={{
                background: 'var(--accent2)', border: 'none',
                color: '#fff', padding: '8px 20px', borderRadius: '8px',
                cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500
              }}>Log Out</button>
            </>
          ) : (
            <>
              <Link href="/login">
                <button style={{
                  background: 'transparent', border: '1px solid var(--border)',
                  color: 'var(--text)', padding: '8px 20px', borderRadius: '8px',
                  cursor: 'pointer', fontSize: '0.9rem'
                }}>Log In</button>
              </Link>
              <Link href="/signup">
                <button style={{
                  background: 'var(--accent)', border: 'none',
                  color: '#fff', padding: '8px 20px', borderRadius: '8px',
                  cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500
                }}>Sign Up Free</button>
              </Link>
            </>
          )}
        </div>

        {/* HAMBURGER — MOBILE */}
        <button
          className="mobile-nav"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'transparent', border: 'none',
            color: 'var(--text)', cursor: 'pointer',
            fontSize: '1.5rem', padding: '8px',
            display: 'none',
          }}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: '64px', left: 0, right: 0, zIndex: 99,
          background: 'var(--card)',
          borderBottom: '1px solid var(--border)',
          padding: '1.5rem 5%',
          display: 'flex', flexDirection: 'column', gap: '1rem',
        }}>
          {[
            { label: 'Browse Devs', href: '/developers' },
            { label: 'Find Jobs', href: '/jobs' },
            { label: 'How it Works', href: '/#how-it-works' },
            { label: 'Pricing', href: '/pricing' },
          ].map(item => (
            <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>
              <div style={{
                color: 'var(--text)', fontSize: '1rem',
                padding: '0.75rem 0',
                borderBottom: '1px solid var(--border)',
              }}>{item.label}</div>
            </Link>
          ))}

          {user ? (
            <>
              <Link href={user.user_metadata?.role === 'developer' ? '/dashboard' : '/buyer-dashboard'} onClick={() => setMenuOpen(false)}>
                <button style={{
                  width: '100%', padding: '12px',
                  background: 'transparent', border: '1px solid var(--border)',
                  borderRadius: '8px', color: 'var(--text)',
                  cursor: 'pointer', fontSize: '1rem',
                }}>Dashboard</button>
              </Link>
              <button onClick={handleLogout} style={{
                width: '100%', padding: '12px',
                background: 'var(--accent2)', border: 'none',
                borderRadius: '8px', color: '#fff',
                cursor: 'pointer', fontSize: '1rem', fontWeight: 600,
              }}>Log Out</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)}>
                <button style={{
                  width: '100%', padding: '12px',
                  background: 'transparent', border: '1px solid var(--border)',
                  borderRadius: '8px', color: 'var(--text)',
                  cursor: 'pointer', fontSize: '1rem',
                }}>Log In</button>
              </Link>
              <Link href="/signup" onClick={() => setMenuOpen(false)}>
                <button style={{
                  width: '100%', padding: '12px',
                  background: 'var(--accent)', border: 'none',
                  borderRadius: '8px', color: '#fff',
                  cursor: 'pointer', fontSize: '1rem', fontWeight: 600,
                }}>Sign Up Free</button>
              </Link>
            </>
          )}
        </div>
      )}

      {/* RESPONSIVE CSS */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}
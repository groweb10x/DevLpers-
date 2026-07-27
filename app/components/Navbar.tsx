'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);

useEffect(() => {
  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      const { data: profile } = await supabase
        .from('developer_profiles')
        .select('avatar_url, full_name')
        .eq('user_id', user.id)
        .maybeSingle();
      if (profile) setProfile(profile);
    }
  };
  getUser();
}, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: '#ffffff',
        borderBottom: '1px solid var(--border)',
        padding: '0 clamp(12px,4vw,5%)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>

        {/* LOGO */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Inter', fontWeight: 800, fontSize: '1rem', color: '#fff',
          }}>D</div>
          <span style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '1.4rem', color: 'var(--text)' }}>
            Dev<span style={{ color: 'var(--accent)' }}>Lpers</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="desktop-nav" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {[
            { label: 'Browse Devs', href: '/developers' },
            { label: 'Find Jobs', href: '/jobs' },
            { label: 'How it Works', href: '/#how-it-works' },
            { label: 'Pricing', href: '/pricing' },
            { label: 'Dev Tools', href: '/tools' },
          ].map(item => (
            <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
              <span style={{
                color: 'var(--text2)', fontSize: '0.9rem',
                fontWeight: 500, cursor: 'pointer',
              }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = 'var(--accent)'}
                onMouseLeave={e => (e.target as HTMLElement).style.color = 'var(--text2)'}
              >{item.label}</span>
            </Link>
          ))}
        </div>

        {/* RIGHT BUTTONS */}
        <div className="desktop-nav" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {user ? (
            <>
              <Link href={user.user_metadata?.role === 'developer' ? '/dashboard' : '/buyer-dashboard'}>
                <button style={{
                  background: 'transparent', border: '1px solid var(--border)',
                  color: 'var(--text)', padding: '8px 18px',
                  borderRadius: '4px', cursor: 'pointer',
                  fontSize: '0.9rem', fontWeight: 500,
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text)'; }}
                >Dashboard</button>
              </Link>
              {user && (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
    {profile?.avatar_url ? (
      <img src={profile.avatar_url} alt="avatar"
        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #1dbf73' }}
      />
    ) : (
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%',
        background: '#1dbf73', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: '0.85rem',
      }}>
        {(profile?.full_name || user?.email)?.[0]?.toUpperCase()}
      </div>
    )}
  </div>
)}
              <button onClick={handleLogout} style={{
                background: 'var(--accent)', border: 'none', color: '#fff',
                padding: '8px 18px', borderRadius: '4px',
                cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--accent-dark)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--accent)'}
              >Log Out</button>
            </>
          ) : (
            <>
              <Link href="/login">
                <button style={{
                  background: 'transparent', border: '1px solid var(--border)',
                  color: 'var(--text)', padding: '8px 18px',
                  borderRadius: '4px', cursor: 'pointer',
                  fontSize: '0.9rem', fontWeight: 500,
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text)'; }}
                >Log In</button>
              </Link>
              <Link href="/signup">
                <button style={{
                  background: 'var(--accent)', border: 'none', color: '#fff',
                  padding: '8px 18px', borderRadius: '4px',
                  cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--accent-dark)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--accent)'}
                >Join Now</button>
              </Link>
            </>
          )}
        </div>

        {/* HAMBURGER */}
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
          background: '#ffffff',
          borderBottom: '1px solid var(--border)',
          padding: '1.5rem 5%',
          display: 'flex', flexDirection: 'column', gap: '0.75rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}>
          {[
            { label: 'Browse Devs', href: '/developers' },
            { label: 'Find Jobs', href: '/jobs' },
            { label: 'How it Works', href: '/#how-it-works' },
            { label: 'Pricing', href: '/pricing' },
          ].map(item => (
            <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>
              <div style={{
                color: 'var(--text)', fontSize: '1rem', fontWeight: 500,
                padding: '0.75rem 0', borderBottom: '1px solid var(--border)',
              }}>{item.label}</div>
            </Link>
          ))}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem' }}>
            {user ? (
              <>
                <Link href={user.user_metadata?.role === 'developer' ? '/dashboard' : '/buyer-dashboard'} onClick={() => setMenuOpen(false)}>
                  <button style={{
                    width: '100%', padding: '12px',
                    background: 'transparent', border: '1px solid var(--border)',
                    borderRadius: '4px', color: 'var(--text)',
                    cursor: 'pointer', fontSize: '1rem', fontWeight: 500,
                  }}>Dashboard</button>
                </Link>
                <button onClick={handleLogout} style={{
                  width: '100%', padding: '12px',
                  background: 'var(--accent)', border: 'none',
                  borderRadius: '4px', color: '#fff',
                  cursor: 'pointer', fontSize: '1rem', fontWeight: 600,
                }}>Log Out</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <button style={{
                    width: '100%', padding: '12px',
                    background: 'transparent', border: '1px solid var(--border)',
                    borderRadius: '4px', color: 'var(--text)',
                    cursor: 'pointer', fontSize: '1rem', fontWeight: 500,
                  }}>Log In</button>
                </Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)}>
                  <button style={{
                    width: '100%', padding: '12px',
                    background: 'var(--accent)', border: 'none',
                    borderRadius: '4px', color: '#fff',
                    cursor: 'pointer', fontSize: '1rem', fontWeight: 600,
                  }}>Join Now</button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        .desktop-nav { display: flex !important; }
        .mobile-nav { display: none !important; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: block !important; }
        }
      `}</style>
    </div>
  );
}
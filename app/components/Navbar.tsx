'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [activeRole, setActiveRole] = useState<string>('developer');
  const [switchOpen, setSwitchOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const switchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: prof } = await supabase
          .from('developer_profiles')
          .select('avatar_url, full_name, active_role, is_developer, is_client')
          .eq('user_id', user.id)
          .maybeSingle();
        if (prof) {
          setProfile(prof);
          setActiveRole(prof.active_role || user.user_metadata?.role || 'developer');
        } else {
          setActiveRole(user.user_metadata?.role || 'developer');
        }

        // Fetch unread notifications
        const { data: notifs } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_read', false)
          .order('created_at', { ascending: false })
          .limit(10);
        if (notifs) setNotifications(notifs);

        // Real-time notifications
        const channel = supabase
          .channel('navbar-notifs-' + user.id)
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          }, (payload) => {
            setNotifications(prev => [payload.new as any, ...prev.slice(0, 9)]);
          })
          .subscribe();

        return () => { supabase.removeChannel(channel); };
      }
    };
    getUser();

    const handleClick = (e: MouseEvent) => {
      if (switchRef.current && !switchRef.current.contains(e.target as Node)) setSwitchOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const switchRole = async (role: string) => {
    setActiveRole(role);
    setSwitchOpen(false);
    if (user) {
      await supabase.from('developer_profiles')
        .update({ active_role: role })
        .eq('user_id', user.id);
    }
    if (role === 'developer') window.location.href = '/dashboard';
    else if (role === 'client') window.location.href = '/buyer-dashboard';
    else if (role === 'tools') window.location.href = '/tools-dashboard';
  };

  const markAllRead = async () => {
    if (!user) return;
    await supabase.from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
    setNotifications([]);
    setNotifOpen(false);
  };

  const markOneRead = async (notifId: string, link?: string) => {
    await supabase.from('notifications')
      .update({ is_read: true })
      .eq('id', notifId);
    setNotifications(prev => prev.filter(n => n.id !== notifId));
    setNotifOpen(false);
    if (link) window.location.href = link;
  };

  const getDashboardLink = () => {
    if (activeRole === 'client') return '/buyer-dashboard';
    if (activeRole === 'tools') return '/tools-dashboard';
    return '/dashboard';
  };

  const getRoleLabel = () => {
    if (activeRole === 'client') return '🏢 Client';
    if (activeRole === 'tools') return '🛠️ Tools';
    return '💻 Developer';
  };

  const getRoleColor = () => {
    if (activeRole === 'client') return '#f59e0b';
    if (activeRole === 'tools') return '#8b5cf6';
    return '#1dbf73';
  };

  const getNotifIcon = (type: string) => {
    if (type === 'payment') return '💰';
    if (type === 'message') return '💬';
    if (type === 'proposal') return '📨';
    if (type === 'success') return '✅';
    if (type === 'warning') return '⚠️';
    return '🔔';
  };

  return (
    <div>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: '#ffffff',
        borderBottom: '1px solid #e4e5e7',
        padding: '0 clamp(12px,4vw,5%)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>

        {/* LOGO */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#1dbf73', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 800, fontSize: '1rem', color: '#fff' }}>D</div>
          <span style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '1.4rem', color: '#404145' }}>
            Dev<span style={{ color: '#1dbf73' }}>Lpers</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="desktop-nav" style={{ display: 'flex', gap: '1.75rem', alignItems: 'center' }}>
          {[
            { label: 'Browse Devs', href: '/developers' },
            { label: 'Find Jobs', href: '/jobs' },
            { label: 'AI Agents', href: '/ai-agents' },
            { label: 'Tools', href: '/tools' },
            { label: 'Pricing', href: '/pricing' },
          ].map(item => (
            <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
              <span style={{ color: '#62646a', fontSize: '0.88rem', fontWeight: 500, cursor: 'pointer', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = '#1dbf73'}
                onMouseLeave={e => (e.target as HTMLElement).style.color = '#62646a'}
              >{item.label}</span>
            </Link>
          ))}
        </div>

        {/* RIGHT */}
        <div className="desktop-nav" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {user ? (
            <>
              {/* ROLE SWITCH */}
              <div ref={switchRef} style={{ position: 'relative' }}>
                <button onClick={() => setSwitchOpen(!switchOpen)} style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: `${getRoleColor()}15`,
                  border: `1px solid ${getRoleColor()}44`,
                  color: getRoleColor(),
                  padding: '7px 14px', borderRadius: '6px',
                  cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
                }}>
                  {getRoleLabel()} <span style={{ fontSize: '0.65rem' }}>▼</span>
                </button>

                {switchOpen && (
                  <div style={{
                    position: 'absolute', top: '110%', right: 0,
                    background: '#fff', border: '1px solid #e4e5e7',
                    borderRadius: '12px', padding: '0.5rem',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    minWidth: '200px', zIndex: 200,
                  }}>
                    <div style={{ padding: '0.4rem 0.75rem', color: '#95979d', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Switch Mode
                    </div>
                    {[
                      { role: 'developer', icon: '💻', label: 'Developer Mode', desc: 'Find jobs & earn' },
                      { role: 'client', icon: '🏢', label: 'Client Mode', desc: 'Post jobs & hire' },
                      { role: 'tools', icon: '🛠️', label: 'Tools Mode', desc: 'Access dev tools' },
                    ].map(r => (
                      <button key={r.role} onClick={() => switchRole(r.role)} style={{
                        width: '100%', padding: '0.6rem 0.75rem',
                        background: activeRole === r.role ? '#f0fdf4' : 'transparent',
                        border: 'none', borderRadius: '8px',
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        cursor: 'pointer', textAlign: 'left',
                        color: activeRole === r.role ? '#1dbf73' : '#404145',
                      }}>
                        <span style={{ fontSize: '1.1rem' }}>{r.icon}</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{r.label}</div>
                          <div style={{ color: '#95979d', fontSize: '0.7rem' }}>{r.desc}</div>
                        </div>
                        {activeRole === r.role && <span style={{ marginLeft: 'auto', color: '#1dbf73' }}>✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* NOTIFICATIONS */}
              <div ref={notifRef} style={{ position: 'relative' }}>
                <button onClick={() => setNotifOpen(!notifOpen)} style={{
                  position: 'relative', background: 'transparent',
                  border: '1px solid #e4e5e7', color: '#404145',
                  padding: '7px 12px', borderRadius: '6px',
                  cursor: 'pointer', fontSize: '1rem',
                  transition: 'all 0.15s',
                }}>
                  🔔
                  {notifications.length > 0 && (
                    <span style={{
                      position: 'absolute', top: '-6px', right: '-6px',
                      background: '#dc2626', color: '#fff',
                      borderRadius: '50%', width: '18px', height: '18px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.65rem', fontWeight: 700,
                      animation: 'pulse 2s infinite',
                    }}>{notifications.length > 9 ? '9+' : notifications.length}</span>
                  )}
                </button>

                {notifOpen && (
                  <div style={{
                    position: 'absolute', top: '110%', right: 0,
                    background: '#fff', border: '1px solid #e4e5e7',
                    borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    minWidth: '320px', maxHeight: '420px', overflowY: 'auto',
                    zIndex: 200,
                  }}>
                    <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e4e5e7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1a2e' }}>
                        Notifications {notifications.length > 0 && `(${notifications.length})`}
                      </span>
                      {notifications.length > 0 && (
                        <button onClick={markAllRead} style={{ background: 'transparent', border: 'none', color: '#1dbf73', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                          Mark all read
                        </button>
                      )}
                    </div>

                    {notifications.length === 0 ? (
                      <div style={{ padding: '2.5rem', textAlign: 'center', color: '#95979d' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔔</div>
                        <p style={{ fontSize: '0.85rem', fontWeight: 500, color: '#62646a' }}>All caught up!</p>
                        <p style={{ fontSize: '0.78rem', marginTop: '0.25rem' }}>No new notifications</p>
                      </div>
                    ) : (
                      notifications.map((notif, i) => (
                        <div key={i} onClick={() => markOneRead(notif.id, notif.link)} style={{
                          padding: '0.85rem 1.25rem',
                          borderBottom: '1px solid #f5f5f5',
                          cursor: 'pointer', display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                          background: '#fafffe',
                          transition: 'background 0.15s',
                        }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#f0fdf4'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#fafffe'}
                        >
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                            {getNotifIcon(notif.type)}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#1a1a2e', marginBottom: '0.2rem' }}>{notif.title}</div>
                            <div style={{ color: '#62646a', fontSize: '0.78rem', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{notif.message}</div>
                            <div style={{ color: '#95979d', fontSize: '0.7rem', marginTop: '0.3rem' }}>
                              {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(notif.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1dbf73', flexShrink: 0, marginTop: '4px' }} />
                        </div>
                      ))
                    )}

                    {notifications.length > 0 && (
                      <div style={{ padding: '0.75rem', textAlign: 'center', borderTop: '1px solid #e4e5e7' }}>
                        <button onClick={markAllRead} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#1dbf73', padding: '6px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                          Clear All Notifications
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* CONTRACTS LINK */}
              <Link href="/contracts" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'transparent', border: '1px solid #e4e5e7',
                  color: '#404145', padding: '7px 14px',
                  borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500,
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1dbf73'; (e.currentTarget as HTMLElement).style.color = '#1dbf73'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e4e5e7'; (e.currentTarget as HTMLElement).style.color = '#404145'; }}
                >📋 Contracts</button>
              </Link>

              {/* DASHBOARD */}
              <Link href={getDashboardLink()} style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'transparent', border: '1px solid #e4e5e7',
                  color: '#404145', padding: '7px 14px',
                  borderRadius: '6px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 500,
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1dbf73'; (e.currentTarget as HTMLElement).style.color = '#1dbf73'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e4e5e7'; (e.currentTarget as HTMLElement).style.color = '#404145'; }}
                >Dashboard</button>
              </Link>

              {/* AVATAR */}
              <Link href="/profile-setup" style={{ textDecoration: 'none' }}>
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #1dbf73', cursor: 'pointer' }} />
                ) : (
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1dbf73', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', border: '2px solid #1dbf73' }}>
                    {(profile?.full_name || user?.email)?.[0]?.toUpperCase()}
                  </div>
                )}
              </Link>

              {/* LOGOUT */}
              <button onClick={handleLogout} style={{
                background: '#1dbf73', border: 'none', color: '#fff',
                padding: '8px 16px', borderRadius: '6px',
                cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600,
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#19a463'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#1dbf73'}
              >Log Out</button>
            </>
          ) : (
            <>
              <Link href="/login">
                <button style={{ background: 'transparent', border: '1px solid #e4e5e7', color: '#404145', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1dbf73'; (e.currentTarget as HTMLElement).style.color = '#1dbf73'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e4e5e7'; (e.currentTarget as HTMLElement).style.color = '#404145'; }}
                >Log In</button>
              </Link>
              <Link href="/signup">
                <button style={{ background: '#1dbf73', border: 'none', color: '#fff', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#19a463'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#1dbf73'}
                >Join Now</button>
              </Link>
            </>
          )}
        </div>

        {/* HAMBURGER */}
        <button className="mobile-nav" onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'transparent', border: 'none', color: '#404145', cursor: 'pointer', fontSize: '1.5rem', padding: '8px', display: 'none' }}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: '64px', left: 0, right: 0, zIndex: 99,
          background: '#fff', borderBottom: '1px solid #e4e5e7',
          padding: '1.5rem 5%',
          display: 'flex', flexDirection: 'column', gap: '0.75rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}>
          {[
            { label: 'Browse Devs', href: '/developers' },
            { label: 'Find Jobs', href: '/jobs' },
            { label: 'AI Agents', href: '/ai-agents' },
            { label: 'Tools', href: '/tools' },
            { label: 'Pricing', href: '/pricing' },
            { label: 'Contracts', href: '/contracts' },
          ].map(item => (
            <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>
              <div style={{ color: '#404145', fontSize: '1rem', fontWeight: 500, padding: '0.75rem 0', borderBottom: '1px solid #e4e5e7' }}>
                {item.label}
              </div>
            </Link>
          ))}

          {user && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.5rem 0' }}>
              <div style={{ color: '#95979d', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase' }}>Switch Mode</div>
              {[
                { role: 'developer', icon: '💻', label: 'Developer Mode' },
                { role: 'client', icon: '🏢', label: 'Client Mode' },
                { role: 'tools', icon: '🛠️', label: 'Tools Mode' },
              ].map(r => (
                <button key={r.role} onClick={() => { switchRole(r.role); setMenuOpen(false); }} style={{
                  width: '100%', padding: '10px',
                  background: activeRole === r.role ? '#f0fdf4' : '#fff',
                  border: `1px solid ${activeRole === r.role ? '#bbf7d0' : '#e4e5e7'}`,
                  borderRadius: '6px', color: activeRole === r.role ? '#1dbf73' : '#404145',
                  cursor: 'pointer', fontSize: '0.88rem',
                  fontWeight: activeRole === r.role ? 600 : 400,
                  textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}>
                  {r.icon} {r.label} {activeRole === r.role && '✓'}
                </button>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem' }}>
            {user ? (
              <>
                <Link href={getDashboardLink()} onClick={() => setMenuOpen(false)}>
                  <button style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid #e4e5e7', borderRadius: '6px', color: '#404145', cursor: 'pointer', fontSize: '1rem', fontWeight: 500 }}>Dashboard</button>
                </Link>
                <button onClick={handleLogout} style={{ width: '100%', padding: '12px', background: '#1dbf73', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '1rem', fontWeight: 600 }}>Log Out</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <button style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid #e4e5e7', borderRadius: '6px', color: '#404145', cursor: 'pointer', fontSize: '1rem', fontWeight: 500 }}>Log In</button>
                </Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)}>
                  <button style={{ width: '100%', padding: '12px', background: '#1dbf73', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '1rem', fontWeight: 600 }}>Join Now</button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        .desktop-nav { display: flex !important; }
        .mobile-nav { display: none !important; }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: block !important; }
        }
      `}</style>
    </div>
  );
}
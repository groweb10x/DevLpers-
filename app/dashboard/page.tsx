'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [myProposals, setMyProposals] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [sellerLevel, setSellerLevel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }
      setUser(user);

      // Fetch profile with avatar
      const { data: profileData } = await supabase
        .from('developer_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (profileData) setProfile(profileData);

      const { data: proposals } = await supabase
        .from('proposals').select('*, jobs(*)')
        .eq('developer_id', user.id)
        .order('created_at', { ascending: false });
      if (proposals) setMyProposals(proposals);

      const { data: sub } = await supabase
        .from('subscriptions').select('*')
        .eq('user_id', user.id).maybeSingle();
      if (!sub) {
        const { data: newSub } = await supabase
          .from('subscriptions')
          .insert({ user_id: user.id, plan: 'free', bids_remaining: 5, bids_total: 5, expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() })
          .select().maybeSingle();
        if (newSub) setSubscription(newSub);
      } else { setSubscription(sub); }

      const { data: level } = await supabase
        .from('seller_levels').select('*')
        .eq('user_id', user.id).maybeSingle();
      if (!level) {
        const { data: newLevel } = await supabase
          .from('seller_levels')
          .insert({ user_id: user.id, level: 1, total_jobs: 0, total_earnings: 0, rating: 0, is_devmarket_choice: false })
          .select().maybeSingle();
        if (newLevel) setSellerLevel(newLevel);
      } else { setSellerLevel(level); }

      setLoading(false);
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#95979d' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <p>Loading...</p>
      </div>
    </div>
  );

  const userName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Developer';
  const userInitial = userName[0].toUpperCase();
  const avatarUrl = profile?.avatar_url || null;

  const levelIcons: Record<number, string> = { 1: '🥉', 2: '🥈', 3: '🥇' };
  const levelColors: Record<number, string> = { 1: '#92400e', 2: '#374151', 3: '#78350f' };
  const levelBg: Record<number, string> = { 1: '#fef3c7', 2: '#f3f4f6', 3: '#fef9c3' };

  const navItems = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'proposals', icon: '📨', label: 'My Proposals' },
    { id: 'messages', icon: '💬', label: 'Messages' },
    { id: 'earnings', icon: '💰', label: 'Earnings' },
    { id: 'profile', icon: '👤', label: 'My Profile' },
  ];

  // Avatar Component
  const Avatar = ({ size = 40 }: { size?: number }) => (
    avatarUrl ? (
      <img
        src={avatarUrl}
        alt={userName}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '2px solid #1dbf73', flexShrink: 0 }}
      />
    ) : (
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: '#1dbf73', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: size * 0.35, flexShrink: 0,
      }}>{userInitial}</div>
    )
  );

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e4e5e7' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#1dbf73', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>D</div>
          <span style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '1.2rem', color: '#404145' }}>
            Dev<span style={{ color: '#1dbf73' }}>Lpers</span>
          </span>
        </Link>
      </div>

      {/* Profile with Avatar */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e4e5e7' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <Avatar size={44} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#404145', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</div>
            <span style={{
              background: levelBg[sellerLevel?.level || 1],
              color: levelColors[sellerLevel?.level || 1],
              fontSize: '0.7rem', fontWeight: 600,
              padding: '1px 6px', borderRadius: '4px',
            }}>
              {levelIcons[sellerLevel?.level || 1]} Level {sellerLevel?.level || 1}
            </span>
          </div>
        </div>

        {/* Bid Counter */}
        {subscription && (
          <div style={{
            background: subscription.plan === 'free' ? '#fef2f2' : '#f0fdf4',
            border: `1px solid ${subscription.plan === 'free' ? '#fecaca' : '#bbf7d0'}`,
            borderRadius: '6px', padding: '0.75rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ color: '#62646a', fontSize: '0.75rem', fontWeight: 500 }}>Bids Remaining</span>
              <span style={{ color: subscription.plan === 'free' ? '#dc2626' : '#1dbf73', fontSize: '0.75rem', fontWeight: 700 }}>
                {subscription.plan === 'free' ? `${subscription.bids_remaining}/${subscription.bids_total}` : '∞'}
              </span>
            </div>
            {subscription.plan === 'free' && (
              <div style={{ width: '100%', height: '4px', background: '#e5e7eb', borderRadius: '100px' }}>
                <div style={{
                  width: `${(subscription.bids_remaining / subscription.bids_total) * 100}%`,
                  height: '100%',
                  background: subscription.bids_remaining <= 2 ? '#dc2626' : '#1dbf73',
                  borderRadius: '100px',
                }} />
              </div>
            )}
            <div style={{ marginTop: '0.4rem' }}>
              <span style={{
                background: subscription.plan === 'free' ? '#fef2f2' : '#f0fdf4',
                color: subscription.plan === 'free' ? '#dc2626' : '#1dbf73',
                fontSize: '0.68rem', fontWeight: 700,
                padding: '1px 6px', borderRadius: '4px',
                border: `1px solid ${subscription.plan === 'free' ? '#fecaca' : '#bbf7d0'}`,
              }}>{subscription.plan.toUpperCase()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '0.75rem 0' }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }} style={{
            width: '100%', padding: '0.7rem 1.5rem',
            background: activeTab === item.id ? '#f0fdf4' : 'transparent',
            border: 'none',
            borderLeft: activeTab === item.id ? '3px solid #1dbf73' : '3px solid transparent',
            color: activeTab === item.id ? '#1dbf73' : '#62646a',
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            cursor: 'pointer', fontSize: '0.88rem',
            fontWeight: activeTab === item.id ? 600 : 400,
            textAlign: 'left', transition: 'all 0.15s',
          }}>
            <span>{item.icon}</span> {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom Buttons */}
      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e4e5e7', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Link href="/profile-setup" style={{ textDecoration: 'none' }}>
          <button style={{ width: '100%', padding: '8px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', color: '#1dbf73', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>
            👤 Edit Profile
          </button>
        </Link>
        <Link href="/pricing" style={{ textDecoration: 'none' }}>
          <button style={{ width: '100%', padding: '8px', background: '#1dbf73', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>
            ⚡ Upgrade Plan
          </button>
        </Link>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href="/report" style={{ textDecoration: 'none', flex: 1 }}>
            <button style={{ width: '100%', padding: '7px', background: '#fff5f5', border: '1px solid #fecaca', borderRadius: '4px', color: '#dc2626', cursor: 'pointer', fontSize: '0.78rem' }}>🚨 Report</button>
          </Link>
          <Link href="/support" style={{ textDecoration: 'none', flex: 1 }}>
            <button style={{ width: '100%', padding: '7px', background: '#fff', border: '1px solid #e4e5e7', borderRadius: '4px', color: '#62646a', cursor: 'pointer', fontSize: '0.78rem' }}>🎫 Support</button>
          </Link>
        </div>
        <button onClick={handleLogout} style={{ width: '100%', padding: '8px', background: '#fff', border: '1px solid #e4e5e7', borderRadius: '4px', color: '#62646a', cursor: 'pointer', fontSize: '0.82rem' }}>
          🚪 Log Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @media (min-width: 769px) {
          .dash-sidebar { display: flex !important; }
          .dash-mobile-header { display: none !important; }
          .dash-main { margin-left: 260px !important; }
        }
        @media (max-width: 768px) {
          .dash-sidebar { display: none !important; }
          .dash-mobile-header { display: flex !important; }
          .dash-main { margin-left: 0 !important; padding-top: 60px !important; }
        }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', background: '#fafafa' }}>

        {/* DESKTOP SIDEBAR */}
        <aside className="dash-sidebar" style={{
          width: '260px', minHeight: '100vh',
          background: '#fff', borderRight: '1px solid #e4e5e7',
          position: 'fixed', top: 0, left: 0, zIndex: 50,
          flexDirection: 'column', display: 'flex',
        }}>
          <SidebarContent />
        </aside>

        {/* MOBILE HEADER */}
        <div className="dash-mobile-header" style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: '#fff', borderBottom: '1px solid #e4e5e7',
          padding: '0 1rem', height: '60px',
          alignItems: 'center', justifyContent: 'space-between',
          display: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#1dbf73', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>D</div>
            <span style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '1.1rem', color: '#404145' }}>Dev<span style={{ color: '#1dbf73' }}>Lpers</span></span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Avatar size={32} />
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'transparent', border: '1px solid #e4e5e7', color: '#404145', cursor: 'pointer', fontSize: '1.2rem', padding: '6px 10px', borderRadius: '4px' }}>
              {sidebarOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* MOBILE SIDEBAR OVERLAY */}
        {sidebarOpen && (
          <>
            <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 98, background: 'rgba(0,0,0,0.4)' }} />
            <aside style={{ position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 99, width: '280px', background: '#fff', borderRight: '1px solid #e4e5e7', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              <SidebarContent />
            </aside>
          </>
        )}

        {/* MAIN CONTENT */}
        <main className="dash-main" style={{ flex: 1, padding: '2rem' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Avatar size={48} />
              <div>
                <h1 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', marginBottom: '0.1rem', color: '#404145' }}>
                  Welcome back, {userName} 👋
                </h1>
                <p style={{ color: '#95979d', fontSize: '0.85rem' }}>{user?.email}</p>
              </div>
            </div>
            <Link href="/jobs">
              <button style={{ background: '#1dbf73', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
                + Find Jobs
              </button>
            </Link>
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                {[
                  { label: 'Proposals', value: myProposals.length, icon: '📨', color: '#3b82f6' },
                  { label: 'Pending', value: myProposals.filter(p => p.status === 'Pending').length, icon: '⏳', color: '#f59e0b' },
                  { label: 'Accepted', value: myProposals.filter(p => p.status === 'Accepted').length, icon: '✅', color: '#1dbf73' },
                  { label: `Level ${sellerLevel?.level || 1}`, value: levelIcons[sellerLevel?.level || 1], icon: '🏆', color: levelColors[sellerLevel?.level || 1] },
                ].map(s => (
                  <div key={s.label} style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.2rem', color: s.color }}>{s.value}</div>
                    <div style={{ color: '#95979d', fontSize: '0.78rem' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Level Card */}
              <div style={{
                background: levelBg[sellerLevel?.level || 1],
                border: `1px solid ${sellerLevel?.level === 2 ? '#d1d5db' : '#fde68a'}`,
                borderRadius: '8px', padding: '1.25rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '2.5rem' }}>{levelIcons[sellerLevel?.level || 1]}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: levelColors[sellerLevel?.level || 1] }}>
                      Level {sellerLevel?.level || 1} Seller
                    </div>
                    <div style={{ color: levelColors[sellerLevel?.level || 1], fontSize: '0.82rem', opacity: 0.8 }}>
                      {sellerLevel?.total_jobs || 0} jobs completed
                      {sellerLevel?.level === 1 && ' · Complete 10 jobs for Level 2'}
                      {sellerLevel?.level === 2 && ' · Complete 50 jobs for Level 3'}
                      {sellerLevel?.level === 3 && ' · Top Level! 🎉'}
                    </div>
                  </div>
                </div>
                <Link href="/pricing">
                  <button style={{ background: '#1dbf73', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '4px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                    ⚡ Upgrade Plan
                  </button>
                </Link>
              </div>

              {/* Proposals */}
              <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#404145' }}>📨 My Proposals</h2>
                  <Link href="/jobs">
                    <button style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#1dbf73', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                      + Find Jobs
                    </button>
                  </Link>
                </div>
                {myProposals.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem', color: '#95979d', background: '#fafafa', borderRadius: '6px' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
                    <p style={{ marginBottom: '1rem', fontWeight: 500, color: '#62646a' }}>No proposals yet</p>
                    <Link href="/jobs">
                      <button style={{ background: '#1dbf73', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
                        Browse Jobs →
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {myProposals.map((p, i) => (
                      <div key={i} style={{ padding: '1rem', background: '#fafafa', borderRadius: '6px', border: '1px solid #e4e5e7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#404145', marginBottom: '0.25rem' }}>{p.jobs?.title || 'Job'}</div>
                          <div style={{ color: '#95979d', fontSize: '0.78rem' }}>Bid: ${p.bid_amount} · {new Date(p.created_at).toLocaleDateString()}</div>
                        </div>
                        <span style={{
                          background: p.status === 'Accepted' ? '#f0fdf4' : p.status === 'Declined' ? '#fef2f2' : '#eff6ff',
                          color: p.status === 'Accepted' ? '#1dbf73' : p.status === 'Declined' ? '#dc2626' : '#3b82f6',
                          border: `1px solid ${p.status === 'Accepted' ? '#bbf7d0' : p.status === 'Declined' ? '#fecaca' : '#bfdbfe'}`,
                          borderRadius: '100px', padding: '3px 12px', fontSize: '0.75rem', fontWeight: 600,
                        }}>{p.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Profile Complete CTA */}
              <div style={{ background: 'linear-gradient(135deg, #f0fdf4, #e8fdf2)', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.3rem', color: '#404145' }}>Complete Your Profile 🚀</h3>
                  <p style={{ color: '#62646a', fontSize: '0.83rem' }}>Add skills, bio and portfolio to attract more clients</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <Link href="/profile-setup">
                    <button style={{ background: '#1dbf73', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '4px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>Edit Profile</button>
                  </Link>
                  <Link href="/support">
                    <button style={{ background: '#fff', color: '#62646a', border: '1px solid #e4e5e7', padding: '9px 18px', borderRadius: '4px', fontSize: '0.85rem', cursor: 'pointer' }}>Support</button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* PROPOSALS TAB */}
          {activeTab === 'proposals' && (
            <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.5rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#404145', marginBottom: '1.25rem' }}>📨 All My Proposals</h2>
              {myProposals.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#95979d' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                  <p style={{ marginBottom: '1rem' }}>No proposals yet</p>
                  <Link href="/jobs">
                    <button style={{ background: '#1dbf73', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Browse Jobs →</button>
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {myProposals.map((p, i) => (
                    <div key={i} style={{ padding: '1.25rem', background: '#fafafa', borderRadius: '6px', border: '1px solid #e4e5e7' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#404145' }}>{p.jobs?.title || 'Job'}</div>
                        <span style={{
                          background: p.status === 'Accepted' ? '#f0fdf4' : p.status === 'Declined' ? '#fef2f2' : '#eff6ff',
                          color: p.status === 'Accepted' ? '#1dbf73' : p.status === 'Declined' ? '#dc2626' : '#3b82f6',
                          border: `1px solid ${p.status === 'Accepted' ? '#bbf7d0' : p.status === 'Declined' ? '#fecaca' : '#bfdbfe'}`,
                          borderRadius: '100px', padding: '3px 12px', fontSize: '0.75rem', fontWeight: 600,
                        }}>{p.status}</span>
                      </div>
                      <div style={{ color: '#95979d', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                        Bid: <strong style={{ color: '#1dbf73' }}>${p.bid_amount}</strong> · {new Date(p.created_at).toLocaleDateString()}
                      </div>
                      {p.cover_letter && (
                        <div style={{ color: '#62646a', fontSize: '0.82rem', lineHeight: 1.6 }}>{p.cover_letter?.slice(0, 150)}...</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === 'messages' && (
            <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '2.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', color: '#404145' }}>Messages</h3>
              <p style={{ color: '#62646a', marginBottom: '1.5rem' }}>Chat with clients directly</p>
              <Link href="/messages">
                <button style={{ background: '#1dbf73', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}>
                  Open Messages →
                </button>
              </Link>
            </div>
          )}

          {/* EARNINGS TAB */}
          {activeTab === 'earnings' && (
            <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.5rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#404145', marginBottom: '1.25rem' }}>💰 My Earnings</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                  { label: 'Total Earned', value: '$0.00', icon: '💰', color: '#1dbf73' },
                  { label: 'Available', value: '$0.00', icon: '✅', color: '#3b82f6' },
                  { label: 'Pending', value: '$0.00', icon: '⏳', color: '#f59e0b' },
                  { label: 'This Month', value: '$0.00', icon: '📅', color: '#8b5cf6' },
                ].map(s => (
                  <div key={s.label} style={{ background: '#fafafa', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.25rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{s.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: '1.25rem', color: s.color }}>{s.value}</div>
                    <div style={{ color: '#95979d', fontSize: '0.75rem' }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'center', padding: '2rem', color: '#95979d', background: '#fafafa', borderRadius: '6px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                <p>Complete jobs to start earning. <Link href="/jobs" style={{ color: '#1dbf73', textDecoration: 'none', fontWeight: 600 }}>Browse Jobs →</Link></p>
              </div>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.5rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#404145', marginBottom: '1.25rem' }}>👤 My Profile</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem', padding: '1.25rem', background: '#fafafa', borderRadius: '8px', border: '1px solid #e4e5e7' }}>
                <Avatar size={72} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#404145' }}>{userName}</div>
                  <div style={{ color: '#62646a', fontSize: '0.85rem' }}>{profile?.title || 'No title set'}</div>
                  <div style={{ color: '#95979d', fontSize: '0.78rem', marginTop: '0.25rem' }}>{user?.email}</div>
                </div>
              </div>

              {profile ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {[
                    { label: 'Bio', value: profile.bio || 'Not set' },
                    { label: 'Location', value: profile.location || 'Not set' },
                    { label: 'Hourly Rate', value: profile.hourly_rate ? `$${profile.hourly_rate}/hr` : 'Not set' },
                    { label: 'Availability', value: profile.availability || 'Not set' },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', gap: '1rem', padding: '0.75rem', background: '#fafafa', borderRadius: '6px', border: '1px solid #e4e5e7' }}>
                      <span style={{ color: '#95979d', fontSize: '0.85rem', minWidth: '100px', fontWeight: 500 }}>{item.label}</span>
                      <span style={{ color: '#404145', fontSize: '0.85rem' }}>{item.value}</span>
                    </div>
                  ))}
                  {profile.skills?.length > 0 && (
                    <div style={{ padding: '0.75rem', background: '#fafafa', borderRadius: '6px', border: '1px solid #e4e5e7' }}>
                      <div style={{ color: '#95979d', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem' }}>Skills</div>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {profile.skills.map((s: string) => (
                          <span key={s} style={{ background: '#f0fdf4', color: '#1dbf73', border: '1px solid #bbf7d0', borderRadius: '4px', padding: '3px 10px', fontSize: '0.78rem' }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#95979d', background: '#fafafa', borderRadius: '6px', marginBottom: '1.5rem' }}>
                  <p>Profile not set up yet </p>
                </div>
              )}

              <Link href="/profile-setup">
                <button style={{ background: '#1dbf73', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}>
                  Edit Profile →
                </button>
              </Link>
            </div>
          )}

        </main>
      </div>
    </>
  );
}
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState<any>(null);
  const [myProposals, setMyProposals] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [sellerLevel, setSellerLevel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }
      setUser(user);

      // Fetch proposals
      const { data: proposals } = await supabase
        .from('proposals')
        .select('*, jobs(*)')
        .eq('developer_id', user.id)
        .order('created_at', { ascending: false });
      if (proposals) setMyProposals(proposals);

      // Fetch subscription
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!sub) {
        const { data: newSub } = await supabase
          .from('subscriptions')
          .insert({
            user_id: user.id,
            plan: 'free',
            bids_remaining: 5,
            bids_total: 5,
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          })
          .select()
          .single();
        if (newSub) setSubscription(newSub);
      } else {
        setSubscription(sub);
      }

      // Fetch seller level
      const { data: level } = await supabase
        .from('seller_levels')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!level) {
        const { data: newLevel } = await supabase
          .from('seller_levels')
          .insert({
            user_id: user.id,
            level: 1,
            total_jobs: 0,
            total_earnings: 0,
            rating: 0,
            is_devmarket_choice: false,
          })
          .select()
          .single();
        if (newLevel) setSellerLevel(newLevel);
      } else {
        setSellerLevel(level);
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <p>Loading dashboard...</p>
      </div>
    </div>
  );

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Developer';
  const userInitial = userName[0].toUpperCase();

  const levelColors: Record<number, string> = {
    1: '#cd7f32',
    2: '#c0c0c0',
    3: '#ffd700',
  };

  const levelIcons: Record<number, string> = {
    1: '🥉',
    2: '🥈',
    3: '🥇',
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>

      {/* SIDEBAR */}
      <aside style={{
        width: '240px', minHeight: '100vh',
        background: 'var(--card)',
        borderRight: '1px solid var(--border)',
        padding: '1.5rem 0',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0,
      }}>
        <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.3rem', color: 'var(--accent)' }}>
              Dev<span style={{ color: 'var(--text)' }}>Market</span>
            </span>
          </Link>
        </div>

        {/* Profile */}
        <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem',
              }}>{userInitial}</div>
              {sellerLevel?.is_devmarket_choice && (
                <div style={{
                  position: 'absolute', bottom: '-2px', right: '-2px',
                  fontSize: '0.7rem',
                }}>⭐</div>
              )}
            </div>
            <div>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.88rem' }}>{userName}</div>
              <div style={{ color: levelColors[sellerLevel?.level || 1], fontSize: '0.72rem' }}>
                {levelIcons[sellerLevel?.level || 1]} Level {sellerLevel?.level || 1}
                {sellerLevel?.is_devmarket_choice && ' · ⭐ Choice'}
              </div>
            </div>
          </div>

          {/* Bid Counter */}
          {subscription && (
            <div style={{
              marginTop: '1rem',
              background: subscription.plan === 'free' ? 'rgba(255,101,132,0.08)' : 'rgba(0,212,170,0.08)',
              border: `1px solid ${subscription.plan === 'free' ? 'rgba(255,101,132,0.2)' : 'rgba(0,212,170,0.2)'}`,
              borderRadius: '10px', padding: '0.75rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>Bids Remaining</span>
                <span style={{
                  color: subscription.plan === 'free' ? 'var(--accent2)' : 'var(--green)',
                  fontSize: '0.75rem', fontWeight: 600,
                }}>
                  {subscription.plan === 'free' ? `${subscription.bids_remaining}/${subscription.bids_total}` : '∞ Unlimited'}
                </span>
              </div>
              {subscription.plan === 'free' && (
                <div style={{ width: '100%', height: '4px', background: 'var(--border)', borderRadius: '100px' }}>
                  <div style={{
                    width: `${(subscription.bids_remaining / subscription.bids_total) * 100}%`,
                    height: '100%',
                    background: subscription.bids_remaining <= 2 ? 'var(--accent2)' : 'var(--green)',
                    borderRadius: '100px', transition: 'width 0.3s',
                  }} />
                </div>
              )}
              <div style={{ marginTop: '0.4rem' }}>
                <span style={{
                  background: subscription.plan === 'free' ? 'rgba(255,101,132,0.1)' : 'rgba(0,212,170,0.1)',
                  color: subscription.plan === 'free' ? 'var(--accent2)' : 'var(--green)',
                  fontSize: '0.7rem', fontWeight: 600,
                  padding: '1px 6px', borderRadius: '4px',
                }}>
                  {subscription.plan.toUpperCase()} PLAN
                </span>
              </div>
            </div>
          )}
        </div>

        <nav style={{ flex: 1 }}>
          {[
            { id: 'overview', icon: '📊', label: 'Overview' },
            { id: 'proposals', icon: '📨', label: 'My Proposals' },
            { id: 'messages', icon: '💬', label: 'Messages' },
            { id: 'earnings', icon: '💰', label: 'Earnings' },
            { id: 'profile', icon: '👤', label: 'My Profile' },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
              width: '100%', padding: '0.75rem 1.5rem',
              background: activeTab === item.id ? 'rgba(108,99,255,0.12)' : 'transparent',
              border: 'none',
              borderLeft: activeTab === item.id ? '3px solid var(--accent)' : '3px solid transparent',
              color: activeTab === item.id ? 'var(--accent)' : 'var(--muted)',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              cursor: 'pointer', fontSize: '0.9rem',
              textAlign: 'left', transition: 'all 0.2s',
            }}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link href="/pricing" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%', padding: '9px',
              background: 'linear-gradient(135deg, var(--accent), var(--green))',
              border: 'none', borderRadius: '8px', color: '#fff',
              fontFamily: 'Syne', fontWeight: 600,
              cursor: 'pointer', fontSize: '0.82rem',
            }}>⚡ Upgrade Plan</button>
          </Link>
          <Link href="/report" style={{ textDecoration: 'none' }}>
  <button style={{
    width: '100%', padding: '9px',
    background: 'transparent', border: '1px solid rgba(255,101,132,0.3)',
    borderRadius: '8px', color: 'var(--accent2)',
    cursor: 'pointer', fontSize: '0.82rem',
  }}>🚨 Report User</button>
</Link>
          <Link href="/support" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%', padding: '9px',
              background: 'transparent', border: '1px solid var(--border)',
              borderRadius: '8px', color: 'var(--muted)',
              cursor: 'pointer', fontSize: '0.82rem',
            }}>🎫 Support</button>
          </Link>
          <button onClick={handleLogout} style={{
            width: '100%', padding: '9px',
            background: 'transparent', border: '1px solid var(--border)',
            borderRadius: '8px', color: 'var(--muted)',
            cursor: 'pointer', fontSize: '0.82rem',
          }}>🚪 Log Out</button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: '240px', flex: 1, padding: '2rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', marginBottom: '0.25rem' }}>
              Welcome, {userName} 👋
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{user?.email}</p>
          </div>
          <Link href="/jobs">
            <button style={{
              background: 'var(--accent)', color: '#fff',
              border: 'none', padding: '10px 22px',
              borderRadius: '10px', fontFamily: 'Syne',
              fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
            }}>+ Find Jobs</button>
          </Link>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem', marginBottom: '2rem',
        }}>
          {[
            { label: 'Proposals Sent', value: myProposals.length, icon: '📨' },
            { label: 'Pending', value: myProposals.filter(p => p.status === 'Pending').length, icon: '⏳' },
            { label: 'Accepted', value: myProposals.filter(p => p.status === 'Accepted').length, icon: '✅' },
            { label: 'Seller Level', value: `Level ${sellerLevel?.level || 1}`, icon: levelIcons[sellerLevel?.level || 1] },
            { label: 'Jobs Done', value: sellerLevel?.total_jobs || 0, icon: '🏆' },
            { label: 'Member Since', value: new Date(user?.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), icon: '📅' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: '14px', padding: '1.25rem',
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.4rem', marginBottom: '0.25rem' }}>{s.value}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Seller Level Card */}
        <div style={{
          background: 'var(--card)', border: `1px solid ${levelColors[sellerLevel?.level || 1]}`,
          borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '3rem' }}>{levelIcons[sellerLevel?.level || 1]}</div>
              <div>
                <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem', color: levelColors[sellerLevel?.level || 1] }}>
                  Level {sellerLevel?.level || 1} Seller
                  {sellerLevel?.is_devmarket_choice && <span style={{ marginLeft: '0.5rem', color: 'var(--accent)' }}>⭐ DevMarket Choice</span>}
                </div>
                <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                  {sellerLevel?.total_jobs || 0} jobs completed · Rating: {sellerLevel?.rating || 0}⭐
                </div>
                <div style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: '0.25rem' }}>
                  {sellerLevel?.level === 1 && 'Complete 10 jobs to reach Level 2'}
                  {sellerLevel?.level === 2 && 'Complete 50 jobs to reach Level 3'}
                  {sellerLevel?.level === 3 && 'You are at the highest level!'}
                </div>
              </div>
            </div>
            <Link href="/pricing">
              <button style={{
                background: 'linear-gradient(135deg, var(--accent), var(--green))',
                color: '#fff', border: 'none', padding: '10px 20px',
                borderRadius: '8px', fontFamily: 'Syne', fontWeight: 600,
                cursor: 'pointer', fontSize: '0.85rem',
              }}>⚡ Upgrade Plan</button>
            </Link>
          </div>
        </div>

        {/* My Proposals */}
        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem',
        }}>
          <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>
            📨 My Proposals
          </h2>
          {myProposals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📭</div>
              <p style={{ marginBottom: '1rem' }}>No proposals yet</p>
              <Link href="/jobs">
                <button style={{
                  background: 'var(--accent)', color: '#fff',
                  border: 'none', padding: '10px 20px',
                  borderRadius: '8px', cursor: 'pointer',
                  fontFamily: 'Syne', fontWeight: 600,
                }}>Browse Jobs →</button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {myProposals.map((p, i) => (
                <div key={i} style={{
                  padding: '1rem', background: 'var(--bg)',
                  borderRadius: '10px', border: '1px solid var(--border)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  flexWrap: 'wrap', gap: '0.5rem',
                }}>
                  <div>
                    <div style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                      {p.jobs?.title || 'Job'}
                    </div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                      Bid: ${p.bid_amount} · {new Date(p.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <span style={{
                    background: p.status === 'Accepted' ? 'rgba(0,212,170,0.1)' : p.status === 'Declined' ? 'rgba(255,101,132,0.1)' : 'rgba(108,99,255,0.1)',
                    color: p.status === 'Accepted' ? 'var(--green)' : p.status === 'Declined' ? 'var(--accent2)' : 'var(--accent)',
                    border: `1px solid ${p.status === 'Accepted' ? 'rgba(0,212,170,0.3)' : p.status === 'Declined' ? 'rgba(255,101,132,0.3)' : 'rgba(108,99,255,0.3)'}`,
                    borderRadius: '6px', padding: '3px 12px', fontSize: '0.78rem', fontWeight: 600,
                  }}>{p.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,101,132,0.15))',
          border: '1px solid var(--border)',
          borderRadius: '16px', padding: '2rem',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
        }}>
          <div>
            <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.4rem' }}>
              Complete Your Profile 🚀
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
              Add skills, bio and portfolio to get more clients
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link href="/jobs">
              <button style={{
                background: 'var(--accent)', color: '#fff',
                border: 'none', padding: '10px 22px',
                borderRadius: '8px', fontFamily: 'Syne',
                fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
              }}>Browse Jobs</button>
            </Link>
            <Link href="/support">
              <button style={{
                background: 'transparent', color: 'var(--text)',
                border: '1px solid var(--border)', padding: '10px 22px',
                borderRadius: '8px', fontSize: '0.9rem', cursor: 'pointer',
              }}>Support</button>
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
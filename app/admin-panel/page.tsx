'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('overview');
  const [tickets, setTickets] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConvo, setSelectedConvo] = useState<any>(null);
  const [convoMessages, setConvoMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [replyText, setReplyText] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  useEffect(() => {
    fetchAll();
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchAll = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) { window.location.href = '/login'; return; }

    const { data: adminCheck } = await supabase
      .from('admin_users').select('id')
      .eq('user_id', currentUser.id).maybeSingle();
    if (!adminCheck) { window.location.href = '/'; return; }

    setLoading(true);

    const { data: jobsData } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
    if (jobsData) setJobs(jobsData);

    const { data: ticketsData } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
    if (ticketsData) setTickets(ticketsData);

    const { data: reportsData } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
    if (reportsData) setReports(reportsData);

    const { data: profilesData } = await supabase.from('developer_profiles').select('*').order('created_at', { ascending: false });
    if (profilesData) setProfiles(profilesData);

    const { data: subsData } = await supabase.from('subscriptions').select('*').order('created_at', { ascending: false });
    if (subsData) setSubscriptions(subsData);

    // Fetch all messages for conversations
    const { data: msgs } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (msgs) {
      // Get unique conversation pairs
      const pairs = new Map();
      msgs.forEach((m: any) => {
        const key = [m.sender_id, m.receiver_id].sort().join('_');
        if (!pairs.has(key)) {
          pairs.set(key, {
            key,
            sender_id: m.sender_id,
            receiver_id: m.receiver_id,
            lastMsg: m.message,
            lastTime: m.created_at,
            count: 1,
          });
        } else {
          pairs.get(key).count++;
        }
      });
      setConversations(Array.from(pairs.values()));
    }

    setLoading(false);
  };

  const fetchConvoMessages = async (senderId: string, receiverId: string) => {
    const { data } = await supabase
      .from('messages').select('*')
      .or(`and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`)
      .order('created_at', { ascending: true });
    if (data) setConvoMessages(data);
  };

  const getProfileName = (userId: string) => {
    const p = profiles.find(p => p.user_id === userId);
    return p?.full_name || userId?.slice(0, 8) + '...';
  };

  const getProfileAvatar = (userId: string) => {
    const p = profiles.find(p => p.user_id === userId);
    return p?.avatar_url || null;
  };

  const suspendUser = async (userId: string, reason: string) => {
    await supabase.from('user_status').upsert({ user_id: userId, is_suspended: true, suspension_reason: reason });
    alert('User suspended!');
    fetchAll();
  };

  const activateUser = async (userId: string) => {
    await supabase.from('user_status').upsert({ user_id: userId, is_suspended: false, suspension_reason: null });
    alert('User activated!');
    fetchAll();
  };

  const verifyUser = async (userId: string) => {
    await supabase.from('user_status').upsert({ user_id: userId, is_verified: true });
    alert('User verified!');
    fetchAll();
  };

  const featureUser = async (userId: string) => {
    await supabase.from('seller_levels').upsert({ user_id: userId, is_devmarket_choice: true });
    alert('DevMarket Choice badge added!');
    fetchAll();
  };

  const replyTicket = async (ticketId: string) => {
    if (!replyText) return;
    await supabase.from('support_tickets').update({ admin_reply: replyText, status: 'Resolved' }).eq('id', ticketId);
    alert('Reply sent!');
    setReplyText('');
    setSelectedTicket(null);
    fetchAll();
  };

  const closeJob = async (jobId: string) => {
    await supabase.from('jobs').update({ status: 'Closed' }).eq('id', jobId);
    fetchAll();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#95979d' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <p>Loading admin panel...</p>
      </div>
    </div>
  );

  const navItems = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'users', icon: '👥', label: 'Users' },
    { id: 'jobs', icon: '📋', label: 'Jobs' },
    { id: 'payments', icon: '💳', label: 'Payments' },
    { id: 'messages', icon: '💬', label: 'All Chats' },
    { id: 'tickets', icon: '🎫', label: 'Support' },
    { id: 'reports', icon: '⚠️', label: 'Reports' },
    { id: 'subscriptions', icon: '⭐', label: 'Plans' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>

      {/* SIDEBAR */}
      <aside style={{
        width: '240px', minHeight: '100vh',
        background: '#1a1a2e', position: 'fixed', top: 0, left: 0, zIndex: 50,
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '1.3rem', color: '#1dbf73' }}>
              Dev<span style={{ color: '#fff' }}>Lpers</span>
            </span>
          </Link>
          <div style={{ marginTop: '0.5rem', background: 'rgba(220,38,38,0.2)', border: '1px solid rgba(220,38,38,0.4)', borderRadius: '6px', padding: '3px 10px', fontSize: '0.72rem', color: '#f87171', display: 'inline-block' }}>
            ⚡ Admin Panel
          </div>
        </div>

        <nav style={{ flex: 1, padding: '0.75rem 0' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
              width: '100%', padding: '0.7rem 1.5rem',
              background: activeTab === item.id ? 'rgba(29,191,115,0.15)' : 'transparent',
              border: 'none',
              borderLeft: activeTab === item.id ? '3px solid #1dbf73' : '3px solid transparent',
              color: activeTab === item.id ? '#1dbf73' : 'rgba(255,255,255,0.6)',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              cursor: 'pointer', fontSize: '0.88rem',
              fontWeight: activeTab === item.id ? 600 : 400,
              textAlign: 'left', transition: 'all 0.15s',
            }}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={handleLogout} style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.85rem' }}>
            🚪 Log Out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: '240px', flex: 1, padding: '2rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '1.6rem', marginBottom: '0.25rem', color: '#1a1a2e' }}>
              Admin Panel ⚡
            </h1>
            <p style={{ color: '#95979d', fontSize: '0.9rem' }}>Manage platform — users, jobs, payments, chats</p>
          </div>
          <button onClick={fetchAll} style={{ background: '#1dbf73', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
            🔄 Refresh
          </button>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
              {[
                { label: 'Total Users', value: profiles.length, icon: '👥', color: '#3b82f6' },
                { label: 'Total Jobs', value: jobs.length, icon: '📋', color: '#1dbf73' },
                { label: 'Open Jobs', value: jobs.filter(j => j.status === 'Open').length, icon: '🟢', color: '#1dbf73' },
                { label: 'Subscriptions', value: subscriptions.filter(s => s.plan !== 'free').length, icon: '⭐', color: '#f59e0b' },
                { label: 'Support Tickets', value: tickets.length, icon: '🎫', color: '#8b5cf6' },
                { label: 'Reports', value: reports.length, icon: '⚠️', color: '#dc2626' },
                { label: 'Conversations', value: conversations.length, icon: '💬', color: '#0ea5e9' },
                { label: 'Open Tickets', value: tickets.filter(t => t.status === 'Open').length, icon: '🔴', color: '#dc2626' },
              ].map(s => (
                <div key={s.label} style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>{s.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: '1.4rem', color: s.color }}>{s.value}</div>
                  <div style={{ color: '#95979d', fontSize: '0.75rem' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a2e', marginBottom: '1rem' }}>⚡ Quick Actions</h3>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {[
                  { label: '👥 Manage Users', tab: 'users' },
                  { label: '💳 Payments', tab: 'payments' },
                  { label: '💬 View Chats', tab: 'messages' },
                  { label: '🎫 Support', tab: 'tickets' },
                  { label: '⚠️ Reports', tab: 'reports' },
                ].map(a => (
                  <button key={a.tab} onClick={() => setActiveTab(a.tab)} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#1dbf73', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Tickets */}
            <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a2e', marginBottom: '1rem' }}>🎫 Recent Open Tickets</h3>
              {tickets.filter(t => t.status === 'Open').slice(0, 3).map((t, i) => (
                <div key={i} style={{ padding: '0.75rem', background: '#fafafa', borderRadius: '6px', border: '1px solid #fecaca', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#404145' }}>{t.subject}</div>
                  <div style={{ color: '#95979d', fontSize: '0.78rem' }}>{t.message?.slice(0, 80)}...</div>
                </div>
              ))}
              {tickets.filter(t => t.status === 'Open').length === 0 && (
                <p style={{ color: '#95979d', fontSize: '0.85rem' }}>No open tickets 🎉</p>
              )}
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a2e' }}>👥 All Users ({profiles.length})</h2>
              <input
                placeholder="Search by name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ padding: '8px 14px', background: '#fafafa', border: '1px solid #e4e5e7', borderRadius: '8px', color: '#404145', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {profiles.filter(p => (p.full_name || '').toLowerCase().includes(search.toLowerCase())).map((profile, i) => {
                const sub = subscriptions.find(s => s.user_id === profile.user_id);
                return (
                  <div key={i} style={{ padding: '1rem', background: '#fafafa', borderRadius: '8px', border: '1px solid #e4e5e7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1dbf73', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                          {profile.full_name?.[0]?.toUpperCase() || '?'}
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#404145' }}>{profile.full_name || 'Unknown'}</div>
                        <div style={{ color: '#95979d', fontSize: '0.75rem' }}>
                          {profile.title || 'No title'} · {profile.location || 'No location'}
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem' }}>
                          {sub && (
                            <span style={{
                              background: sub.plan === 'free' ? '#f3f4f6' : '#f0fdf4',
                              color: sub.plan === 'free' ? '#6b7280' : '#1dbf73',
                              fontSize: '0.68rem', fontWeight: 600, padding: '1px 6px', borderRadius: '4px',
                              border: `1px solid ${sub.plan === 'free' ? '#e5e7eb' : '#bbf7d0'}`,
                            }}>{sub.plan.toUpperCase()}</span>
                          )}
                          {profile.hourly_rate && (
                            <span style={{ background: '#eff6ff', color: '#3b82f6', fontSize: '0.68rem', fontWeight: 600, padding: '1px 6px', borderRadius: '4px', border: '1px solid #bfdbfe' }}>
                              ${profile.hourly_rate}/hr
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button onClick={() => verifyUser(profile.user_id)} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#1dbf73', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>✓ Verify</button>
                      <button onClick={() => featureUser(profile.user_id)} style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#f59e0b', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>⭐ Feature</button>
                      <button onClick={() => suspendUser(profile.user_id, 'Violation of terms')} style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}>🚫 Suspend</button>
                      <button onClick={() => { setSelectedConvo({ sender_id: profile.user_id, name: profile.full_name }); fetchConvoMessages(profile.user_id, profile.user_id); setActiveTab('messages'); }} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#3b82f6', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}>💬 Chats</button>
                    </div>
                  </div>
                );
              })}
              {profiles.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#95979d' }}>
                  <p>No users yet</p>
                  <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer">
                    <button style={{ marginTop: '0.75rem', background: '#1dbf73', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>
                      Open Supabase Dashboard →
                    </button>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* JOBS TAB */}
        {activeTab === 'jobs' && (
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.5rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem', color: '#1a1a2e' }}>📋 All Jobs ({jobs.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {jobs.map((job, i) => (
                <div key={i} style={{ padding: '1rem', background: '#fafafa', borderRadius: '8px', border: '1px solid #e4e5e7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#404145' }}>{job.title}</div>
                    <div style={{ color: '#95979d', fontSize: '0.75rem' }}>
                      {job.category} · ${job.budget_min}{job.budget_max ? `-$${job.budget_max}` : '/hr'} · {new Date(job.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{
                      background: job.status === 'Open' ? '#f0fdf4' : '#fef2f2',
                      color: job.status === 'Open' ? '#1dbf73' : '#dc2626',
                      border: `1px solid ${job.status === 'Open' ? '#bbf7d0' : '#fecaca'}`,
                      borderRadius: '6px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: 600,
                    }}>{job.status}</span>
                    {job.status === 'Open' && (
                      <button onClick={() => closeJob(job.id)} style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}>
                        Close
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Payment Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem' }}>
              {[
                { label: 'Total Subscriptions', value: subscriptions.length, icon: '💳', color: '#3b82f6' },
                { label: 'Paid Plans', value: subscriptions.filter(s => s.plan !== 'free').length, icon: '⭐', color: '#f59e0b' },
                { label: 'Free Plans', value: subscriptions.filter(s => s.plan === 'free').length, icon: '🆓', color: '#1dbf73' },
                { label: 'Weekly Plans', value: subscriptions.filter(s => s.plan === 'weekly').length, icon: '📅', color: '#8b5cf6' },
              ].map(s => (
                <div key={s.label} style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>{s.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: '1.4rem', color: s.color }}>{s.value}</div>
                  <div style={{ color: '#95979d', fontSize: '0.75rem' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Escrow Instructions */}
            <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a2e', marginBottom: '1rem' }}>💳 Escrow Payment Management</h3>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '1.25rem', marginBottom: '1rem' }}>
                <h4 style={{ fontWeight: 600, color: '#1dbf73', marginBottom: '0.75rem' }}>How Escrow Works (Admin View):</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    '1. Client accepts developer proposal',
                    '2. Client sends payment to payments@develpers.com',
                    '3. Admin receives payment and marks it as "In Escrow"',
                    '4. Developer completes the work',
                    '5. Client approves the work',
                    '6. Admin releases payment to developer',
                  ].map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.5rem', color: '#62646a', fontSize: '0.85rem' }}>
                      <span style={{ color: '#1dbf73', fontWeight: 700 }}>✓</span> {step}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '1.25rem', marginBottom: '1rem' }}>
                <h4 style={{ fontWeight: 600, color: '#92400e', marginBottom: '0.5rem' }}>📧 Payment Email:</h4>
                <p style={{ color: '#92400e', fontSize: '0.85rem' }}>All payments received at: <strong>payments@develpers.com</strong></p>
                <p style={{ color: '#92400e', fontSize: '0.82rem', marginTop: '0.5rem' }}>Check your email and manually update payment status below.</p>
              </div>

              {/* Active Subscriptions List */}
              <h4 style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a1a2e', marginBottom: '0.75rem' }}>Active Paid Subscriptions</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {subscriptions.filter(s => s.plan !== 'free').map((sub, i) => {
                  const profile = profiles.find(p => p.user_id === sub.user_id);
                  return (
                    <div key={i} style={{ padding: '1rem', background: '#fafafa', borderRadius: '8px', border: '1px solid #e4e5e7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#404145' }}>{profile?.full_name || 'Unknown User'}</div>
                        <div style={{ color: '#95979d', fontSize: '0.75rem' }}>
                          Plan: <strong style={{ color: '#1dbf73' }}>{sub.plan.toUpperCase()}</strong> · Bids: {sub.bids_remaining}/{sub.bids_total}
                        </div>
                        <div style={{ color: '#95979d', fontSize: '0.72rem' }}>
                          Expires: {sub.expires_at ? new Date(sub.expires_at).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <span style={{ background: '#f0fdf4', color: '#1dbf73', border: '1px solid #bbf7d0', borderRadius: '4px', padding: '3px 10px', fontSize: '0.75rem', fontWeight: 600 }}>
                          Active ✓
                        </span>
                      </div>
                    </div>
                  );
                })}
                {subscriptions.filter(s => s.plan !== 'free').length === 0 && (
                  <p style={{ color: '#95979d', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>No paid subscriptions yet</p>
                )}
              </div>
            </div>

            {/* Payment Methods Reference */}
            <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a2e', marginBottom: '1rem' }}>Accepted Payment Methods</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                {[
                  { icon: '💳', label: 'Stripe (Cards)', desc: 'Visa, Mastercard, Amex' },
                  { icon: '🪙', label: 'Crypto', desc: 'USDT, BTC, ETH' },
                  { icon: '💼', label: 'Payoneer', desc: 'Business payments' },
                ].map(m => (
                  <div key={m.label} style={{ background: '#fafafa', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{m.icon}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#404145' }}>{m.label}</div>
                    <div style={{ color: '#95979d', fontSize: '0.72rem' }}>{m.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MESSAGES / CHAT VIEWER TAB */}
        {activeTab === 'messages' && (
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e4e5e7' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a2e' }}>💬 All Platform Conversations ({conversations.length})</h2>
              <p style={{ color: '#95979d', fontSize: '0.8rem', marginTop: '0.25rem' }}>View chats between any client and developer for dispute resolution</p>
            </div>

            <div style={{ display: 'flex', height: '600px' }}>
              {/* Conversation List */}
              <div style={{ width: '300px', borderRight: '1px solid #e4e5e7', overflowY: 'auto', flexShrink: 0 }}>
                {conversations.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#95979d' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
                    <p style={{ fontSize: '0.85rem' }}>No conversations yet</p>
                  </div>
                ) : (
                  conversations.map((convo, i) => {
                    const nameA = getProfileName(convo.sender_id);
                    const nameB = getProfileName(convo.receiver_id);
                    const isSelected = selectedConvo?.key === convo.key;
                    return (
                      <div key={i} onClick={() => { setSelectedConvo(convo); fetchConvoMessages(convo.sender_id, convo.receiver_id); }} style={{
                        padding: '1rem', cursor: 'pointer',
                        background: isSelected ? '#f0fdf4' : '#fff',
                        borderLeft: isSelected ? '3px solid #1dbf73' : '3px solid transparent',
                        borderBottom: '1px solid #e4e5e7',
                        transition: 'all 0.15s',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#404145', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>
                            {nameA} ↔ {nameB}
                          </div>
                          <span style={{ background: '#e0f2fe', color: '#0284c7', borderRadius: '4px', padding: '1px 6px', fontSize: '0.68rem', fontWeight: 600, flexShrink: 0 }}>
                            {convo.count} msgs
                          </span>
                        </div>
                        <div style={{ color: '#95979d', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {convo.lastMsg}
                        </div>
                        <div style={{ color: '#95979d', fontSize: '0.7rem', marginTop: '0.2rem' }}>
                          {new Date(convo.lastTime).toLocaleDateString()}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Chat Messages */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {!selectedConvo ? (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#95979d' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>💬</div>
                      <p>Select a conversation to view messages</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Chat Header */}
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e4e5e7', background: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#404145' }}>
                          {getProfileName(selectedConvo.sender_id)} ↔ {getProfileName(selectedConvo.receiver_id)}
                        </div>
                        <div style={{ color: '#95979d', fontSize: '0.75rem' }}>{convoMessages.length} messages total</div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => suspendUser(selectedConvo.sender_id, 'Admin: Chat violation')} style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}>
                          🚫 Suspend User A
                        </button>
                        <button onClick={() => suspendUser(selectedConvo.receiver_id, 'Admin: Chat violation')} style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}>
                          🚫 Suspend User B
                        </button>
                      </div>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#fafafa' }}>
                      {convoMessages.map((msg, i) => {
                        const senderName = getProfileName(msg.sender_id);
                        const senderAvatar = getProfileAvatar(msg.sender_id);
                        const isFirst = selectedConvo.sender_id === msg.sender_id;
                        return (
                          <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                            {/* Avatar */}
                            {senderAvatar ? (
                              <img src={senderAvatar} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                            ) : (
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: isFirst ? '#1dbf73' : '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>
                                {senderName[0]?.toUpperCase()}
                              </div>
                            )}
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                                <span style={{ fontWeight: 600, fontSize: '0.8rem', color: isFirst ? '#1dbf73' : '#3b82f6' }}>{senderName}</span>
                                <span style={{ color: '#95979d', fontSize: '0.7rem' }}>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '8px 12px', fontSize: '0.85rem', color: '#404145', maxWidth: '80%' }}>
                                {msg.message}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {convoMessages.length === 0 && (
                        <div style={{ textAlign: 'center', color: '#95979d', padding: '2rem', fontSize: '0.85rem' }}>
                          No messages in this conversation
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TICKETS TAB */}
        {activeTab === 'tickets' && (
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.5rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem', color: '#1a1a2e' }}>🎫 Support Tickets ({tickets.length})</h2>
            {tickets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#95979d' }}>No tickets yet 🎉</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {tickets.map((ticket, i) => (
                  <div key={i} style={{ padding: '1rem', background: '#fafafa', borderRadius: '8px', border: `1px solid ${ticket.status === 'Open' ? '#fecaca' : '#e4e5e7'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#404145' }}>{ticket.subject}</div>
                      <span style={{
                        background: ticket.status === 'Open' ? '#fef2f2' : '#f0fdf4',
                        color: ticket.status === 'Open' ? '#dc2626' : '#1dbf73',
                        border: `1px solid ${ticket.status === 'Open' ? '#fecaca' : '#bbf7d0'}`,
                        borderRadius: '6px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: 600,
                      }}>{ticket.status}</span>
                    </div>
                    <p style={{ color: '#62646a', fontSize: '0.82rem', marginBottom: '0.75rem' }}>{ticket.message}</p>
                    {ticket.admin_reply && (
                      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem', fontSize: '0.82rem', color: '#1dbf73' }}>
                        ✅ Admin Reply: {ticket.admin_reply}
                      </div>
                    )}
                    {ticket.status === 'Open' && (
                      selectedTicket?.id === ticket.id ? (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Type your reply..." style={{ flex: 1, padding: '8px 12px', background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', color: '#404145', fontSize: '0.85rem', outline: 'none' }} />
                          <button onClick={() => replyTicket(ticket.id)} style={{ background: '#1dbf73', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>Send</button>
                          <button onClick={() => setSelectedTicket(null)} style={{ background: '#fff', color: '#62646a', border: '1px solid #e4e5e7', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem' }}>Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setSelectedTicket(ticket)} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#1dbf73', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                          Reply
                        </button>
                      )
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.5rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem', color: '#1a1a2e' }}>⚠️ User Reports ({reports.length})</h2>
            {reports.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#95979d' }}>No reports yet 🎉</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {reports.map((report, i) => (
                  <div key={i} style={{ padding: '1rem', background: '#fafafa', borderRadius: '8px', border: '1px solid #fecaca' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#404145' }}>Report #{i + 1}</div>
                      <span style={{
                        background: report.status === 'Pending' ? '#fef2f2' : '#f0fdf4',
                        color: report.status === 'Pending' ? '#dc2626' : '#1dbf73',
                        border: `1px solid ${report.status === 'Pending' ? '#fecaca' : '#bbf7d0'}`,
                        borderRadius: '6px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: 600,
                      }}>{report.status}</span>
                    </div>
                    <p style={{ color: '#62646a', fontSize: '0.82rem', marginBottom: '0.75rem' }}>Reason: {report.reason}</p>

                    {/* View Chat Button */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {report.status === 'Pending' && (
                        <>
                          <button onClick={() => suspendUser(report.reported_user_id, report.reason)} style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>🚫 Suspend</button>
                          <button onClick={async () => { await supabase.from('reports').update({ status: 'Dismissed' }).eq('id', report.id); fetchAll(); }} style={{ background: '#fff', border: '1px solid #e4e5e7', color: '#62646a', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}>Dismiss</button>
                        </>
                      )}
                      <button onClick={() => {
                        const convo = conversations.find(c => c.sender_id === report.reporter_id || c.receiver_id === report.reporter_id);
                        if (convo) { setSelectedConvo(convo); fetchConvoMessages(convo.sender_id, convo.receiver_id); setActiveTab('messages'); }
                        else alert('No chat found for this report');
                      }} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#3b82f6', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                        💬 View Chat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBSCRIPTIONS TAB */}
        {activeTab === 'subscriptions' && (
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.5rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem', color: '#1a1a2e' }}>⭐ Subscription Plans</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { plan: 'Free', price: '$0', bids: '5 bids/day', color: '#6b7280', features: ['5 daily bids', 'Basic profile', 'Apply to jobs', 'Standard support'] },
                { plan: 'Weekly', price: '$9.99/week', bids: 'Unlimited bids', color: '#1dbf73', features: ['Unlimited bids', 'Featured profile', 'Priority listing', 'Fast support'] },
                { plan: 'Monthly', price: '$29.99/month', bids: 'Unlimited bids', color: '#f59e0b', features: ['Unlimited bids', 'DevLpers Choice badge', 'Top search ranking', 'Dedicated support'] },
              ].map((p, i) => (
                <div key={i} style={{ background: '#fafafa', border: `1px solid ${p.color}`, borderRadius: '14px', padding: '1.5rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: p.color, marginBottom: '0.5rem' }}>{p.plan}</div>
                  <div style={{ fontWeight: 800, fontSize: '1.5rem', color: '#1a1a2e', marginBottom: '0.25rem' }}>{p.price}</div>
                  <div style={{ color: '#95979d', fontSize: '0.82rem', marginBottom: '1rem' }}>{p.bids}</div>
                  <div style={{ color: '#62646a', fontSize: '0.82rem', marginBottom: '0.75rem', fontWeight: 600 }}>
                    Active: {subscriptions.filter(s => s.plan === p.plan.toLowerCase()).length} users
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {p.features.map((f, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#62646a' }}>
                        <span style={{ color: p.color }}>✓</span> {f}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* All Subscriptions List */}
            <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1a2e', marginBottom: '0.75rem' }}>All User Subscriptions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {subscriptions.map((sub, i) => {
                const profile = profiles.find(p => p.user_id === sub.user_id);
                return (
                  <div key={i} style={{ padding: '0.75rem 1rem', background: '#fafafa', borderRadius: '6px', border: '1px solid #e4e5e7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ fontWeight: 500, fontSize: '0.85rem', color: '#404145' }}>
                      {profile?.full_name || sub.user_id?.slice(0, 8) + '...'}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{
                        background: sub.plan === 'free' ? '#f3f4f6' : '#f0fdf4',
                        color: sub.plan === 'free' ? '#6b7280' : '#1dbf73',
                        border: `1px solid ${sub.plan === 'free' ? '#e5e7eb' : '#bbf7d0'}`,
                        borderRadius: '4px', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 600,
                      }}>{sub.plan.toUpperCase()}</span>
                      <span style={{ color: '#95979d', fontSize: '0.75rem' }}>
                        {sub.bids_remaining}/{sub.bids_total} bids
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
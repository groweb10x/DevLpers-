'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConvo, setSelectedConvo] = useState<any>(null);
  const [convoMessages, setConvoMessages] = useState<any[]>([]);
  const [escrowPayments, setEscrowPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [replyText, setReplyText] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [token, setToken] = useState('');
  const [actionLoading, setActionLoading] = useState('');

  useEffect(() => {
    initAdmin();
  }, []);

  const initAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = '/login'; return; }

    const { data: adminCheck } = await supabase
      .from('admin_users').select('id')
      .eq('user_id', user.id).maybeSingle();
    if (!adminCheck) { window.location.href = '/'; return; }

    // Get session token for API calls
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) setToken(session.access_token);

    await fetchAll(session?.access_token || '');
  };

  const fetchAll = async (tok?: string) => {
    setLoading(true);
    const t = tok || token;

    // Fetch real users from API
    try {
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${t}` }
      });
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch (e) { console.log('Users fetch error:', e); }

    // Fetch other data from Supabase
    const [jobsRes, ticketsRes, reportsRes, subsRes, profilesRes, msgsRes, escrowRes] = await Promise.all([
      supabase.from('jobs').select('*').order('created_at', { ascending: false }),
      supabase.from('support_tickets').select('*').order('created_at', { ascending: false }),
      supabase.from('reports').select('*').order('created_at', { ascending: false }),
      supabase.from('subscriptions').select('*').order('created_at', { ascending: false }),
      supabase.from('developer_profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('messages').select('*').order('created_at', { ascending: false }),
      supabase.from('escrow_payments').select('*').order('created_at', { ascending: false }),
    ]);

    if (jobsRes.data) setJobs(jobsRes.data);
    if (ticketsRes.data) setTickets(ticketsRes.data);
    if (reportsRes.data) setReports(reportsRes.data);
    if (subsRes.data) setSubscriptions(subsRes.data);
    if (profilesRes.data) setProfiles(profilesRes.data);
    if (escrowRes.data) setEscrowPayments(escrowRes.data);

    // Build conversations
    if (msgsRes.data) {
      const pairs = new Map();
      msgsRes.data.forEach((m: any) => {
        const key = [m.sender_id, m.receiver_id].sort().join('_');
        if (!pairs.has(key)) {
          pairs.set(key, { key, sender_id: m.sender_id, receiver_id: m.receiver_id, lastMsg: m.message, lastTime: m.created_at, count: 1 });
        } else { pairs.get(key).count++; }
      });
      setConversations(Array.from(pairs.values()));
    }

    setLoading(false);
  };

  const adminAction = async (action: string, userId: string, extra?: any) => {
    setActionLoading(userId + action);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userId, ...extra }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchAll();
        alert(`✅ ${action} successful!`);
      } else {
        alert('❌ Error: ' + data.error);
      }
    } catch (e) { alert('❌ Network error'); }
    setActionLoading('');
  };

  const fetchConvoMessages = async (senderId: string, receiverId: string) => {
    const { data } = await supabase.from('messages').select('*')
      .or(`and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`)
      .order('created_at', { ascending: true });
    if (data) setConvoMessages(data);
  };

  const replyTicket = async (ticketId: string) => {
    if (!replyText) return;
    await supabase.from('support_tickets').update({ admin_reply: replyText, status: 'Resolved' }).eq('id', ticketId);
    setReplyText('');
    setSelectedTicket(null);
    fetchAll();
  };

  const closeJob = async (jobId: string) => {
    await supabase.from('jobs').update({ status: 'Closed' }).eq('id', jobId);
    fetchAll();
  };

  const releaseEscrow = async (escrowId: string) => {
    await supabase.from('escrow_payments').update({
      status: 'released',
      released_at: new Date().toISOString(),
    }).eq('id', escrowId);
    fetchAll();
    alert('✅ Payment released to developer!');
  };

  const refundEscrow = async (escrowId: string, clientId: string) => {
    await supabase.from('escrow_payments').update({ status: 'refunded' }).eq('id', escrowId);
    await supabase.from('notifications').insert({
      user_id: clientId,
      title: '💰 Refund Processed',
      message: 'Your escrow payment has been refunded.',
      type: 'payment',
    });
    fetchAll();
    alert('✅ Payment refunded to client!');
  };

  const getProfileName = (userId: string) => {
    const u = users.find(u => u.id === userId);
    if (u?.full_name) return u.full_name;
    const p = profiles.find(p => p.user_id === userId);
    return p?.full_name || userId?.slice(0, 8) + '...';
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#95979d' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚡</div>
        <p style={{ fontWeight: 600 }}>Loading Admin Panel...</p>
      </div>
    </div>
  );

  const navItems = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'users', icon: '👥', label: `Users (${users.length})` },
    { id: 'jobs', icon: '📋', label: `Jobs (${jobs.length})` },
    { id: 'payments', icon: '💳', label: `Payments (${escrowPayments.length})` },
    { id: 'messages', icon: '💬', label: `Chats (${conversations.length})` },
    { id: 'tickets', icon: '🎫', label: `Support (${tickets.filter(t => t.status === 'Open').length})` },
    { id: 'reports', icon: '⚠️', label: `Reports (${reports.length})` },
    { id: 'subscriptions', icon: '⭐', label: 'Plans' },
  ];

  const filteredUsers = users.filter(u =>
    (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.full_name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>

      {/* SIDEBAR */}
      <aside style={{ width: '240px', minHeight: '100vh', background: '#1a1a2e', position: 'fixed', top: 0, left: 0, zIndex: 50, display: 'flex', flexDirection: 'column' }}>
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

        <nav style={{ flex: 1, padding: '0.75rem 0', overflowY: 'auto' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
              width: '100%', padding: '0.7rem 1.5rem',
              background: activeTab === item.id ? 'rgba(29,191,115,0.15)' : 'transparent',
              border: 'none',
              borderLeft: activeTab === item.id ? '3px solid #1dbf73' : '3px solid transparent',
              color: activeTab === item.id ? '#1dbf73' : 'rgba(255,255,255,0.6)',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              cursor: 'pointer', fontSize: '0.85rem',
              fontWeight: activeTab === item.id ? 600 : 400,
              textAlign: 'left',
            }}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button onClick={() => fetchAll()} style={{ width: '100%', padding: '8px', background: 'rgba(29,191,115,0.15)', border: '1px solid rgba(29,191,115,0.3)', borderRadius: '6px', color: '#1dbf73', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>
            🔄 Refresh Data
          </button>
          <button onClick={handleLogout} style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.82rem' }}>
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
            <p style={{ color: '#95979d', fontSize: '0.9rem' }}>Full platform control — users, jobs, payments, chats</p>
          </div>
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              {[
                { label: 'Total Users', value: users.length, icon: '👥', color: '#3b82f6' },
                { label: 'Total Jobs', value: jobs.length, icon: '📋', color: '#1dbf73' },
                { label: 'Open Jobs', value: jobs.filter(j => j.status === 'Open').length, icon: '🟢', color: '#1dbf73' },
                { label: 'Paid Plans', value: subscriptions.filter(s => s.plan !== 'free').length, icon: '⭐', color: '#f59e0b' },
                { label: 'Escrow', value: escrowPayments.filter(e => e.status === 'in_escrow').length, icon: '🔒', color: '#8b5cf6' },
                { label: 'Chats', value: conversations.length, icon: '💬', color: '#0ea5e9' },
                { label: 'Open Tickets', value: tickets.filter(t => t.status === 'Open').length, icon: '🎫', color: '#dc2626' },
                { label: 'Reports', value: reports.filter(r => r.status === 'Pending').length, icon: '⚠️', color: '#dc2626' },
              ].map(s => (
                <div key={s.label} style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', cursor: 'pointer' }}
                  onClick={() => {
                    if (s.label.includes('User')) setActiveTab('users');
                    else if (s.label.includes('Job')) setActiveTab('jobs');
                    else if (s.label.includes('Ticket')) setActiveTab('tickets');
                    else if (s.label.includes('Report')) setActiveTab('reports');
                    else if (s.label.includes('Chat')) setActiveTab('messages');
                    else if (s.label.includes('Escrow')) setActiveTab('payments');
                  }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{s.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: '1.6rem', color: s.color }}>{s.value}</div>
                  <div style={{ color: '#95979d', fontSize: '0.75rem' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a2e', marginBottom: '1rem' }}>🆕 Recent Users</h3>
                {users.slice(0, 5).map((u, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1dbf73', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>
                      {(u.full_name || u.email)?.[0]?.toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#404145', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.full_name || u.email}</div>
                      <div style={{ color: '#95979d', fontSize: '0.72rem' }}>{u.role} · {new Date(u.created_at).toLocaleDateString()}</div>
                    </div>
                    <span style={{
                      background: u.subscription?.plan === 'free' ? '#f3f4f6' : '#f0fdf4',
                      color: u.subscription?.plan === 'free' ? '#6b7280' : '#1dbf73',
                      fontSize: '0.68rem', fontWeight: 600, padding: '1px 6px', borderRadius: '4px',
                    }}>{u.subscription?.plan?.toUpperCase() || 'FREE'}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a2e', marginBottom: '1rem' }}>🎫 Open Tickets</h3>
                {tickets.filter(t => t.status === 'Open').slice(0, 5).map((t, i) => (
                  <div key={i} style={{ padding: '0.6rem 0', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#404145' }}>{t.subject}</div>
                    <div style={{ color: '#95979d', fontSize: '0.72rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.message}</div>
                  </div>
                ))}
                {tickets.filter(t => t.status === 'Open').length === 0 && (
                  <p style={{ color: '#95979d', fontSize: '0.85rem' }}>No open tickets 🎉</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a2e' }}>👥 All Users ({users.length})</h2>
              <input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '8px 14px', background: '#fafafa', border: '1px solid #e4e5e7', borderRadius: '8px', color: '#404145', fontSize: '0.85rem', outline: 'none', width: '250px' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredUsers.map((u, i) => (
                <div key={i} style={{
                  padding: '1rem', background: '#fafafa', borderRadius: '8px',
                  border: `1px solid ${u.is_banned ? '#fecaca' : '#e4e5e7'}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {u.profile?.avatar_url ? (
                        <img src={u.profile.avatar_url} alt="" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e4e5e7' }} />
                      ) : (
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#1dbf73', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>
                          {(u.full_name || u.email)?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#404145' }}>{u.full_name || 'No name'}</div>
                        <div style={{ color: '#62646a', fontSize: '0.78rem' }}>{u.email}</div>
                        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.3rem', flexWrap: 'wrap' }}>
                          <span style={{ background: '#eff6ff', color: '#3b82f6', fontSize: '0.68rem', fontWeight: 600, padding: '1px 6px', borderRadius: '4px', border: '1px solid #bfdbfe' }}>
                            {u.role}
                          </span>
                          <span style={{
                            background: u.subscription?.plan === 'free' ? '#f3f4f6' : '#f0fdf4',
                            color: u.subscription?.plan === 'free' ? '#6b7280' : '#1dbf73',
                            fontSize: '0.68rem', fontWeight: 600, padding: '1px 6px', borderRadius: '4px',
                          }}>{u.subscription?.plan?.toUpperCase() || 'FREE'}</span>
                          {u.status?.is_verified && <span style={{ background: '#f0fdf4', color: '#1dbf73', fontSize: '0.68rem', fontWeight: 600, padding: '1px 6px', borderRadius: '4px', border: '1px solid #bbf7d0' }}>✓ Verified</span>}
                          {u.is_banned && <span style={{ background: '#fef2f2', color: '#dc2626', fontSize: '0.68rem', fontWeight: 600, padding: '1px 6px', borderRadius: '4px', border: '1px solid #fecaca' }}>🚫 Banned</span>}
                        </div>
                        <div style={{ color: '#95979d', fontSize: '0.7rem', marginTop: '0.2rem' }}>
                          Joined: {new Date(u.created_at).toLocaleDateString()} · Last seen: {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : 'Never'}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <button onClick={() => adminAction('verify', u.id)} disabled={actionLoading === u.id + 'verify'} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#1dbf73', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                        ✓ Verify
                      </button>
                      <button onClick={() => adminAction('feature', u.id)} disabled={actionLoading === u.id + 'feature'} style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#f59e0b', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                        ⭐ Feature
                      </button>

                      {/* Subscription Update */}
                      <select onChange={e => e.target.value && adminAction('update_subscription', u.id, { plan: e.target.value })} defaultValue="" style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #e4e5e7', fontSize: '0.75rem', cursor: 'pointer', color: '#404145', background: '#fff' }}>
                        <option value="" disabled>⚡ Plan</option>
                        <option value="free">Free</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>

                      {u.is_banned ? (
                        <button onClick={() => adminAction('activate', u.id)} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#1dbf73', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                          ✓ Activate
                        </button>
                      ) : (
                        <button onClick={() => { const reason = prompt('Suspension reason:'); if (reason) adminAction('suspend', u.id, { reason }); }} style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}>
                          🚫 Suspend
                        </button>
                      )}

                      <button onClick={() => {
                        const convo = conversations.find(c => c.sender_id === u.id || c.receiver_id === u.id);
                        if (convo) { setSelectedConvo(convo); fetchConvoMessages(convo.sender_id, convo.receiver_id); setActiveTab('messages'); }
                        else alert('No chats found for this user');
                      }} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#3b82f6', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}>
                        💬 Chats
                      </button>

                      <button onClick={() => { if (confirm('Delete user permanently?')) adminAction('delete', u.id); }} style={{ background: '#1a1a2e', border: 'none', color: '#fff', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}>
                        🗑️ Delete
                      </button>
                    </div>
                  </div>

                  {/* Profile details */}
                  {u.profile && (
                    <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#fff', borderRadius: '6px', border: '1px solid #f0f0f0', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.78rem', color: '#62646a' }}>
                      {u.profile.title && <span>💼 {u.profile.title}</span>}
                      {u.profile.location && <span>📍 {u.profile.location}</span>}
                      {u.profile.hourly_rate && <span>💰 ${u.profile.hourly_rate}/hr</span>}
                      {u.profile.skills?.length > 0 && <span>🛠️ {u.profile.skills.slice(0, 3).join(', ')}</span>}
                    </div>
                  )}
                </div>
              ))}

              {filteredUsers.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#95979d' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>👥</div>
                  <p>No users found</p>
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

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
              {[
                { label: 'In Escrow', value: escrowPayments.filter(e => e.status === 'in_escrow').length, icon: '🔒', color: '#f59e0b' },
                { label: 'Released', value: escrowPayments.filter(e => e.status === 'released').length, icon: '✅', color: '#1dbf73' },
                { label: 'Pending', value: escrowPayments.filter(e => e.status === 'pending').length, icon: '⏳', color: '#3b82f6' },
                { label: 'Refunded', value: escrowPayments.filter(e => e.status === 'refunded').length, icon: '↩️', color: '#dc2626' },
                { label: 'Total Value', value: '$' + escrowPayments.reduce((s, e) => s + (e.amount || 0), 0).toFixed(0), icon: '💰', color: '#8b5cf6' },
                { label: 'Paid Plans', value: subscriptions.filter(s => s.plan !== 'free').length, icon: '⭐', color: '#f59e0b' },
              ].map(s => (
                <div key={s.label} style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>{s.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: '1.4rem', color: s.color }}>{s.value}</div>
                  <div style={{ color: '#95979d', fontSize: '0.75rem' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Escrow Payments */}
            <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a2e', marginBottom: '1rem' }}>🔒 Escrow Payments</h3>

              {escrowPayments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#95979d' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💳</div>
                  <p style={{ fontSize: '0.85rem' }}>No escrow payments yet</p>
                  <p style={{ fontSize: '0.78rem', color: '#95979d', marginTop: '0.5rem' }}>Payments will appear here when clients deposit funds</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {escrowPayments.map((payment, i) => (
                    <div key={i} style={{
                      padding: '1.25rem', background: '#fafafa', borderRadius: '8px',
                      border: `1px solid ${payment.status === 'in_escrow' ? '#fde68a' : payment.status === 'released' ? '#bbf7d0' : '#e4e5e7'}`,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#404145' }}>
                            Payment #{payment.id?.slice(0, 8)}
                          </div>
                          <div style={{ color: '#62646a', fontSize: '0.78rem', marginTop: '0.2rem' }}>
                            Client: {getProfileName(payment.client_id)} → Developer: {getProfileName(payment.developer_id)}
                          </div>
                          <div style={{ color: '#95979d', fontSize: '0.72rem' }}>
                            Method: {payment.payment_method || 'N/A'} · {new Date(payment.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1dbf73' }}>${payment.amount}</div>
                          <span style={{
                            background: payment.status === 'in_escrow' ? '#fffbeb' : payment.status === 'released' ? '#f0fdf4' : payment.status === 'refunded' ? '#fef2f2' : '#eff6ff',
                            color: payment.status === 'in_escrow' ? '#f59e0b' : payment.status === 'released' ? '#1dbf73' : payment.status === 'refunded' ? '#dc2626' : '#3b82f6',
                            border: `1px solid ${payment.status === 'in_escrow' ? '#fde68a' : payment.status === 'released' ? '#bbf7d0' : payment.status === 'refunded' ? '#fecaca' : '#bfdbfe'}`,
                            borderRadius: '100px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: 600,
                          }}>{payment.status}</span>
                        </div>
                      </div>

                      {payment.status === 'in_escrow' && (
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                          <button onClick={() => releaseEscrow(payment.id)} style={{ background: '#1dbf73', border: 'none', color: '#fff', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>
                            💰 Release to Developer
                          </button>
                          <button onClick={() => refundEscrow(payment.id, payment.client_id)} style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem' }}>
                            ↩️ Refund to Client
                          </button>
                        </div>
                      )}

                      {payment.status === 'pending' && (
                        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px', padding: '0.75rem', fontSize: '0.8rem', color: '#92400e' }}>
                          ⏳ Waiting for client to deposit payment via email: <strong>payments@develpers.com</strong>
                          <button onClick={async () => {
                            await supabase.from('escrow_payments').update({ status: 'in_escrow', deposited_at: new Date().toISOString() }).eq('id', payment.id);
                            fetchAll();
                            alert('✅ Marked as received!');
                          }} style={{ marginLeft: '1rem', background: '#f59e0b', border: 'none', color: '#fff', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                            ✓ Mark as Received
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Subscriptions */}
            <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a2e', marginBottom: '1rem' }}>⭐ Active Subscriptions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {subscriptions.filter(s => s.plan !== 'free').map((sub, i) => {
                  const u = users.find(u => u.id === sub.user_id);
                  return (
                    <div key={i} style={{ padding: '0.75rem 1rem', background: '#fafafa', borderRadius: '6px', border: '1px solid #e4e5e7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#404145' }}>{u?.full_name || u?.email || 'Unknown'}</div>
                        <div style={{ color: '#95979d', fontSize: '0.72rem' }}>
                          Expires: {sub.expires_at ? new Date(sub.expires_at).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ background: '#f0fdf4', color: '#1dbf73', border: '1px solid #bbf7d0', borderRadius: '4px', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 600 }}>
                          {sub.plan.toUpperCase()}
                        </span>
                        <span style={{ color: '#95979d', fontSize: '0.75rem' }}>{sub.bids_remaining} bids left</span>
                      </div>
                    </div>
                  );
                })}
                {subscriptions.filter(s => s.plan !== 'free').length === 0 && (
                  <p style={{ color: '#95979d', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>No paid subscriptions yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MESSAGES / CHAT VIEWER */}
        {activeTab === 'messages' && (
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e4e5e7' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a2e' }}>💬 All Conversations ({conversations.length})</h2>
              <p style={{ color: '#95979d', fontSize: '0.8rem', marginTop: '0.25rem' }}>View any chat for dispute resolution</p>
            </div>

            <div style={{ display: 'flex', height: '600px' }}>
              {/* List */}
              <div style={{ width: '280px', borderRight: '1px solid #e4e5e7', overflowY: 'auto', flexShrink: 0 }}>
                {conversations.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#95979d' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
                    <p style={{ fontSize: '0.85rem' }}>No conversations yet</p>
                  </div>
                ) : conversations.map((convo, i) => {
                  const nameA = getProfileName(convo.sender_id);
                  const nameB = getProfileName(convo.receiver_id);
                  const isSelected = selectedConvo?.key === convo.key;
                  return (
                    <div key={i} onClick={() => { setSelectedConvo(convo); fetchConvoMessages(convo.sender_id, convo.receiver_id); }} style={{
                      padding: '0.85rem 1rem', cursor: 'pointer',
                      background: isSelected ? '#f0fdf4' : '#fff',
                      borderLeft: isSelected ? '3px solid #1dbf73' : '3px solid transparent',
                      borderBottom: '1px solid #e4e5e7',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#404145', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>
                          {nameA} ↔ {nameB}
                        </div>
                        <span style={{ background: '#e0f2fe', color: '#0284c7', borderRadius: '4px', padding: '1px 6px', fontSize: '0.68rem', fontWeight: 600, flexShrink: 0 }}>
                          {convo.count}
                        </span>
                      </div>
                      <div style={{ color: '#95979d', fontSize: '0.72rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {convo.lastMsg}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {!selectedConvo ? (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#95979d' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>💬</div>
                      <p>Select a conversation</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e4e5e7', background: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#404145' }}>
                          {getProfileName(selectedConvo.sender_id)} ↔ {getProfileName(selectedConvo.receiver_id)}
                        </div>
                        <div style={{ color: '#95979d', fontSize: '0.75rem' }}>{convoMessages.length} messages</div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => { const reason = prompt('Reason:'); if (reason) adminAction('suspend', selectedConvo.sender_id, { reason }); }} style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}>
                          🚫 Suspend A
                        </button>
                        <button onClick={() => { const reason = prompt('Reason:'); if (reason) adminAction('suspend', selectedConvo.receiver_id, { reason }); }} style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}>
                          🚫 Suspend B
                        </button>
                      </div>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#fafafa' }}>
                      {convoMessages.map((msg, i) => {
                        const senderName = getProfileName(msg.sender_id);
                        const isA = msg.sender_id === selectedConvo.sender_id;
                        return (
                          <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: isA ? '#1dbf73' : '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                              {senderName[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline', marginBottom: '0.2rem' }}>
                                <span style={{ fontWeight: 600, fontSize: '0.78rem', color: isA ? '#1dbf73' : '#3b82f6' }}>{senderName}</span>
                                <span style={{ color: '#95979d', fontSize: '0.68rem' }}>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '8px 12px', fontSize: '0.82rem', color: '#404145', maxWidth: '400px' }}>
                                {msg.message}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {convoMessages.length === 0 && (
                        <div style={{ textAlign: 'center', color: '#95979d', fontSize: '0.85rem', padding: '2rem' }}>No messages</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TICKETS */}
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
                      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.75rem', marginBottom: '0.75rem', fontSize: '0.82rem', color: '#1dbf73' }}>
                        ✅ Reply: {ticket.admin_reply}
                      </div>
                    )}
                    {ticket.status === 'Open' && (
                      selectedTicket?.id === ticket.id ? (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Type reply..." style={{ flex: 1, padding: '8px 12px', background: '#fff', border: '1px solid #e4e5e7', borderRadius: '6px', color: '#404145', fontSize: '0.85rem', outline: 'none' }} />
                          <button onClick={() => replyTicket(ticket.id)} style={{ background: '#1dbf73', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Send</button>
                          <button onClick={() => setSelectedTicket(null)} style={{ background: '#fff', color: '#62646a', border: '1px solid #e4e5e7', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
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

        {/* REPORTS */}
        {activeTab === 'reports' && (
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.5rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem', color: '#1a1a2e' }}>⚠️ Reports ({reports.length})</h2>
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
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {report.status === 'Pending' && (
                        <>
                          <button onClick={() => { const reason = prompt('Suspension reason:') || report.reason; adminAction('suspend', report.reported_user_id, { reason }); }} style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>🚫 Suspend</button>
                          <button onClick={async () => { await supabase.from('reports').update({ status: 'Dismissed' }).eq('id', report.id); fetchAll(); }} style={{ background: '#fff', border: '1px solid #e4e5e7', color: '#62646a', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}>Dismiss</button>
                        </>
                      )}
                      <button onClick={() => {
                        const convo = conversations.find(c => c.sender_id === report.reporter_id || c.receiver_id === report.reporter_id);
                        if (convo) { setSelectedConvo(convo); fetchConvoMessages(convo.sender_id, convo.receiver_id); setActiveTab('messages'); }
                        else alert('No chat found');
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

        {/* SUBSCRIPTIONS */}
        {activeTab === 'subscriptions' && (
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.5rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem', color: '#1a1a2e' }}>⭐ Plans & Subscriptions</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { plan: 'free', label: 'Free', price: '$0', color: '#6b7280', count: subscriptions.filter(s => s.plan === 'free').length },
                { plan: 'weekly', label: 'Weekly', price: '$9.99/wk', color: '#1dbf73', count: subscriptions.filter(s => s.plan === 'weekly').length },
                { plan: 'monthly', label: 'Monthly', price: '$29.99/mo', color: '#f59e0b', count: subscriptions.filter(s => s.plan === 'monthly').length },
                { plan: 'yearly', label: 'Yearly', price: '$99.99/yr', color: '#8b5cf6', count: subscriptions.filter(s => s.plan === 'yearly').length },
              ].map(p => (
                <div key={p.plan} style={{ background: '#fafafa', border: `1px solid ${p.color}44`, borderRadius: '10px', padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: p.color }}>{p.label}</div>
                  <div style={{ fontWeight: 800, fontSize: '1.5rem', color: '#1a1a2e', margin: '0.25rem 0' }}>{p.price}</div>
                  <div style={{ color: '#95979d', fontSize: '0.82rem' }}>{p.count} active users</div>
                </div>
              ))}
            </div>

            <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1a2e', marginBottom: '0.75rem' }}>All Subscriptions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {subscriptions.map((sub, i) => {
                const u = users.find(u => u.id === sub.user_id);
                return (
                  <div key={i} style={{ padding: '0.75rem 1rem', background: '#fafafa', borderRadius: '6px', border: '1px solid #e4e5e7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '0.85rem', color: '#404145' }}>{u?.full_name || u?.email || sub.user_id?.slice(0, 8)}</div>
                      <div style={{ color: '#95979d', fontSize: '0.72rem' }}>
                        Expires: {sub.expires_at ? new Date(sub.expires_at).toLocaleDateString() : 'Never'} · {sub.bids_remaining} bids left
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{
                        background: sub.plan === 'free' ? '#f3f4f6' : '#f0fdf4',
                        color: sub.plan === 'free' ? '#6b7280' : '#1dbf73',
                        fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: '4px',
                      }}>{sub.plan.toUpperCase()}</span>
                      <select onChange={e => e.target.value && adminAction('update_subscription', sub.user_id, { plan: e.target.value })} defaultValue="" style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #e4e5e7', fontSize: '0.72rem', cursor: 'pointer' }}>
                        <option value="" disabled>Change</option>
                        <option value="free">Free</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
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
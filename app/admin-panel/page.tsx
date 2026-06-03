'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [replyText, setReplyText] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetchAll();
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchAll = async () => {
    setLoading(true);

    // Fetch all users from auth
    const { data: authUsers } = await supabase.auth.admin.listUsers().catch(() => ({ data: null }));

    // Fetch user statuses
    const { data: statuses } = await supabase.from('user_status').select('*');
    const { data: levels } = await supabase.from('seller_levels').select('*');
    const { data: subs } = await supabase.from('subscriptions').select('*');

    // Fetch jobs
    const { data: jobsData } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
    if (jobsData) setJobs(jobsData);

    // Fetch support tickets
    const { data: ticketsData } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
    if (ticketsData) setTickets(ticketsData);

    // Fetch reports
    const { data: reportsData } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
    if (reportsData) setReports(reportsData);

    setLoading(false);
  };

  const suspendUser = async (userId: string, reason: string) => {
    const { error } = await supabase.from('user_status').upsert({
      user_id: userId,
      is_suspended: true,
      suspension_reason: reason,
    });
    if (!error) {
      alert('User suspended!');
      fetchAll();
    }
  };

  const activateUser = async (userId: string) => {
    const { error } = await supabase.from('user_status').upsert({
      user_id: userId,
      is_suspended: false,
      suspension_reason: null,
    });
    if (!error) {
      alert('User activated!');
      fetchAll();
    }
  };

  const verifyUser = async (userId: string) => {
    const { error } = await supabase.from('user_status').upsert({
      user_id: userId,
      is_verified: true,
    });
    if (!error) {
      alert('User verified!');
      fetchAll();
    }
  };

  const featureUser = async (userId: string) => {
    await supabase.from('seller_levels').upsert({
      user_id: userId,
      is_devmarket_choice: true,
    });
    alert('DevMarket Choice badge added!');
    fetchAll();
  };

  const replyTicket = async (ticketId: string) => {
    if (!replyText) return;
    const { error } = await supabase
      .from('support_tickets')
      .update({ admin_reply: replyText, status: 'Resolved' })
      .eq('id', ticketId);
    if (!error) {
      alert('Reply sent!');
      setReplyText('');
      setSelectedTicket(null);
      fetchAll();
    }
  };

  const closeJob = async (jobId: string) => {
    await supabase.from('jobs').update({ status: 'Closed' }).eq('id', jobId);
    fetchAll();
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <p>Loading admin panel...</p>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: '100vh', background: 'var(--bg)' }}>

      {/* SIDEBAR */}
      <aside style={{
        width: isMobile ? '100%' : '240px', minHeight: isMobile ? 'auto' : '100vh',
        background: 'var(--card)',
        borderRight: '1px solid var(--border)',
        padding: '1.5rem 0',
        display: 'flex', flexDirection: 'column',
        position: isMobile ? 'relative' : 'fixed', top: 0, left: 0,
      }}>
        <div style={{ padding: '0 1.5rem', marginBottom: '1rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.3rem', color: 'var(--accent)' }}>
              Dev<span style={{ color: 'var(--text)' }}>Market</span>
            </span>
          </Link>
          <div style={{
            marginTop: '0.5rem',
            background: 'rgba(255,101,132,0.1)',
            border: '1px solid rgba(255,101,132,0.3)',
            borderRadius: '6px', padding: '3px 10px',
            fontSize: '0.72rem', color: 'var(--accent2)',
            display: 'inline-block',
          }}>⚡ Admin Panel</div>
        </div>

        <nav style={{ flex: 1 }}>
          {[
            { id: 'users', icon: '👥', label: 'Users' },
            { id: 'jobs', icon: '📋', label: 'Jobs' },
            { id: 'tickets', icon: '🎫', label: 'Support Tickets' },
            { id: 'reports', icon: '⚠️', label: 'Reports' },
            { id: 'subscriptions', icon: '💳', label: 'Subscriptions' },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
              width: '100%', padding: '0.75rem 1.5rem',
              background: activeTab === item.id ? 'rgba(255,101,132,0.1)' : 'transparent',
              border: 'none',
              borderLeft: activeTab === item.id ? '3px solid var(--accent2)' : '3px solid transparent',
              color: activeTab === item.id ? 'var(--accent2)' : 'var(--muted)',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              cursor: 'pointer', fontSize: '0.9rem',
              textAlign: 'left', transition: 'all 0.2s',
            }}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '1.5rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%', padding: '10px',
              background: 'transparent', border: '1px solid var(--border)',
              borderRadius: '8px', color: 'var(--muted)',
              cursor: 'pointer', fontSize: '0.85rem',
            }}>🚪 Log Out</button>
          </Link>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: isMobile ? '0' : '240px', flex: 1, padding: isMobile ? '1rem' : '2rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', marginBottom: '0.25rem' }}>
              Admin Panel ⚡
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Manage platform users, jobs and support</p>
          </div>
          <button onClick={fetchAll} style={{
            background: 'var(--accent)', color: '#fff',
            border: 'none', padding: '9px 18px',
            borderRadius: '8px', cursor: 'pointer',
            fontFamily: 'Syne', fontWeight: 600, fontSize: '0.85rem',
          }}>🔄 Refresh</button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem', marginBottom: '2rem',
        }}>
          {[
            { label: 'Total Jobs', value: jobs.length, icon: '📋' },
            { label: 'Open Jobs', value: jobs.filter(j => j.status === 'Open').length, icon: '🟢' },
            { label: 'Support Tickets', value: tickets.length, icon: '🎫' },
            { label: 'Reports', value: reports.length, icon: '⚠️' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: '14px', padding: '1.25rem',
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', marginBottom: '0.25rem' }}>{s.value}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* JOBS TAB */}
        {activeTab === 'jobs' && (
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>📋 All Jobs</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {jobs.map((job, i) => (
                <div key={i} style={{
                  padding: '1rem', background: 'var(--bg)',
                  borderRadius: '10px', border: '1px solid var(--border)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem',
                }}>
                  <div>
                    <div style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '0.9rem' }}>{job.title}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>
                      {job.category} · ${job.budget_min}{job.budget_max ? `-$${job.budget_max}` : '/hr'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{
                      background: job.status === 'Open' ? 'rgba(0,212,170,0.1)' : 'rgba(255,101,132,0.1)',
                      color: job.status === 'Open' ? 'var(--green)' : 'var(--accent2)',
                      border: `1px solid ${job.status === 'Open' ? 'rgba(0,212,170,0.3)' : 'rgba(255,101,132,0.3)'}`,
                      borderRadius: '6px', padding: '2px 10px', fontSize: '0.75rem',
                    }}>{job.status}</span>
                    {job.status === 'Open' && (
                      <button onClick={() => closeJob(job.id)} style={{
                        background: 'rgba(255,101,132,0.1)',
                        border: '1px solid rgba(255,101,132,0.3)',
                        color: 'var(--accent2)', padding: '4px 12px',
                        borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem',
                      }}>Close Job</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TICKETS TAB */}
        {activeTab === 'tickets' && (
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>🎫 Support Tickets</h2>
            {tickets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>No tickets yet</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {tickets.map((ticket, i) => (
                  <div key={i} style={{
                    padding: '1rem', background: 'var(--bg)',
                    borderRadius: '10px', border: `1px solid ${ticket.status === 'Open' ? 'rgba(255,101,132,0.3)' : 'var(--border)'}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '0.9rem' }}>{ticket.subject}</div>
                      <span style={{
                        background: ticket.status === 'Open' ? 'rgba(255,101,132,0.1)' : 'rgba(0,212,170,0.1)',
                        color: ticket.status === 'Open' ? 'var(--accent2)' : 'var(--green)',
                        border: `1px solid ${ticket.status === 'Open' ? 'rgba(255,101,132,0.3)' : 'rgba(0,212,170,0.3)'}`,
                        borderRadius: '6px', padding: '2px 10px', fontSize: '0.75rem',
                      }}>{ticket.status}</span>
                    </div>
                    <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginBottom: '0.75rem' }}>{ticket.message}</p>
                    {ticket.admin_reply && (
                      <div style={{
                        background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)',
                        borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem',
                        fontSize: '0.82rem', color: 'var(--accent)',
                      }}>
                        Admin Reply: {ticket.admin_reply}
                      </div>
                    )}
                    {ticket.status === 'Open' && (
                      selectedTicket?.id === ticket.id ? (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            placeholder="Type your reply..."
                            style={{
                              flex: 1, padding: '8px 12px',
                              background: 'var(--bg)', border: '1px solid var(--border)',
                              borderRadius: '8px', color: 'var(--text)',
                              fontSize: '0.85rem', outline: 'none',
                            }}
                          />
                          <button onClick={() => replyTicket(ticket.id)} style={{
                            background: 'var(--accent)', color: '#fff',
                            border: 'none', padding: '8px 16px',
                            borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem',
                          }}>Send</button>
                          <button onClick={() => setSelectedTicket(null)} style={{
                            background: 'transparent', color: 'var(--muted)',
                            border: '1px solid var(--border)', padding: '8px 12px',
                            borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem',
                          }}>Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setSelectedTicket(ticket)} style={{
                          background: 'rgba(108,99,255,0.1)',
                          border: '1px solid rgba(108,99,255,0.3)',
                          color: 'var(--accent)', padding: '6px 14px',
                          borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem',
                        }}>Reply</button>
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
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>⚠️ User Reports</h2>
            {reports.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>No reports yet</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {reports.map((report, i) => (
                  <div key={i} style={{
                    padding: '1rem', background: 'var(--bg)',
                    borderRadius: '10px', border: '1px solid rgba(255,101,132,0.2)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '0.88rem' }}>
                        Report #{i + 1}
                      </div>
                      <span style={{
                        background: report.status === 'Pending' ? 'rgba(255,101,132,0.1)' : 'rgba(0,212,170,0.1)',
                        color: report.status === 'Pending' ? 'var(--accent2)' : 'var(--green)',
                        borderRadius: '6px', padding: '2px 10px', fontSize: '0.75rem',
                        border: `1px solid ${report.status === 'Pending' ? 'rgba(255,101,132,0.3)' : 'rgba(0,212,170,0.3)'}`,
                      }}>{report.status}</span>
                    </div>
                    <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginBottom: '0.75rem' }}>
                      Reason: {report.reason}
                    </p>
                    {report.status === 'Pending' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => suspendUser(report.reported_user_id, report.reason)} style={{
                          background: 'rgba(255,101,132,0.1)',
                          border: '1px solid rgba(255,101,132,0.3)',
                          color: 'var(--accent2)', padding: '5px 12px',
                          borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem',
                        }}>Suspend User</button>
                        <button onClick={async () => {
                          await supabase.from('reports').update({ status: 'Dismissed' }).eq('id', report.id);
                          fetchAll();
                        }} style={{
                          background: 'transparent', border: '1px solid var(--border)',
                          color: 'var(--muted)', padding: '5px 12px',
                          borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem',
                        }}>Dismiss</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBSCRIPTIONS TAB */}
        {activeTab === 'subscriptions' && (
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>💳 Subscription Plans</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {[
                { plan: 'Free', price: '$0', bids: '5 bids/day', color: 'var(--muted)', features: ['5 daily bids', 'Basic profile', 'Apply to jobs', 'Standard support'] },
                { plan: 'Weekly', price: '$9.99/week', bids: 'Unlimited bids', color: 'var(--accent)', features: ['Unlimited bids', 'Featured profile', 'Priority listing', 'Fast support'] },
                { plan: 'Monthly', price: '$29.99/month', bids: 'Unlimited bids', color: 'var(--green)', features: ['Unlimited bids', 'DevMarket Choice badge', 'Top search ranking', 'Dedicated support'] },
              ].map((p, i) => (
                <div key={i} style={{
                  background: 'var(--bg)', border: `1px solid ${p.color}`,
                  borderRadius: '14px', padding: '1.5rem',
                }}>
                  <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem', color: p.color, marginBottom: '0.5rem' }}>{p.plan}</div>
                  <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>{p.price}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.82rem', marginBottom: '1rem' }}>{p.bids}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {p.features.map((f, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--muted)' }}>
                        <span style={{ color: p.color }}>✓</span> {f}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem' }}>👥 User Management</h2>
              <input
                placeholder="Search by email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  padding: '8px 14px', background: 'var(--bg)',
                  border: '1px solid var(--border)', borderRadius: '8px',
                  color: 'var(--text)', fontSize: '0.85rem', outline: 'none',
                }}
              />
            </div>

            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Users are managed via Supabase Authentication dashboard. Use buttons below to manage status.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {jobs.filter(j => j.title.toLowerCase().includes(search.toLowerCase())).slice(0, 5).map((job, i) => (
                <div key={i} style={{
                  padding: '1rem', background: 'var(--bg)',
                  borderRadius: '10px', border: '1px solid var(--border)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem',
                }}>
                  <div>
                    <div style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '0.9rem' }}>{job.title}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>Buyer ID: {job.buyer_id?.slice(0, 8)}...</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button onClick={() => verifyUser(job.buyer_id)} style={{
                      background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)',
                      color: 'var(--green)', padding: '5px 12px',
                      borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem',
                    }}>✓ Verify</button>
                    <button onClick={() => featureUser(job.buyer_id)} style={{
                      background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.3)',
                      color: 'var(--accent)', padding: '5px 12px',
                      borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem',
                    }}>⭐ Feature</button>
                    <button onClick={() => suspendUser(job.buyer_id, 'Violation of terms')} style={{
                      background: 'rgba(255,101,132,0.1)', border: '1px solid rgba(255,101,132,0.3)',
                      color: 'var(--accent2)', padding: '5px 12px',
                      borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem',
                    }}>🚫 Suspend</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '1.5rem', padding: '1rem',
              background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)',
              borderRadius: '10px',
            }}>
              <p style={{ color: 'var(--accent)', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                💡 Full User Management
              </p>
              <p style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
                For complete user list with emails, go to Supabase Dashboard → Authentication → Users
              </p>
              <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer">
                <button style={{
                  marginTop: '0.75rem', background: 'var(--accent)', color: '#fff',
                  border: 'none', padding: '8px 16px', borderRadius: '8px',
                  cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'Syne', fontWeight: 600,
                }}>Open Supabase Dashboard →</button>
              </a>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
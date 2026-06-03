'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function BuyerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }
      setUser(user);
      const { data: jobs } = await supabase
        .from('jobs').select('*, proposals(*)')
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });
      if (jobs) setMyJobs(jobs);
      setLoading(false);
    };
    fetchData();
  }, []);

  const fetchProposals = async (jobId: string) => {
    const { data } = await supabase
      .from('proposals').select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });
    if (data) setProposals(data);
  };

  const updateProposalStatus = async (proposalId: string, status: string) => {
    const { error } = await supabase
      .from('proposals').update({ status }).eq('id', proposalId);
    if (!error) {
      setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status } : p));
      alert(`Proposal ${status}!`);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <p>Loading...</p>
      </div>
    </div>
  );

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Client';
  const userInitial = userName[0].toUpperCase();
  const totalProposals = myJobs.reduce((acc: number, job: any) => acc + (job.proposals?.length || 0), 0);

  const navItems = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'jobs', icon: '📋', label: 'My Jobs' },
    { id: 'proposals', icon: '📨', label: 'Proposals' },
    { id: 'messages', icon: '💬', label: 'Messages' },
  ];

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '6px',
            background: 'var(--accent)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '0.9rem',
          }}>D</div>
          <span style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '1.2rem', color: 'var(--text)' }}>
            Dev<span style={{ color: 'var(--accent)' }}>Lpers</span>
          </span>
        </Link>
      </div>

      {/* Profile */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'var(--accent2)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '1rem', flexShrink: 0,
          }}>{userInitial}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</div>
            <span style={{ background: '#fff7ed', color: '#c2410c', fontSize: '0.7rem', fontWeight: 600, padding: '1px 6px', borderRadius: '4px' }}>
              Client Account
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0.75rem 0' }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }} style={{
            width: '100%', padding: '0.7rem 1.5rem',
            background: activeTab === item.id ? '#f0fdf4' : 'transparent',
            border: 'none',
            borderLeft: activeTab === item.id ? '3px solid var(--accent)' : '3px solid transparent',
            color: activeTab === item.id ? 'var(--accent)' : 'var(--text2)',
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            cursor: 'pointer', fontSize: '0.88rem',
            fontWeight: activeTab === item.id ? 600 : 400,
            textAlign: 'left', transition: 'all 0.15s',
          }}>
            <span>{item.icon}</span> {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Link href="/post-job" style={{ textDecoration: 'none' }}>
          <button style={{
            width: '100%', padding: '9px',
            background: 'var(--accent)', border: 'none',
            borderRadius: '4px', color: '#fff',
            cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
          }}>+ Post a Job</button>
        </Link>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href="/support" style={{ textDecoration: 'none', flex: 1 }}>
            <button style={{
              width: '100%', padding: '7px',
              background: '#fff', border: '1px solid var(--border)',
              borderRadius: '4px', color: 'var(--text2)',
              cursor: 'pointer', fontSize: '0.78rem',
            }}>🎫 Support</button>
          </Link>
          <button onClick={handleLogout} style={{
            flex: 1, padding: '7px',
            background: '#fff', border: '1px solid var(--border)',
            borderRadius: '4px', color: 'var(--text2)',
            cursor: 'pointer', fontSize: '0.78rem',
          }}>🚪 Logout</button>
        </div>
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
          background: '#fff', borderRight: '1px solid var(--border)',
          position: 'fixed', top: 0, left: 0, zIndex: 50,
          flexDirection: 'column', display: 'flex',
        }}>
          <SidebarContent />
        </aside>

        {/* MOBILE HEADER */}
        <div className="dash-mobile-header" style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: '#fff', borderBottom: '1px solid var(--border)',
          padding: '0 1rem', height: '60px',
          alignItems: 'center', justifyContent: 'space-between',
          display: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>D</div>
            <span style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)' }}>Dev<span style={{ color: 'var(--accent)' }}>Lpers</span></span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>{userInitial}</div>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', fontSize: '1.2rem', padding: '6px 10px', borderRadius: '4px' }}>
              {sidebarOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* MOBILE SIDEBAR OVERLAY */}
        {sidebarOpen && (
          <>
            <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 98, background: 'rgba(0,0,0,0.4)' }} />
            <aside style={{
              position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 99,
              width: '280px', background: '#fff',
              borderRight: '1px solid var(--border)',
              overflowY: 'auto', display: 'flex', flexDirection: 'column',
            }}>
              <SidebarContent />
            </aside>
          </>
        )}

        {/* MAIN */}
        <main className="dash-main" style={{ flex: 1, padding: '2rem' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', marginBottom: '0.25rem', color: 'var(--text)' }}>
                Welcome back, {userName} 👋
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{user?.email}</p>
            </div>
            <Link href="/post-job">
              <button style={{
                background: 'var(--accent)', color: '#fff',
                border: 'none', padding: '10px 20px',
                borderRadius: '4px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
              }}>+ Post a Job</button>
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem', marginBottom: '2rem',
          }}>
            {[
              { label: 'Jobs Posted', value: myJobs.length, icon: '📋', color: '#3b82f6' },
              { label: 'Total Proposals', value: totalProposals, icon: '📨', color: 'var(--accent)' },
              { label: 'Open Jobs', value: myJobs.filter(j => j.status === 'Open').length, icon: '🟢', color: 'var(--accent)' },
              { label: 'Member Since', value: new Date(user?.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), icon: '📅', color: 'var(--text2)' },
            ].map(s => (
              <div key={s.label} style={{
                background: '#fff', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '1.25rem',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}>
                <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                <div style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: '0.2rem', color: s.color }}>{s.value}</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>📋 Recent Jobs</h2>
                  <Link href="/post-job">
                    <button style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: 'var(--accent)', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>+ New Job</button>
                  </Link>
                </div>
                {myJobs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--muted)', background: '#fafafa', borderRadius: '6px' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
                    <p style={{ marginBottom: '1rem', fontWeight: 500, color: 'var(--text2)' }}>No jobs posted yet</p>
                    <Link href="/post-job">
                      <button style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Post Your First Job →</button>
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {myJobs.slice(0, 3).map((job, i) => (
                      <div key={i} style={{ padding: '1rem', background: '#fafafa', borderRadius: '6px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.25rem' }}>{job.title}</div>
                          <div style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>📨 {job.proposals?.length || 0} proposals</div>
                        </div>
                        <button onClick={() => { setSelectedJob(job); setActiveTab('proposals'); fetchProposals(job.id); }} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: 'var(--accent)', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                          View Proposals →
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ background: 'linear-gradient(135deg, #f0fdf4, #e8fdf2)', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.3rem', color: 'var(--text)' }}>Need a Developer? 🚀</h3>
                  <p style={{ color: 'var(--text2)', fontSize: '0.83rem' }}>Browse 12,000+ verified developers ready to work</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <Link href="/developers">
                    <button style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '4px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>Browse Developers</button>
                  </Link>
                  <Link href="/post-job">
                    <button style={{ background: '#fff', color: 'var(--text2)', border: '1px solid var(--border)', padding: '9px 18px', borderRadius: '4px', fontSize: '0.85rem', cursor: 'pointer' }}>Post a Job</button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* JOBS TAB */}
          {activeTab === 'jobs' && (
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>📋 All Posted Jobs</h2>
                <Link href="/post-job">
                  <button style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: 'var(--accent)', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>+ New Job</button>
                </Link>
              </div>
              {myJobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--muted)', background: '#fafafa', borderRadius: '6px' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
                  <p style={{ marginBottom: '1rem' }}>No jobs posted yet</p>
                  <Link href="/post-job">
                    <button style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Post Your First Job →</button>
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {myJobs.map((job, i) => (
                    <div key={i} style={{ padding: '1.25rem', background: '#fafafa', borderRadius: '6px', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>{job.title}</div>
                        <span style={{
                          background: job.status === 'Open' ? '#f0fdf4' : '#fef2f2',
                          color: job.status === 'Open' ? 'var(--accent)' : '#dc2626',
                          border: `1px solid ${job.status === 'Open' ? '#bbf7d0' : '#fecaca'}`,
                          borderRadius: '100px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: 600,
                        }}>{job.status}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
                          📨 {job.proposals?.length || 0} proposals · 📁 {job.category}
                        </span>
                        <button onClick={() => { setSelectedJob(job); setActiveTab('proposals'); fetchProposals(job.id); }} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: 'var(--accent)', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                          View Proposals →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROPOSALS TAB */}
          {activeTab === 'proposals' && (
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem', color: 'var(--text)' }}>
                📨 Proposals {selectedJob ? `— ${selectedJob.title}` : ''}
              </h2>

              {!selectedJob ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {myJobs.map((job, i) => (
                    <div key={i} style={{ padding: '1rem', background: '#fafafa', borderRadius: '6px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>{job.title}</div>
                        <div style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>📨 {job.proposals?.length || 0} proposals</div>
                      </div>
                      <button onClick={() => { setSelectedJob(job); fetchProposals(job.id); }} style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '7px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>
                        View →
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <button onClick={() => { setSelectedJob(null); setProposals([]); }} style={{ background: 'transparent', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: '0.85rem', marginBottom: '1rem', padding: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    ← Back to Jobs
                  </button>
                  {proposals.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--muted)', background: '#fafafa', borderRadius: '6px' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📭</div>
                      <p>No proposals yet for this job</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {proposals.map((p, i) => (
                        <div key={i} style={{
                          padding: '1.25rem', background: '#fafafa', borderRadius: '6px',
                          border: `1px solid ${p.status === 'Accepted' ? '#bbf7d0' : p.status === 'Declined' ? '#fecaca' : 'var(--border)'}`,
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>Proposal #{i + 1}</div>
                              <div style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '1rem' }}>Bid: ${p.bid_amount}</div>
                            </div>
                            <span style={{
                              background: p.status === 'Accepted' ? '#f0fdf4' : p.status === 'Declined' ? '#fef2f2' : '#eff6ff',
                              color: p.status === 'Accepted' ? 'var(--accent)' : p.status === 'Declined' ? '#dc2626' : '#3b82f6',
                              border: `1px solid ${p.status === 'Accepted' ? '#bbf7d0' : p.status === 'Declined' ? '#fecaca' : '#bfdbfe'}`,
                              borderRadius: '100px', padding: '3px 12px', fontSize: '0.75rem', fontWeight: 600,
                            }}>{p.status}</span>
                          </div>
                          <p style={{ color: 'var(--text2)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>{p.cover_letter}</p>
                          <div style={{ color: 'var(--muted)', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
                            Submitted: {new Date(p.created_at).toLocaleDateString()}
                          </div>
                          {p.status === 'Pending' && (
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                              <button onClick={() => updateProposalStatus(p.id, 'Accepted')} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: 'var(--accent)', padding: '8px 18px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
                                ✓ Accept
                              </button>
                              <button onClick={() => updateProposalStatus(p.id, 'Declined')} style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '8px 18px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
                                ✗ Decline
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === 'messages' && (
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '2.5rem', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text)' }}>Messages</h3>
              <p style={{ color: 'var(--text2)', marginBottom: '1.5rem' }}>Chat with developers directly</p>
              <Link href="/messages">
                <button style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}>
                  Open Messages →
                </button>
              </Link>
            </div>
          )}

        </main>
      </div>
    </>
  );
}
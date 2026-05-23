'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function BuyerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState<any>(null);
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }
      setUser(user);

      const { data: jobs } = await supabase
        .from('jobs')
        .select('*, proposals(*)')
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });

      if (jobs) setMyJobs(jobs);
      setLoading(false);
    };
    fetchData();
  }, []);

  const fetchProposals = async (jobId: string) => {
    const { data } = await supabase
      .from('proposals')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });
    if (data) setProposals(data);
  };

  const updateProposalStatus = async (proposalId: string, status: string) => {
    const { error } = await supabase
      .from('proposals')
      .update({ status })
      .eq('id', proposalId);
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
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <p>Loading dashboard...</p>
      </div>
    </div>
  );

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Buyer';
  const userInitial = userName[0].toUpperCase();
  const totalProposals = myJobs.reduce((acc: number, job: any) => acc + (job.proposals?.length || 0), 0);

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

        <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent2), var(--accent))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem',
            }}>{userInitial}</div>
            <div>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.9rem' }}>{userName}</div>
              <div style={{ color: 'var(--accent2)', fontSize: '0.75rem' }}>● Buyer</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          {[
            { id: 'overview', icon: '📊', label: 'Overview' },
            { id: 'jobs', icon: '📋', label: 'My Jobs' },
            { id: 'proposals', icon: '📨', label: 'Proposals' },
            { id: 'messages', icon: '💬', label: 'Messages' },
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

        <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link href="/post-job" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%', padding: '10px',
              background: 'var(--accent2)', border: 'none',
              borderRadius: '8px', color: '#fff',
              fontFamily: 'Syne', fontWeight: 600,
              cursor: 'pointer', fontSize: '0.85rem',
            }}>+ Post a Job</button>
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
            cursor: 'pointer', fontSize: '0.85rem',
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
          <Link href="/post-job">
            <button style={{
              background: 'var(--accent2)', color: '#fff',
              border: 'none', padding: '10px 22px',
              borderRadius: '10px', fontFamily: 'Syne',
              fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
            }}>+ Post a Job</button>
          </Link>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem', marginBottom: '2rem',
        }}>
          {[
            { label: 'Jobs Posted', value: myJobs.length, icon: '📋' },
            { label: 'Total Proposals', value: totalProposals, icon: '📨' },
            { label: 'Open Jobs', value: myJobs.filter(j => j.status === 'Open').length, icon: '🟢' },
            { label: 'Member Since', value: new Date(user?.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), icon: '📅' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: '14px', padding: '1.25rem',
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{s.icon}</div>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', marginBottom: '0.25rem' }}>{s.value}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: '16px', padding: '1.5rem',
            }}>
              <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>📋 Recent Jobs</h2>
              {myJobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📭</div>
                  <p style={{ marginBottom: '1rem' }}>No jobs posted yet</p>
                  <Link href="/post-job">
                    <button style={{
                      background: 'var(--accent2)', color: '#fff',
                      border: 'none', padding: '10px 20px',
                      borderRadius: '8px', cursor: 'pointer',
                      fontFamily: 'Syne', fontWeight: 600,
                    }}>Post Your First Job →</button>
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {myJobs.slice(0, 3).map((job, i) => (
                    <div key={i} style={{
                      padding: '1rem', background: 'var(--bg)',
                      borderRadius: '10px', border: '1px solid var(--border)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem',
                    }}>
                      <div>
                        <div style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '0.9rem' }}>{job.title}</div>
                        <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                          📨 {job.proposals?.length || 0} proposals
                        </div>
                      </div>
                      <button onClick={() => { setSelectedJob(job); setActiveTab('proposals'); fetchProposals(job.id); }} style={{
                        background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.3)',
                        color: 'var(--accent)', padding: '6px 14px',
                        borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem',
                      }}>View Proposals</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,101,132,0.15))',
              border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
            }}>
              <div>
                <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.4rem' }}>
                  Need a Developer? 🚀
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                  Browse 12,000+ verified developers ready to work
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link href="/developers">
                  <button style={{
                    background: 'var(--accent)', color: '#fff',
                    border: 'none', padding: '10px 22px',
                    borderRadius: '8px', fontFamily: 'Syne',
                    fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                  }}>Browse Developers</button>
                </Link>
                <Link href="/post-job">
                  <button style={{
                    background: 'transparent', color: 'var(--text)',
                    border: '1px solid var(--border)', padding: '10px 22px',
                    borderRadius: '8px', fontSize: '0.9rem', cursor: 'pointer',
                  }}>Post a Job</button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* JOBS TAB */}
        {activeTab === 'jobs' && (
          <div style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '1.5rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem' }}>📋 All Posted Jobs</h2>
              <Link href="/post-job">
                <button style={{
                  background: 'transparent', border: '1px solid var(--border)',
                  color: 'var(--accent2)', padding: '6px 14px',
                  borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem',
                }}>+ New Job</button>
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {myJobs.map((job, i) => (
                <div key={i} style={{
                  padding: '1.25rem', background: 'var(--bg)',
                  borderRadius: '12px', border: '1px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.95rem' }}>{job.title}</div>
                    <span style={{
                      background: job.status === 'Open' ? 'rgba(0,212,170,0.1)' : 'rgba(255,101,132,0.1)',
                      color: job.status === 'Open' ? 'var(--green)' : 'var(--accent2)',
                      border: `1px solid ${job.status === 'Open' ? 'rgba(0,212,170,0.3)' : 'rgba(255,101,132,0.3)'}`,
                      borderRadius: '6px', padding: '2px 10px', fontSize: '0.75rem',
                    }}>{job.status}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
                      📨 {job.proposals?.length || 0} proposals · 📁 {job.category}
                    </span>
                    <button onClick={() => { setSelectedJob(job); setActiveTab('proposals'); fetchProposals(job.id); }} style={{
                      background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.3)',
                      color: 'var(--accent)', padding: '6px 14px',
                      borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem',
                    }}>View Proposals →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROPOSALS TAB */}
        {activeTab === 'proposals' && (
          <div style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '1.5rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem' }}>
                📨 Proposals {selectedJob ? `— ${selectedJob.title}` : ''}
              </h2>
              {!selectedJob && (
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Select a job to view proposals</p>
              )}
            </div>

            {!selectedJob ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {myJobs.map((job, i) => (
                  <div key={i} style={{
                    padding: '1rem', background: 'var(--bg)',
                    borderRadius: '10px', border: '1px solid var(--border)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '0.9rem' }}>{job.title}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>📨 {job.proposals?.length || 0} proposals</div>
                    </div>
                    <button onClick={() => { setSelectedJob(job); fetchProposals(job.id); }} style={{
                      background: 'var(--accent)', color: '#fff',
                      border: 'none', padding: '7px 16px',
                      borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem',
                    }}>View →</button>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <button onClick={() => { setSelectedJob(null); setProposals([]); }} style={{
                  background: 'transparent', border: 'none',
                  color: 'var(--muted)', cursor: 'pointer',
                  fontSize: '0.85rem', marginBottom: '1rem',
                  padding: 0,
                }}>← Back to Jobs</button>

                {proposals.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📭</div>
                    <p>No proposals yet for this job</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {proposals.map((p, i) => (
                      <div key={i} style={{
                        padding: '1.25rem', background: 'var(--bg)',
                        borderRadius: '12px',
                        border: `1px solid ${p.status === 'Accepted' ? 'rgba(0,212,170,0.3)' : p.status === 'Declined' ? 'rgba(255,101,132,0.3)' : 'var(--border)'}`,
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div>
                            <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.95rem' }}>
                              Developer Proposal #{i + 1}
                            </div>
                            <div style={{ color: 'var(--green)', fontWeight: 700, fontSize: '1rem' }}>
                              Bid: ${p.bid_amount}
                            </div>
                          </div>
                          <span style={{
                            background: p.status === 'Accepted' ? 'rgba(0,212,170,0.1)' : p.status === 'Declined' ? 'rgba(255,101,132,0.1)' : 'rgba(108,99,255,0.1)',
                            color: p.status === 'Accepted' ? 'var(--green)' : p.status === 'Declined' ? 'var(--accent2)' : 'var(--accent)',
                            border: `1px solid ${p.status === 'Accepted' ? 'rgba(0,212,170,0.3)' : p.status === 'Declined' ? 'rgba(255,101,132,0.3)' : 'rgba(108,99,255,0.3)'}`,
                            borderRadius: '6px', padding: '3px 12px', fontSize: '0.78rem', fontWeight: 600,
                          }}>{p.status}</span>
                        </div>

                        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                          {p.cover_letter}
                        </p>

                        <div style={{ color: 'var(--muted)', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
                          Submitted: {new Date(p.created_at).toLocaleDateString()}
                        </div>

                        {p.status === 'Pending' && (
                          <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button onClick={() => updateProposalStatus(p.id, 'Accepted')} style={{
                              background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)',
                              color: 'var(--green)', padding: '8px 18px',
                              borderRadius: '8px', cursor: 'pointer',
                              fontFamily: 'Syne', fontWeight: 600, fontSize: '0.85rem',
                            }}>✓ Accept</button>
                            <button onClick={() => updateProposalStatus(p.id, 'Declined')} style={{
                              background: 'rgba(255,101,132,0.1)', border: '1px solid rgba(255,101,132,0.3)',
                              color: 'var(--accent2)', padding: '8px 18px',
                              borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem',
                            }}>✗ Decline</button>
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
          <div style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '2rem', textAlign: 'center',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
            <h3 style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: '0.75rem' }}>Messages</h3>
            <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Chat with developers directly</p>
            <Link href="/messages">
              <button style={{
                background: 'var(--accent)', color: '#fff',
                border: 'none', padding: '12px 28px',
                borderRadius: '10px', fontFamily: 'Syne',
                fontWeight: 600, cursor: 'pointer',
              }}>Open Messages →</button>
            </Link>
          </div>
        )}

      </main>
    </div>
  );
}
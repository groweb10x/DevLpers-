'use client';
import { useState } from 'react';
import Link from 'next/link';

const stats = [
  { label: 'Total Users', value: '20,842', icon: '👥', change: '+142 today' },
  { label: 'Active Jobs', value: '1,204', icon: '📋', change: '+38 today' },
  { label: 'Revenue', value: '$48,200', icon: '💰', change: '+$1,200 today' },
  { label: 'Transactions', value: '3,891', icon: '💳', change: '+89 today' },
];

const recentUsers = [
  { name: 'Ali Hassan', email: 'ali@gmail.com', role: 'Developer', joined: 'May 20, 2026', status: 'Active' },
  { name: 'Ahmed Store', email: 'ahmed@store.pk', role: 'Buyer', joined: 'May 20, 2026', status: 'Active' },
  { name: 'Sara Khan', email: 'sara@gmail.com', role: 'Developer', joined: 'May 19, 2026', status: 'Active' },
  { name: 'Hassan Co', email: 'hassan@co.pk', role: 'Buyer', joined: 'May 19, 2026', status: 'Suspended' },
  { name: 'Usman Malik', email: 'usman@gmail.com', role: 'Developer', joined: 'May 18, 2026', status: 'Active' },
];

const recentJobs = [
  { title: 'Full Stack Developer', budget: '$500-1000', buyer: 'Ahmed Store', posted: 'May 20', status: 'Active' },
  { title: 'Mobile App UI', budget: '$800-1500', buyer: 'TechPak Ltd', posted: 'May 20', status: 'Active' },
  { title: 'AI Chatbot', budget: '$40/hr', buyer: 'Hassan Co', posted: 'May 19', status: 'Flagged' },
  { title: 'WordPress Plugin', budget: '$200-400', buyer: 'Blog Pro', posted: 'May 19', status: 'Active' },
  { title: 'React Dashboard', budget: '$600-900', buyer: 'StartupX', posted: 'May 18', status: 'Closed' },
];

const disputes = [
  { id: 'DSP001', project: 'E-commerce Website', buyer: 'Ahmed Store', developer: 'Ali Hassan', amount: '$800', status: 'Open' },
  { id: 'DSP002', project: 'Mobile App', buyer: 'TechPak', developer: 'Sara Khan', amount: '$500', status: 'Resolved' },
  { id: 'DSP003', project: 'AI Chatbot', buyer: 'Hassan Co', developer: 'Usman Malik', amount: '$1200', status: 'Open' },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('overview');
  const [userFilter, setUserFilter] = useState('All');

  const filteredUsers = recentUsers.filter(u => {
    if (userFilter === 'Developers') return u.role === 'Developer';
    if (userFilter === 'Buyers') return u.role === 'Buyer';
    if (userFilter === 'Suspended') return u.status === 'Suspended';
    return true;
  });

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
          <div style={{
            marginTop: '0.5rem',
            background: 'rgba(255,101,132,0.1)',
            border: '1px solid rgba(255,101,132,0.3)',
            borderRadius: '6px', padding: '3px 10px',
            fontSize: '0.72rem', color: 'var(--accent2)',
            display: 'inline-block',
          }}>⚡ Admin Panel</div>
        </div>

        <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent2), var(--accent))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem',
            }}>S</div>
            <div>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.9rem' }}>Super Admin</div>
              <div style={{ color: 'var(--accent2)', fontSize: '0.75rem' }}>● Admin</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          {[
            { id: 'overview', icon: '📊', label: 'Overview' },
            { id: 'users', icon: '👥', label: 'Users' },
            { id: 'jobs', icon: '📋', label: 'Jobs' },
            { id: 'disputes', icon: '⚖️', label: 'Disputes' },
            { id: 'revenue', icon: '💰', label: 'Revenue' },
            { id: 'settings', icon: '⚙️', label: 'Settings' },
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
      <main style={{ marginLeft: '240px', flex: 1, padding: '2rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', marginBottom: '0.25rem' }}>
              Admin Dashboard ⚡
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Platform overview and management</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button style={{
              background: 'transparent', border: '1px solid var(--border)',
              color: 'var(--text)', padding: '9px 18px',
              borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem',
            }}>📊 Export Report</button>
            <button style={{
              background: 'var(--accent2)', border: 'none',
              color: '#fff', padding: '9px 18px',
              borderRadius: '8px', cursor: 'pointer',
              fontFamily: 'Syne', fontWeight: 600, fontSize: '0.85rem',
            }}>+ Add User</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem', marginBottom: '2rem',
        }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: '14px', padding: '1.25rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
                <span style={{
                  background: 'rgba(0,212,170,0.1)', color: 'var(--green)',
                  border: '1px solid rgba(0,212,170,0.2)',
                  borderRadius: '6px', padding: '2px 8px', fontSize: '0.72rem',
                }}>{s.change}</span>
              </div>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', marginBottom: '0.25rem' }}>{s.value}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem' }}>👥 Recent Users</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['All', 'Developers', 'Buyers', 'Suspended'].map(f => (
                <button key={f} onClick={() => setUserFilter(f)} style={{
                  padding: '5px 12px',
                  background: userFilter === f ? 'rgba(108,99,255,0.15)' : 'transparent',
                  border: `1px solid ${userFilter === f ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: '100px',
                  color: userFilter === f ? 'var(--accent)' : 'var(--muted)',
                  cursor: 'pointer', fontSize: '0.78rem',
                }}>{f}</button>
              ))}
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Name', 'Email', 'Role', 'Joined', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{
                      padding: '0.75rem 1rem', textAlign: 'left',
                      color: 'var(--muted)', fontSize: '0.78rem',
                      fontWeight: 600, fontFamily: 'Syne',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.8rem', fontWeight: 700,
                        }}>{user.name[0]}</div>
                        <span style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '0.88rem' }}>{user.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--muted)', fontSize: '0.82rem' }}>{user.email}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        background: user.role === 'Developer' ? 'rgba(108,99,255,0.1)' : 'rgba(255,101,132,0.1)',
                        color: user.role === 'Developer' ? 'var(--accent)' : 'var(--accent2)',
                        border: `1px solid ${user.role === 'Developer' ? 'rgba(108,99,255,0.3)' : 'rgba(255,101,132,0.3)'}`,
                        borderRadius: '6px', padding: '2px 10px', fontSize: '0.75rem',
                      }}>{user.role}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--muted)', fontSize: '0.82rem' }}>{user.joined}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        background: user.status === 'Active' ? 'rgba(0,212,170,0.1)' : 'rgba(255,101,132,0.1)',
                        color: user.status === 'Active' ? 'var(--green)' : 'var(--accent2)',
                        border: `1px solid ${user.status === 'Active' ? 'rgba(0,212,170,0.3)' : 'rgba(255,101,132,0.3)'}`,
                        borderRadius: '6px', padding: '2px 10px', fontSize: '0.75rem',
                      }}>{user.status}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button style={{
                          background: 'transparent', border: '1px solid var(--border)',
                          color: 'var(--muted)', padding: '4px 10px',
                          borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem',
                        }}>View</button>
                        <button style={{
                          background: 'transparent', border: '1px solid rgba(255,101,132,0.3)',
                          color: 'var(--accent2)', padding: '4px 10px',
                          borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem',
                        }}>{user.status === 'Active' ? 'Suspend' : 'Activate'}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Jobs & Disputes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          {/* Jobs */}
          <div style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '1.5rem',
          }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>
              📋 Recent Jobs
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentJobs.map((job, i) => (
                <div key={i} style={{
                  padding: '0.85rem', background: 'var(--bg)',
                  borderRadius: '10px', border: '1px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '0.85rem' }}>{job.title}</span>
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 600,
                      color: job.status === 'Active' ? 'var(--green)' : job.status === 'Flagged' ? 'var(--accent2)' : 'var(--muted)',
                    }}>{job.status}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{job.buyer} · {job.posted}</span>
                    <span style={{ color: 'var(--green)', fontSize: '0.78rem', fontWeight: 600 }}>{job.budget}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Disputes */}
          <div style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '1.5rem',
          }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>
              ⚖️ Disputes
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {disputes.map((d, i) => (
                <div key={i} style={{
                  padding: '0.85rem', background: 'var(--bg)',
                  borderRadius: '10px', border: `1px solid ${d.status === 'Open' ? 'rgba(255,101,132,0.3)' : 'var(--border)'}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '0.85rem' }}>{d.project}</span>
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 600,
                      color: d.status === 'Open' ? 'var(--accent2)' : 'var(--green)',
                    }}>{d.status}</span>
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.78rem', marginBottom: '0.5rem' }}>
                    {d.buyer} vs {d.developer}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--green)', fontSize: '0.82rem', fontWeight: 700 }}>{d.amount}</span>
                    {d.status === 'Open' && (
                      <button style={{
                        background: 'rgba(108,99,255,0.1)',
                        border: '1px solid rgba(108,99,255,0.3)',
                        color: 'var(--accent)', padding: '4px 10px',
                        borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem',
                      }}>Resolve</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
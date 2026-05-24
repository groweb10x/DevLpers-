'use client';
import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Support() {
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [form, setForm] = useState({ subject: '', message: '', category: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('new');

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }
      setUser(user);

      const { data: ticketsData } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ticketsData) setTickets(ticketsData);
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!form.subject || !form.message || !form.category) {
      alert('Please fill all fields!');
      return;
    }
    setLoading(true);

    const { error } = await supabase.from('support_tickets').insert({
      user_id: user.id,
      subject: form.subject,
      message: form.message,
      status: 'Open',
    });

    setLoading(false);
    if (error) {
      alert('Error: ' + error.message);
    } else {
      setSubmitted(true);
      setForm({ subject: '', message: '', category: '' });
    }
  };

  const categories = [
    { icon: '💰', label: 'Payment Issue' },
    { icon: '👤', label: 'Account Problem' },
    { icon: '🚫', label: 'Report Scammer' },
    { icon: '📋', label: 'Job Related' },
    { icon: '🔒', label: 'Security Issue' },
    { icon: '❓', label: 'Other' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* NAVBAR */}
      <Navbar />

      <div style={{ paddingTop: '80px', padding: '80px 5% 3rem', maxWidth: '800px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '0.5rem' }}>
            Support Center 🎫
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
            We are here to help! Submit a ticket and we will respond within 24 hours.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          {[
            { id: 'new', label: '+ New Ticket' },
            { id: 'tickets', label: `My Tickets (${tickets.length})` },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '9px 20px',
              background: activeTab === tab.id ? 'var(--accent)' : 'transparent',
              border: `1px solid ${activeTab === tab.id ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: '8px',
              color: activeTab === tab.id ? '#fff' : 'var(--muted)',
              cursor: 'pointer', fontSize: '0.88rem',
              fontFamily: activeTab === tab.id ? 'Syne' : 'DM Sans',
              fontWeight: activeTab === tab.id ? 600 : 400,
              transition: 'all 0.2s',
            }}>{tab.label}</button>
          ))}
        </div>

        {/* NEW TICKET */}
        {activeTab === 'new' && (
          <div style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: '20px', padding: '2rem',
          }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>✅</div>
                <h2 style={{ fontFamily: 'Syne', fontWeight: 700, color: 'var(--green)', marginBottom: '0.75rem' }}>
                  Ticket Submitted!
                </h2>
                <p style={{ color: 'var(--muted)', marginBottom: '2rem', lineHeight: 1.7 }}>
                  We have received your request. Our team will respond within 24 hours.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                  <button onClick={() => { setSubmitted(false); setActiveTab('tickets'); }} style={{
                    background: 'var(--accent)', color: '#fff',
                    border: 'none', padding: '10px 24px',
                    borderRadius: '8px', cursor: 'pointer',
                    fontFamily: 'Syne', fontWeight: 600,
                  }}>View My Tickets</button>
                  <button onClick={() => setSubmitted(false)} style={{
                    background: 'transparent', color: 'var(--text)',
                    border: '1px solid var(--border)', padding: '10px 24px',
                    borderRadius: '8px', cursor: 'pointer',
                  }}>New Ticket</button>
                </div>
              </div>
            ) : (
              <>
                <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                  Submit a Support Ticket
                </h2>

                {/* Category */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '0.75rem' }}>
                    Issue Category *
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {categories.map(cat => (
                      <button key={cat.label} onClick={() => setForm({ ...form, category: cat.label })} style={{
                        padding: '7px 14px',
                        background: form.category === cat.label ? 'rgba(108,99,255,0.15)' : 'transparent',
                        border: `1px solid ${form.category === cat.label ? 'var(--accent)' : 'var(--border)'}`,
                        borderRadius: '100px',
                        color: form.category === cat.label ? 'var(--accent)' : 'var(--muted)',
                        cursor: 'pointer', fontSize: '0.82rem', transition: 'all 0.2s',
                      }}>{cat.icon} {cat.label}</button>
                    ))}
                  </div>
                </div>

                {/* Subject */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '0.4rem' }}>
                    Subject *
                  </label>
                  <input
                    placeholder="Brief description of your issue"
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    style={{
                      width: '100%', padding: '12px 14px',
                      background: 'var(--bg)', border: '1px solid var(--border)',
                      borderRadius: '8px', color: 'var(--text)',
                      fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
                    }}
                    onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--accent)'}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'}
                  />
                </div>

                {/* Message */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '0.4rem' }}>
                    Message *
                  </label>
                  <textarea
                    placeholder="Describe your issue in detail. Include any relevant information like order IDs, usernames, or screenshots..."
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    rows={6}
                    style={{
                      width: '100%', padding: '12px 14px',
                      background: 'var(--bg)', border: '1px solid var(--border)',
                      borderRadius: '8px', color: 'var(--text)',
                      fontSize: '0.9rem', outline: 'none',
                      resize: 'vertical', fontFamily: 'DM Sans',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--accent)'}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'}
                  />
                </div>

                <button onClick={handleSubmit} disabled={loading} style={{
                  width: '100%', padding: '14px',
                  background: loading ? 'var(--border)' : 'var(--accent)',
                  border: 'none', borderRadius: '10px', color: '#fff',
                  fontFamily: 'Syne', fontWeight: 600, fontSize: '1rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}>
                  {loading ? 'Submitting...' : 'Submit Ticket →'}
                </button>
              </>
            )}
          </div>
        )}

        {/* MY TICKETS */}
        {activeTab === 'tickets' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tickets.length === 0 ? (
              <div style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: '16px', padding: '3rem',
                textAlign: 'center', color: 'var(--muted)',
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎫</div>
                <p style={{ marginBottom: '1rem' }}>No tickets yet</p>
                <button onClick={() => setActiveTab('new')} style={{
                  background: 'var(--accent)', color: '#fff',
                  border: 'none', padding: '10px 20px',
                  borderRadius: '8px', cursor: 'pointer',
                  fontFamily: 'Syne', fontWeight: 600,
                }}>Create First Ticket</button>
              </div>
            ) : (
              tickets.map((ticket, i) => (
                <div key={i} style={{
                  background: 'var(--card)', border: `1px solid ${ticket.status === 'Open' ? 'rgba(255,101,132,0.3)' : 'var(--border)'}`,
                  borderRadius: '16px', padding: '1.5rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem' }}>{ticket.subject}</h3>
                    <span style={{
                      background: ticket.status === 'Open' ? 'rgba(255,101,132,0.1)' : 'rgba(0,212,170,0.1)',
                      color: ticket.status === 'Open' ? 'var(--accent2)' : 'var(--green)',
                      border: `1px solid ${ticket.status === 'Open' ? 'rgba(255,101,132,0.3)' : 'rgba(0,212,170,0.3)'}`,
                      borderRadius: '6px', padding: '3px 12px', fontSize: '0.78rem', fontWeight: 600,
                    }}>{ticket.status}</span>
                  </div>

                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                    {ticket.message}
                  </p>

                  <div style={{ color: 'var(--muted)', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
                    Submitted: {new Date(ticket.created_at).toLocaleDateString()}
                  </div>

                  {ticket.admin_reply && (
                    <div style={{
                      background: 'rgba(0,212,170,0.08)',
                      border: '1px solid rgba(0,212,170,0.2)',
                      borderRadius: '10px', padding: '1rem',
                      marginTop: '0.75rem',
                    }}>
                      <div style={{ color: 'var(--green)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                        ✅ Admin Reply:
                      </div>
                      <p style={{ color: 'var(--text)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                        {ticket.admin_reply}
                      </p>
                    </div>
                  )}

                  {ticket.status === 'Open' && !ticket.admin_reply && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      background: 'rgba(108,99,255,0.08)',
                      border: '1px solid rgba(108,99,255,0.2)',
                      borderRadius: '8px', padding: '0.75rem',
                      marginTop: '0.75rem',
                    }}>
                      <span style={{ fontSize: '1rem' }}>⏳</span>
                      <span style={{ color: 'var(--accent)', fontSize: '0.82rem' }}>
                        Waiting for admin response...
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Quick Help */}
        <div style={{
          marginTop: '2rem',
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '1.5rem',
        }}>
          <h3 style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: '1rem' }}>Quick Help 💡</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {[
              { icon: '📖', title: 'How to Post a Job', desc: 'Step by step guide' },
              { icon: '💰', title: 'Payment Guide', desc: 'Escrow & withdrawals' },
              { icon: '⭐', title: 'Seller Levels', desc: 'Level up your account' },
              { icon: '🔒', title: 'Safety Tips', desc: 'Avoid scammers' },
            ].map((item, i) => (
              <div key={i} style={{
                padding: '1rem', background: 'var(--bg)',
                borderRadius: '10px', border: '1px solid var(--border)',
                cursor: 'pointer', transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                <div style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.25rem' }}>{item.title}</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
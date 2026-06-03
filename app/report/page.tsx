'use client';
import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ReportUser() {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    reportedEmail: '',
    reason: '',
    category: '',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }
      setUser(user);
    };
    getUser();
  }, []);

  const handleSubmit = async () => {
    if (!form.category || !form.reason || !form.description) {
      alert('Please fill all fields!');
      return;
    }
    setLoading(true);

    const { error } = await supabase.from('reports').insert({
      reporter_id: user.id,
      reported_user_id: user.id,
      reason: `${form.category}: ${form.reason} — ${form.description}`,
      status: 'Pending',
    });

    setLoading(false);
    if (error) {
      alert('Error: ' + error.message);
    } else {
      setSubmitted(true);
    }
  };

  const categories = [
    { icon: '🚫', label: 'Scammer / Fraud' },
    { icon: '💬', label: 'Fake Profile' },
    { icon: '💸', label: 'Payment Fraud' },
    { icon: '🤬', label: 'Harassment' },
    { icon: '📋', label: 'Fake Job Post' },
    { icon: '❓', label: 'Other' },
  ];

  const reasons = [
    'Did not deliver work',
    'Took payment and disappeared',
    'Using fake portfolio',
    'Threatening messages',
    'Posting spam jobs',
    'Identity theft',
    'Other reason',
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* NAVBAR */}
      <Navbar />
      <div style={{ paddingTop: '80px', padding: '80px clamp(16px,5%,60px) 3rem', maxWidth: '800px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '0.5rem' }}>
            Report a User 🚨
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
            Help us keep DevMarket safe. All reports are reviewed by our team within 24 hours.
          </p>
        </div>

        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: 'clamp(1rem,3vw,2rem)', boxShadow:'0 4px 16px rgba(0,0,0,0.08)',
        }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
              <h2 style={{ fontFamily: 'Inter', fontWeight: 700, color: 'var(--green)', marginBottom: '0.75rem' }}>
                Report Submitted!
              </h2>
              <p style={{ color: 'var(--muted)', marginBottom: '2rem', lineHeight: 1.7 }}>
                Our team will review this report within 24 hours. If the user is found guilty, appropriate action will be taken.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/dashboard">
                  <button style={{
                    background: '#1dbf73', color: '#fff',
                    border: 'none', padding: '10px 24px',
                    borderRadius: '8px', cursor: 'pointer',
                    fontFamily: 'Inter', fontWeight: 600,
                  }}>Go to Dashboard</button>
                </Link>
                <button onClick={() => { setSubmitted(false); setForm({ reportedEmail: '', reason: '', category: '', description: '' }); }} style={{
                  background: 'transparent', color: 'var(--text)',
                  border: '1px solid var(--border)', padding: '10px 24px',
                  borderRadius: '8px', cursor: 'pointer',
                }}>Report Another</button>
              </div>
            </div>
          ) : (
            <>
              <h2 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                Report Details
              </h2>

              {/* Reported User Email */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '0.4rem' }}>
                  Reported User Email (optional)
                </label>
                <input
                  placeholder="user@example.com"
                  value={form.reportedEmail}
                  onChange={e => setForm({ ...form, reportedEmail: e.target.value })}
                  style={{
                    width: '100%', padding: '12px 14px',
                    background: 'var(--bg)', border: '1px solid var(--border)',
                    borderRadius: '8px', color: 'var(--text)',
                    fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
                  }}
                  onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--accent2)'}
                  onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'}
                />
              </div>

              {/* Category */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '0.75rem' }}>
                  Report Category *
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {categories.map(cat => (
                    <button key={cat.label} onClick={() => setForm({ ...form, category: cat.label })} style={{
                      padding: '7px 14px',
                      background: form.category === cat.label ? 'rgba(255,101,132,0.15)' : 'transparent',
                      border: `1px solid ${form.category === cat.label ? 'var(--accent2)' : 'var(--border)'}`,
                      borderRadius: '100px',
                      color: form.category === cat.label ? 'var(--accent2)' : 'var(--muted)',
                      cursor: 'pointer', fontSize: '0.82rem', transition: 'all 0.2s',
                    }}>{cat.icon} {cat.label}</button>
                  ))}
                </div>
              </div>

              {/* Reason */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '0.75rem' }}>
                  Specific Reason *
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {reasons.map(reason => (
                    <button key={reason} onClick={() => setForm({ ...form, reason })} style={{
                      padding: '10px 14px', textAlign: 'left',
                      background: form.reason === reason ? 'rgba(255,101,132,0.08)' : 'transparent',
                      border: `1px solid ${form.reason === reason ? 'var(--accent2)' : 'var(--border)'}`,
                      borderRadius: '8px',
                      color: form.reason === reason ? 'var(--accent2)' : 'var(--muted)',
                      cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s',
                    }}>
                      {form.reason === reason ? '● ' : '○ '}{reason}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '0.4rem' }}>
                  Describe the Issue *
                </label>
                <textarea
                  placeholder="Please provide as much detail as possible. Include dates, amounts, and any other relevant information..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={5}
                  style={{
                    width: '100%', padding: '12px 14px',
                    background: 'var(--bg)', border: '1px solid var(--border)',
                    borderRadius: '8px', color: 'var(--text)',
                    fontSize: '0.9rem', outline: 'none',
                    resize: 'vertical', fontFamily: 'DM Sans',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--accent2)'}
                  onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'}
                />
              </div>

              {/* Warning */}
              <div style={{
                background: 'rgba(255,101,132,0.08)',
                border: '1px solid rgba(255,101,132,0.2)',
                borderRadius: '10px', padding: '1rem',
                marginBottom: '1.5rem',
              }}>
                <p style={{ color: 'var(--accent2)', fontSize: '0.82rem', lineHeight: 1.6 }}>
                  ⚠️ False reports may result in your account being suspended. Please only report genuine issues.
                </p>
              </div>

              <button onClick={handleSubmit} disabled={loading} style={{
                width: '100%', padding: '14px',
                background: loading ? 'var(--border)' : '#1dbf73',
                border: 'none', borderRadius: '10px', color: '#fff',
                fontFamily: 'Inter', fontWeight: 600, fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}>
                {loading ? 'Submitting...' : '🚨 Submit Report'}
              </button>
            </>
          )}
        </div>

        {/* Safety Tips */}
        <div style={{
          marginTop: '2rem',
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '1.5rem',
        }}>
          <h3 style={{ fontFamily: 'Inter', fontWeight: 700, marginBottom: '1rem' }}>🔒 Safety Tips</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[
              'Never pay outside the DevMarket platform',
              'Always use escrow for payments',
              'Check developer reviews before hiring',
              'Never share personal banking details',
              'Report suspicious behavior immediately',
            ].map((tip, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
                <span style={{ color: 'var(--green)', flexShrink: 0 }}>✓</span> {tip}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
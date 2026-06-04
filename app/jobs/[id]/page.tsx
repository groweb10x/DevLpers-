'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Navbar from '../../components/Navbar';

export default function JobDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [proposal, setProposal] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setIsLoggedIn(true);
      setAuthChecked(true);

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) setJob(data);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    if (!proposal || !bidAmount) {
      alert('Please fill all fields!');
      return;
    }
    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    const { error } = await supabase.from('proposals').insert({
      job_id: id,
      developer_id: user.id,
      bid_amount: Number(bidAmount),
      cover_letter: proposal,
      status: 'Pending',
    });
    setSubmitting(false);
    if (error) {
      alert('Error: ' + error.message);
    } else {
      setSubmitted(true);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <p>Loading job...</p>
      </div>

      <style jsx>{`
        .job-layout{
          display:grid;
          grid-template-columns:1fr 340px;
          gap:2rem;
        }

        @media (max-width: 992px){
          .job-layout{
            grid-template-columns:1fr;
          }
        }

        @media (max-width: 768px){
          h1{
            font-size:1.4rem !important;
          }

          .job-layout{
            gap:1rem;
          }
        }
      `}</style>

    </div>
  );

  if (!job) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>❌</div>
        <p>Job not found</p>
        <Link href="/jobs">
          <button style={{ marginTop: '1rem', background: 'var(--accent)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>
            Back to Jobs
          </button>
        </Link>
      </div>

      <style jsx>{`
        .job-layout{
          display:grid;
          grid-template-columns:1fr 340px;
          gap:2rem;
        }

        @media (max-width: 992px){
          .job-layout{
            grid-template-columns:1fr;
          }
        }

        @media (max-width: 768px){
          h1{
            font-size:1.4rem !important;
          }

          .job-layout{
            gap:1rem;
          }
        }
      `}</style>

    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* NAVBAR */}
      <Navbar />
      <div style={{ paddingTop: '80px', padding: '80px 5% 3rem' }}>
        <div className='job-layout' style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* LEFT */}
          <div>
            <div style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem',
            }}>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span style={{
                  background: 'rgba(108,99,255,0.1)', color: 'var(--accent)',
                  border: '1px solid rgba(108,99,255,0.3)',
                  borderRadius: '6px', padding: '3px 12px', fontSize: '0.78rem',
                }}>{job.budget_type}</span>
                <span style={{
                  background: 'rgba(0,212,170,0.1)', color: 'var(--green)',
                  border: '1px solid rgba(0,212,170,0.3)',
                  borderRadius: '6px', padding: '3px 12px', fontSize: '0.78rem',
                }}>{job.level}</span>
                <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>📁 {job.category}</span>
              </div>

              <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)', marginBottom: '1.5rem' }}>
                {job.title}
              </h1>

              <div style={{ color: 'var(--muted)', lineHeight: 1.8, fontSize: '0.92rem', whiteSpace: 'pre-line', marginBottom: '1.5rem' }}>
                {job.description}
              </div>

              <h3 style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: '0.75rem' }}>Skills Required</h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {(job.skills || []).map((skill: string) => (
                  <span key={skill} style={{
                    background: 'rgba(108,99,255,0.08)',
                    border: '1px solid rgba(108,99,255,0.2)',
                    borderRadius: '6px', padding: '5px 14px',
                    fontSize: '0.82rem', color: 'var(--accent)',
                  }}>{skill}</span>
                ))}
              </div>
            </div>

            {/* PROPOSAL SECTION */}
            <div style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: '16px', padding: '2rem',
            }}>
              <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.2rem', marginBottom: '1.5rem' }}>
                📨 Submit Your Proposal
              </h2>

              {/* NOT LOGGED IN */}
              {authChecked && !isLoggedIn && (
                <div style={{
                  textAlign: 'center', padding: '2rem',
                  background: 'rgba(108,99,255,0.08)',
                  border: '1px solid rgba(108,99,255,0.2)',
                  borderRadius: '12px',
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
                  <h3 style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: '0.75rem' }}>
                    Login Required
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                    You need an account to submit proposals and use bids. Join free today!
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/login">
                      <button style={{
                        background: 'var(--accent)', color: '#fff',
                        border: 'none', padding: '12px 28px',
                        borderRadius: '8px', cursor: 'pointer',
                        fontFamily: 'Syne', fontWeight: 600, fontSize: '0.95rem',
                      }}>Login</button>
                    </Link>
                    <Link href="/signup">
                      <button style={{
                        background: 'transparent', color: 'var(--text)',
                        border: '1px solid var(--border)', padding: '12px 28px',
                        borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem',
                      }}>Sign Up Free</button>
                    </Link>
                  </div>
                </div>
              )}

              {/* LOGGED IN - SUBMITTED */}
              {authChecked && isLoggedIn && submitted && (
                <div style={{
                  textAlign: 'center', padding: '2rem',
                  background: 'rgba(0,212,170,0.08)',
                  border: '1px solid rgba(0,212,170,0.2)',
                  borderRadius: '12px',
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                  <h3 style={{ fontFamily: 'Syne', fontWeight: 700, color: 'var(--green)', marginBottom: '0.5rem' }}>
                    Proposal Submitted!
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                    The client will review your proposal soon.
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem' }}>
                    <Link href="/jobs">
                      <button style={{
                        background: 'var(--accent)', color: '#fff',
                        border: 'none', padding: '10px 24px',
                        borderRadius: '8px', cursor: 'pointer',
                        fontFamily: 'Syne', fontWeight: 600,
                      }}>Browse More Jobs</button>
                    </Link>
                    <Link href="/dashboard">
                      <button style={{
                        background: 'transparent', color: 'var(--text)',
                        border: '1px solid var(--border)', padding: '10px 24px',
                        borderRadius: '8px', cursor: 'pointer',
                      }}>My Dashboard</button>
                    </Link>
                  </div>
                </div>
              )}

              {/* LOGGED IN - FORM */}
              {authChecked && isLoggedIn && !submitted && (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '0.4rem' }}>
                      Your Bid Amount (USD)
                    </label>
                    <input
                      type="number"
                      placeholder="Enter your bid e.g. 750"
                      value={bidAmount}
                      onChange={e => setBidAmount(e.target.value)}
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

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '0.4rem' }}>
                      Cover Letter
                    </label>
                    <textarea
                      placeholder="Introduce yourself and explain why you are the best fit..."
                      value={proposal}
                      onChange={e => setProposal(e.target.value)}
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

                  <button onClick={handleSubmit} disabled={submitting} style={{
                    width: '100%', padding: '14px',
                    background: submitting ? 'var(--border)' : 'var(--accent)',
                    border: 'none', borderRadius: '10px', color: '#fff',
                    fontFamily: 'Syne', fontWeight: 600, fontSize: '1rem',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                  }}>
                    {submitting ? 'Submitting...' : 'Submit Proposal →'}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div>
            <div style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: '16px', padding: '1.5rem',
              position: 'sticky', top: '80px',
            }}>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: '1.25rem' }}>Job Details</h3>
              {[
                { label: 'Budget', value: job.budget_type === 'Fixed' ? `$${job.budget_min} - $${job.budget_max}` : `$${job.budget_min}/hr`, color: 'var(--green)' },
                { label: 'Type', value: job.budget_type, color: 'var(--text)' },
                { label: 'Duration', value: job.duration, color: 'var(--text)' },
                { label: 'Level', value: job.level, color: 'var(--text)' },
                { label: 'Status', value: job.status, color: 'var(--green)' },
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '0.6rem 0', borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{item.label}</span>
                  <span style={{ color: item.color, fontWeight: 600, fontSize: '0.85rem' }}>{item.value}</span>
                </div>
              ))}

              {!isLoggedIn && (
                <Link href="/signup" style={{ textDecoration: 'none' }}>
                  <button style={{
                    width: '100%', padding: '12px', marginTop: '1.5rem',
                    background: 'var(--accent)', border: 'none',
                    borderRadius: '10px', color: '#fff',
                    fontFamily: 'Syne', fontWeight: 600,
                    cursor: 'pointer', fontSize: '0.9rem',
                  }}>Sign Up to Apply →</button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .job-layout{
          display:grid;
          grid-template-columns:1fr 340px;
          gap:2rem;
        }

        @media (max-width: 992px){
          .job-layout{
            grid-template-columns:1fr;
          }
        }

        @media (max-width: 768px){
          h1{
            font-size:1.4rem !important;
          }

          .job-layout{
            gap:1rem;
          }
        }
      `}</style>

    </div>
  );
}
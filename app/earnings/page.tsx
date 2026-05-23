'use client';
import { useState } from 'react';
import Link from 'next/link';

const stats = [
  { label: 'Total Earned', value: '$12,400', icon: '💰', change: '+$800 this month' },
  { label: 'Available Balance', value: '$2,840', icon: '🏦', change: 'Ready to withdraw' },
  { label: 'Pending', value: '$1,200', icon: '⏳', change: 'In escrow' },
  { label: 'This Month', value: '$800', icon: '📈', change: '+23% vs last month' },
];

const transactions = [
  { id: 'TXN001', project: 'E-commerce Website', client: 'Ahmed Store', amount: '+$800', date: 'May 18, 2026', status: 'Completed', type: 'credit' },
  { id: 'TXN002', project: 'Withdrawal to JazzCash', client: '—', amount: '-$500', date: 'May 15, 2026', status: 'Completed', type: 'debit' },
  { id: 'TXN003', project: 'Mobile App UI', client: 'TechPak Ltd', amount: '+$500', date: 'May 10, 2026', status: 'Completed', type: 'credit' },
  { id: 'TXN004', project: 'AI Chatbot', client: 'Hassan Co', amount: '+$1,200', date: 'May 5, 2026', status: 'Pending', type: 'credit' },
  { id: 'TXN005', project: 'Withdrawal to EasyPaisa', client: '—', amount: '-$300', date: 'Apr 28, 2026', status: 'Completed', type: 'debit' },
  { id: 'TXN006', project: 'SEO Optimization', client: 'Blog Pro', amount: '+$200', date: 'Apr 20, 2026', status: 'Completed', type: 'credit' },
  { id: 'TXN007', project: 'React Dashboard', client: 'StartupX', amount: '+$600', date: 'Apr 10, 2026', status: 'Completed', type: 'credit' },
];

const monthlyData = [
  { month: 'Jan', amount: 400 },
  { month: 'Feb', amount: 650 },
  { month: 'Mar', amount: 500 },
  { month: 'Apr', amount: 900 },
  { month: 'May', amount: 800 },
];

const maxAmount = Math.max(...monthlyData.map(d => d.amount));

export default function Earnings() {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('');
  const [withdrawn, setWithdrawn] = useState(false);
  const [filter, setFilter] = useState('All');

  const filtered = transactions.filter(t => {
    if (filter === 'Credits') return t.type === 'credit';
    if (filter === 'Withdrawals') return t.type === 'debit';
    return true;
  });

  const handleWithdraw = () => {
    if (withdrawAmount && withdrawMethod) setWithdrawn(true);
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

        <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem',
            }}>A</div>
            <div>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.9rem' }}>Ali Hassan</div>
              <div style={{ color: 'var(--green)', fontSize: '0.75rem' }}>● Online</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          {[
            { id: 'overview', icon: '📊', label: 'Overview', href: '/dashboard' },
            { id: 'projects', icon: '🚀', label: 'My Projects', href: '/dashboard' },
            { id: 'proposals', icon: '📨', label: 'Proposals', href: '/dashboard' },
            { id: 'messages', icon: '💬', label: 'Messages', href: '/messages' },
            { id: 'earnings', icon: '💰', label: 'Earnings', href: '/earnings' },
            { id: 'profile', icon: '👤', label: 'My Profile', href: '/developers/1' },
          ].map(item => (
            <Link key={item.id} href={item.href} style={{ textDecoration: 'none' }}>
              <button style={{
                width: '100%', padding: '0.75rem 1.5rem',
                background: item.id === 'earnings' ? 'rgba(108,99,255,0.12)' : 'transparent',
                border: 'none',
                borderLeft: item.id === 'earnings' ? '3px solid var(--accent)' : '3px solid transparent',
                color: item.id === 'earnings' ? 'var(--accent)' : 'var(--muted)',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                cursor: 'pointer', fontSize: '0.9rem',
                textAlign: 'left', transition: 'all 0.2s',
              }}>
                <span>{item.icon}</span> {item.label}
              </button>
            </Link>
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
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', marginBottom: '0.25rem' }}>
            Earnings 💰
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Track your income and withdraw funds</p>
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
              <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{s.icon}</div>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', marginBottom: '0.25rem' }}>
                {s.value}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{s.label}</div>
              <div style={{ color: 'var(--green)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{s.change}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', marginBottom: '1.5rem' }}>

          {/* Chart */}
          <div style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '1.5rem',
          }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', marginBottom: '1.5rem' }}>
              📈 Monthly Earnings
            </h2>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', height: '160px', padding: '0 1rem' }}>
              {monthlyData.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ color: 'var(--green)', fontSize: '0.72rem', fontWeight: 600 }}>${d.amount}</div>
                  <div style={{
                    width: '100%',
                    height: `${(d.amount / maxAmount) * 120}px`,
                    background: i === monthlyData.length - 1
                      ? 'linear-gradient(180deg, var(--accent), var(--accent2))'
                      : 'rgba(108,99,255,0.3)',
                    borderRadius: '6px 6px 0 0',
                    transition: 'height 0.3s',
                  }} />
                  <div style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{d.month}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Withdraw */}
          <div style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '1.5rem',
          }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>
              🏦 Withdraw Funds
            </h2>

            {withdrawn ? (
              <div style={{
                textAlign: 'center', padding: '1.5rem',
                background: 'rgba(0,212,170,0.08)',
                border: '1px solid rgba(0,212,170,0.2)',
                borderRadius: '12px',
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✅</div>
                <div style={{ fontFamily: 'Syne', fontWeight: 700, color: 'var(--green)', marginBottom: '0.5rem' }}>
                  Withdrawal Requested!
                </div>
                <div style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
                  ${withdrawAmount} will be sent to {withdrawMethod} within 24 hours.
                </div>
                <button onClick={() => { setWithdrawn(false); setWithdrawAmount(''); setWithdrawMethod(''); }} style={{
                  marginTop: '1rem', background: 'transparent',
                  border: '1px solid var(--border)', color: 'var(--muted)',
                  padding: '8px 16px', borderRadius: '8px',
                  cursor: 'pointer', fontSize: '0.82rem',
                }}>New Withdrawal</button>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{
                    background: 'rgba(0,212,170,0.08)',
                    border: '1px solid rgba(0,212,170,0.2)',
                    borderRadius: '10px', padding: '1rem',
                    marginBottom: '1rem',
                  }}>
                    <div style={{ color: 'var(--muted)', fontSize: '0.78rem', marginBottom: '0.25rem' }}>Available Balance</div>
                    <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.5rem', color: 'var(--green)' }}>$2,840</div>
                  </div>

                  <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '0.4rem' }}>
                    Amount to Withdraw ($)
                  </label>
                  <input
                    type="number" placeholder="e.g. 500"
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(e.target.value)}
                    style={{
                      width: '100%', padding: '11px 14px',
                      background: 'var(--bg)', border: '1px solid var(--border)',
                      borderRadius: '8px', color: 'var(--text)',
                      fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
                      marginBottom: '1rem',
                    }}
                    onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--accent)'}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'}
                  />

                  <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '0.5rem' }}>
                    Withdrawal Method
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {['JazzCash', 'EasyPaisa', 'Bank Transfer'].map(method => (
                      <button key={method} onClick={() => setWithdrawMethod(method)} style={{
                        padding: '10px',
                        background: withdrawMethod === method ? 'rgba(108,99,255,0.1)' : 'transparent',
                        border: `1px solid ${withdrawMethod === method ? 'var(--accent)' : 'var(--border)'}`,
                        borderRadius: '8px',
                        color: withdrawMethod === method ? 'var(--accent)' : 'var(--muted)',
                        cursor: 'pointer', fontSize: '0.85rem',
                        transition: 'all 0.2s', textAlign: 'left',
                      }}>
                        {method === 'JazzCash' ? '📱' : method === 'EasyPaisa' ? '💚' : '🏦'} {method}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={handleWithdraw} style={{
                  width: '100%', padding: '13px',
                  background: withdrawAmount && withdrawMethod ? 'var(--accent)' : 'var(--border)',
                  border: 'none', borderRadius: '10px', color: '#fff',
                  fontFamily: 'Syne', fontWeight: 600, fontSize: '0.95rem',
                  cursor: withdrawAmount && withdrawMethod ? 'pointer' : 'not-allowed',
                }}>
                  Withdraw Funds →
                </button>
              </>
            )}
          </div>
        </div>

        {/* Transactions */}
        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '1.5rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem' }}>
              📋 Transaction History
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['All', 'Credits', 'Withdrawals'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: '5px 14px',
                  background: filter === f ? 'rgba(108,99,255,0.15)' : 'transparent',
                  border: `1px solid ${filter === f ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: '100px',
                  color: filter === f ? 'var(--accent)' : 'var(--muted)',
                  cursor: 'pointer', fontSize: '0.8rem',
                }}>{f}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filtered.map((t, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '1rem', background: 'var(--bg)',
                borderRadius: '10px', border: '1px solid var(--border)',
                flexWrap: 'wrap', gap: '0.5rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: t.type === 'credit' ? 'rgba(0,212,170,0.1)' : 'rgba(255,101,132,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem',
                  }}>{t.type === 'credit' ? '⬇️' : '⬆️'}</div>
                  <div>
                    <div style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '0.88rem' }}>{t.project}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.76rem' }}>{t.id} · {t.date}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{
                    background: t.status === 'Completed' ? 'rgba(0,212,170,0.1)' : 'rgba(108,99,255,0.1)',
                    color: t.status === 'Completed' ? 'var(--green)' : 'var(--accent)',
                    border: `1px solid ${t.status === 'Completed' ? 'rgba(0,212,170,0.3)' : 'rgba(108,99,255,0.3)'}`,
                    borderRadius: '6px', padding: '2px 10px', fontSize: '0.75rem',
                  }}>{t.status}</span>
                  <span style={{
                    fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem',
                    color: t.type === 'credit' ? 'var(--green)' : 'var(--accent2)',
                  }}>{t.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
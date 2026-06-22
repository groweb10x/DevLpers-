'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function LoanEMICalculator() {
  const [principal, setPrincipal] = useState('500000');
  const [rate, setRate] = useState('10');
  const [tenure, setTenure] = useState('5');

  const getEMI = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 12 / 100;
    const n = parseFloat(tenure) * 12;

    if (isNaN(p) || isNaN(r) || isNaN(n) || n === 0) return { emi: 0, totalInterest: 0, totalPayment: 0 };

    if (r === 0) {
      const emi = p / n;
      return { emi, totalInterest: 0, totalPayment: p };
    }

    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;

    return { emi, totalInterest, totalPayment };
  };

  const { emi, totalInterest, totalPayment } = getEMI();
  const principalNum = parseFloat(principal) || 0;
  const interestPercent = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  const inputStyle = {
    width: '100%', padding: '12px 14px',
    border: '1px solid #e4e5e7', borderRadius: '6px',
    fontSize: '1rem', outline: 'none', color: '#404145',
    boxSizing: 'border-box' as const,
  };

  const labelStyle = {
    display: 'block', color: '#62646a', fontSize: '0.85rem',
    fontWeight: 500, marginBottom: '0.4rem',
  };

  const formatCurrency = (num: number) => {
    return '$' + num.toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <Navbar />

      <div style={{ paddingTop: '64px' }}>

        {/* HEADER */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e4e5e7', padding: '2rem 5%' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <nav style={{ marginBottom: '0.75rem' }}>
              <Link href="/tools" style={{ color: '#1dbf73', fontSize: '0.85rem', textDecoration: 'none' }}>← Back to Tools</Link>
            </nav>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', color: '#404145', marginBottom: '0.5rem' }}>
              🏦 Loan EMI Calculator
            </h1>
            <p style={{ color: '#62646a', fontSize: '0.92rem' }}>
              Calculate your monthly EMI for home, car or personal loans.
            </p>
          </div>
        </div>

        <div style={{ padding: '2.5rem 5%', maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '2rem' }}>

            {/* Inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Loan Amount ($)</label>
                <input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} style={inputStyle}
                  onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                  onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
                />
                <input type="range" min="1000" max="2000000" step="1000" value={principal} onChange={e => setPrincipal(e.target.value)}
                  style={{ width: '100%', marginTop: '0.5rem', accentColor: '#1dbf73' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Interest Rate (% per year)</label>
                  <input type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value)} style={inputStyle}
                    onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Loan Tenure (years)</label>
                  <input type="number" value={tenure} onChange={e => setTenure(e.target.value)} style={inputStyle}
                    onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
                  />
                </div>
              </div>
            </div>

            {/* Result */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '1.5rem', textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ color: '#62646a', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Monthly EMI</div>
              <div style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '2.25rem', color: '#1dbf73' }}>
                {formatCurrency(emi)}
              </div>
            </div>

            {/* Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Principal', value: formatCurrency(principalNum), color: '#3b82f6' },
                { label: 'Total Interest', value: formatCurrency(totalInterest), color: '#f59e0b' },
                { label: 'Total Payment', value: formatCurrency(totalPayment), color: '#404145' },
              ].map(item => (
                <div key={item.label} style={{ background: '#fafafa', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
                  <div style={{ color: '#95979d', fontSize: '0.75rem', marginBottom: '0.3rem' }}>{item.label}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: item.color }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Bar visualization */}
            <div>
              <div style={{ display: 'flex', borderRadius: '100px', overflow: 'hidden', height: '10px' }}>
                <div style={{ width: `${100 - interestPercent}%`, background: '#3b82f6' }} />
                <div style={{ width: `${interestPercent}%`, background: '#f59e0b' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.78rem', color: '#62646a' }}>
                <span>🔵 Principal ({(100 - interestPercent).toFixed(0)}%)</span>
                <span>🟡 Interest ({interestPercent.toFixed(0)}%)</span>
              </div>
            </div>
          </div>

          {/* RELATED TOOLS */}
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#404145', marginBottom: '1rem' }}>More Calculator Tools</h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { name: 'Unit Converter', slug: 'unit-converter', icon: '📏' },
                { name: 'BMI Calculator', slug: 'bmi-calculator', icon: '⚖️' },
                { name: 'Percentage Calculator', slug: 'percentage-calculator', icon: '🔢' },
              ].map(t => (
                <a key={t.slug} href={`/tools/${t.slug}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px',
                    padding: '0.6rem 1rem', fontSize: '0.85rem', color: '#62646a',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                  }}>{t.icon} {t.name}</div>
                </a>
              ))}
            </div>
          </div>

          {/* CREDIT */}
          <div style={{ marginTop: '2rem', textAlign: 'center', padding: '1.5rem', background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px' }}>
            <p style={{ color: '#62646a', fontSize: '0.85rem' }}>
              Built by <strong style={{ color: '#404145' }}>Dev Zeeshan</strong> on{' '}
              <Link href="/" style={{ color: '#1dbf73', textDecoration: 'none', fontWeight: 600 }}>DevLpers</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
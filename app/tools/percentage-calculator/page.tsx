'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

export default function PercentageCalculator() {
  // Calc 1: X% of Y
  const [percent1, setPercent1] = useState('20');
  const [number1, setNumber1] = useState('150');

  // Calc 2: X is what % of Y
  const [number2a, setNumber2a] = useState('30');
  const [number2b, setNumber2b] = useState('120');

  // Calc 3: Percentage increase/decrease
  const [number3a, setNumber3a] = useState('100');
  const [number3b, setNumber3b] = useState('150');

  const result1 = (() => {
    const p = parseFloat(percent1);
    const n = parseFloat(number1);
    if (isNaN(p) || isNaN(n)) return '0';
    return ((p / 100) * n).toFixed(2);
  })();

  const result2 = (() => {
    const a = parseFloat(number2a);
    const b = parseFloat(number2b);
    if (isNaN(a) || isNaN(b) || b === 0) return '0';
    return ((a / b) * 100).toFixed(2);
  })();

  const result3 = (() => {
    const a = parseFloat(number3a);
    const b = parseFloat(number3b);
    if (isNaN(a) || isNaN(b) || a === 0) return { value: '0', type: 'increase' };
    const change = ((b - a) / a) * 100;
    return { value: Math.abs(change).toFixed(2), type: change >= 0 ? 'increase' : 'decrease' };
  })();

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
              🔢 Percentage Calculator
            </h1>
            <p style={{ color: '#62646a', fontSize: '0.92rem' }}>
              Three quick ways to calculate percentages instantly.
            </p>
          </div>
        </div>

        <div style={{ padding: '2.5rem 5%', maxWidth: '700px', margin: '0 auto' }}>

          {/* CALC 1: X% of Y */}
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#404145', marginBottom: '1.25rem' }}>
              What is X% of Y?
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              <div style={{ flex: 1, minWidth: '100px' }}>
                <label style={labelStyle}>Percentage</label>
                <input type="number" value={percent1} onChange={e => setPercent1(e.target.value)} style={inputStyle}
                  onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                  onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
                />
              </div>
              <span style={{ color: '#95979d', marginTop: '1.2rem' }}>% of</span>
              <div style={{ flex: 1, minWidth: '100px' }}>
                <label style={labelStyle}>Number</label>
                <input type="number" value={number1} onChange={e => setNumber1(e.target.value)} style={inputStyle}
                  onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                  onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
                />
              </div>
            </div>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
              <span style={{ color: '#62646a', fontSize: '0.9rem' }}>{percent1 || '0'}% of {number1 || '0'} = </span>
              <strong style={{ color: '#1dbf73', fontSize: '1.2rem' }}>{result1}</strong>
            </div>
          </div>

          {/* CALC 2: X is what % of Y */}
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#404145', marginBottom: '1.25rem' }}>
              X is what % of Y?
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              <div style={{ flex: 1, minWidth: '100px' }}>
                <label style={labelStyle}>Value</label>
                <input type="number" value={number2a} onChange={e => setNumber2a(e.target.value)} style={inputStyle}
                  onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                  onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
                />
              </div>
              <span style={{ color: '#95979d', marginTop: '1.2rem' }}>is % of</span>
              <div style={{ flex: 1, minWidth: '100px' }}>
                <label style={labelStyle}>Total</label>
                <input type="number" value={number2b} onChange={e => setNumber2b(e.target.value)} style={inputStyle}
                  onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                  onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
                />
              </div>
            </div>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
              <span style={{ color: '#62646a', fontSize: '0.9rem' }}>{number2a || '0'} is </span>
              <strong style={{ color: '#1dbf73', fontSize: '1.2rem' }}>{result2}%</strong>
              <span style={{ color: '#62646a', fontSize: '0.9rem' }}> of {number2b || '0'}</span>
            </div>
          </div>

          {/* CALC 3: Percentage Change */}
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '2rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#404145', marginBottom: '1.25rem' }}>
              Percentage Increase / Decrease
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              <div style={{ flex: 1, minWidth: '100px' }}>
                <label style={labelStyle}>From</label>
                <input type="number" value={number3a} onChange={e => setNumber3a(e.target.value)} style={inputStyle}
                  onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                  onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
                />
              </div>
              <span style={{ color: '#95979d', marginTop: '1.2rem' }}>→</span>
              <div style={{ flex: 1, minWidth: '100px' }}>
                <label style={labelStyle}>To</label>
                <input type="number" value={number3b} onChange={e => setNumber3b(e.target.value)} style={inputStyle}
                  onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                  onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
                />
              </div>
            </div>
            <div style={{
              background: result3.type === 'increase' ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${result3.type === 'increase' ? '#bbf7d0' : '#fecaca'}`,
              borderRadius: '8px', padding: '1rem', textAlign: 'center',
            }}>
              <span style={{ color: '#62646a', fontSize: '0.9rem' }}>
                {result3.type === 'increase' ? '📈 Increase of' : '📉 Decrease of'}{' '}
              </span>
              <strong style={{ color: result3.type === 'increase' ? '#1dbf73' : '#dc2626', fontSize: '1.2rem' }}>
                {result3.value}%
              </strong>
            </div>
          </div>

          {/* RELATED TOOLS */}
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#404145', marginBottom: '1rem' }}>More Calculator Tools</h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { name: 'Unit Converter', slug: 'unit-converter', icon: '📏' },
                { name: 'BMI Calculator', slug: 'bmi-calculator', icon: '⚖️' },
                { name: 'Loan EMI Calculator', slug: 'loan-emi-calculator', icon: '🏦' },
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
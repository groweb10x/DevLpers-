'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function BMICalculator() {
  const [unit, setUnit] = useState('metric');
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('170');
  const [feet, setFeet] = useState('5');
  const [inches, setInches] = useState('7');
  const [weightLbs, setWeightLbs] = useState('154');

  const getBMI = () => {
    if (unit === 'metric') {
      const w = parseFloat(weight);
      const h = parseFloat(height) / 100;
      if (isNaN(w) || isNaN(h) || h === 0) return 0;
      return w / (h * h);
    } else {
      const w = parseFloat(weightLbs);
      const f = parseFloat(feet);
      const i = parseFloat(inches);
      if (isNaN(w) || isNaN(f) || isNaN(i)) return 0;
      const totalInches = (f * 12) + i;
      if (totalInches === 0) return 0;
      return (w / (totalInches * totalInches)) * 703;
    }
  };

  const bmi = getBMI();

  const getCategory = (bmiValue: number) => {
    if (bmiValue === 0) return { label: '—', color: '#95979d', bg: '#fafafa', border: '#e4e5e7' };
    if (bmiValue < 18.5) return { label: 'Underweight', color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' };
    if (bmiValue < 25) return { label: 'Normal Weight', color: '#1dbf73', bg: '#f0fdf4', border: '#bbf7d0' };
    if (bmiValue < 30) return { label: 'Overweight', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' };
    return { label: 'Obese', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' };
  };

  const category = getCategory(bmi);

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
              ⚖️ BMI Calculator
            </h1>
            <p style={{ color: '#62646a', fontSize: '0.92rem' }}>
              Calculate your Body Mass Index and find your health category.
            </p>
          </div>
        </div>

        <div style={{ padding: '2.5rem 5%', maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '2rem' }}>

            {/* Unit Toggle */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem' }}>
              {[
                { value: 'metric', label: 'Metric (kg/cm)' },
                { value: 'imperial', label: 'Imperial (lb/ft)' },
              ].map(u => (
                <button key={u.value} onClick={() => setUnit(u.value)} style={{
                  flex: 1, padding: '9px',
                  background: unit === u.value ? '#1dbf73' : '#fff',
                  border: `1px solid ${unit === u.value ? '#1dbf73' : '#e4e5e7'}`,
                  borderRadius: '6px',
                  color: unit === u.value ? '#fff' : '#62646a',
                  cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                }}>{u.label}</button>
              ))}
            </div>

            {unit === 'metric' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={labelStyle}>Weight (kg)</label>
                  <input type="number" value={weight} onChange={e => setWeight(e.target.value)} style={inputStyle}
                    onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Height (cm)</label>
                  <input type="number" value={height} onChange={e => setHeight(e.target.value)} style={inputStyle}
                    onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
                  />
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={labelStyle}>Weight (lb)</label>
                  <input type="number" value={weightLbs} onChange={e => setWeightLbs(e.target.value)} style={inputStyle}
                    onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Height (ft)</label>
                  <input type="number" value={feet} onChange={e => setFeet(e.target.value)} style={inputStyle}
                    onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Height (in)</label>
                  <input type="number" value={inches} onChange={e => setInches(e.target.value)} style={inputStyle}
                    onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
                  />
                </div>
              </div>
            )}

            {/* Result */}
            <div style={{
              background: category.bg, border: `1px solid ${category.border}`,
              borderRadius: '10px', padding: '1.5rem', textAlign: 'center',
            }}>
              <div style={{ color: '#62646a', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Your BMI</div>
              <div style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '2.5rem', color: category.color, marginBottom: '0.5rem' }}>
                {bmi > 0 ? bmi.toFixed(1) : '—'}
              </div>
              <div style={{
                display: 'inline-block', background: '#fff',
                border: `1px solid ${category.border}`,
                borderRadius: '100px', padding: '4px 16px',
                fontSize: '0.85rem', fontWeight: 600, color: category.color,
              }}>{category.label}</div>
            </div>

            {/* BMI Scale */}
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', borderRadius: '100px', overflow: 'hidden', height: '8px' }}>
                <div style={{ flex: 1, background: '#3b82f6' }} />
                <div style={{ flex: 1, background: '#1dbf73' }} />
                <div style={{ flex: 1, background: '#f59e0b' }} />
                <div style={{ flex: 1, background: '#dc2626' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.72rem', color: '#95979d' }}>
                <span>Underweight</span>
                <span>Normal</span>
                <span>Overweight</span>
                <span>Obese</span>
              </div>
            </div>
          </div>

          {/* RELATED TOOLS */}
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#404145', marginBottom: '1rem' }}>More Calculator Tools</h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { name: 'Unit Converter', slug: 'unit-converter', icon: '📏' },
                { name: 'Loan EMI Calculator', slug: 'loan-emi-calculator', icon: '🏦' },
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
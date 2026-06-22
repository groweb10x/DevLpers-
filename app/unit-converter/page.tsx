'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

const unitCategories: Record<string, { label: string; units: Record<string, number> }> = {
  length: {
    label: 'Length',
    units: { Meters: 1, Kilometers: 1000, Centimeters: 0.01, Miles: 1609.34, Yards: 0.9144, Feet: 0.3048, Inches: 0.0254 },
  },
  weight: {
    label: 'Weight',
    units: { Kilograms: 1, Grams: 0.001, Pounds: 0.453592, Ounces: 0.0283495, Tons: 1000 },
  },
  temperature: {
    label: 'Temperature',
    units: { Celsius: 1, Fahrenheit: 1, Kelvin: 1 },
  },
};

export default function UnitConverter() {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('Meters');
  const [toUnit, setToUnit] = useState('Feet');
  const [inputValue, setInputValue] = useState('1');

  const convertTemperature = (value: number, from: string, to: string) => {
    let celsius = value;
    if (from === 'Fahrenheit') celsius = (value - 32) * 5 / 9;
    if (from === 'Kelvin') celsius = value - 273.15;

    if (to === 'Celsius') return celsius;
    if (to === 'Fahrenheit') return (celsius * 9 / 5) + 32;
    if (to === 'Kelvin') return celsius + 273.15;
    return celsius;
  };

  const getResult = () => {
    const num = parseFloat(inputValue);
    if (isNaN(num)) return '0';

    if (category === 'temperature') {
      return convertTemperature(num, fromUnit, toUnit).toFixed(2);
    }

    const units = unitCategories[category].units;
    const baseValue = num * units[fromUnit];
    const result = baseValue / units[toUnit];
    return result.toFixed(4).replace(/\.?0+$/, '');
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    const firstUnits = Object.keys(unitCategories[cat].units);
    setFromUnit(firstUnits[0]);
    setToUnit(firstUnits[1] || firstUnits[0]);
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
              📏 Unit Converter
            </h1>
            <p style={{ color: '#62646a', fontSize: '0.92rem' }}>
              Convert between length, weight and temperature units instantly.
            </p>
          </div>
        </div>

        {/* CONVERTER CARD */}
        <div style={{ padding: '2.5rem 5%', maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '2rem' }}>

            {/* Category Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
              {Object.keys(unitCategories).map(cat => (
                <button key={cat} onClick={() => handleCategoryChange(cat)} style={{
                  padding: '8px 18px',
                  background: category === cat ? '#1dbf73' : '#fff',
                  border: `1px solid ${category === cat ? '#1dbf73' : '#e4e5e7'}`,
                  borderRadius: '100px',
                  color: category === cat ? '#fff' : '#62646a',
                  cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                }}>{unitCategories[cat].label}</button>
              ))}
            </div>

            {/* From */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', color: '#62646a', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem' }}>From</label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  type="number"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  style={{ flex: 1, padding: '12px 14px', border: '1px solid #e4e5e7', borderRadius: '6px', fontSize: '1rem', outline: 'none', color: '#404145' }}
                  onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                  onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
                />
                <select value={fromUnit} onChange={e => setFromUnit(e.target.value)} style={{
                  padding: '12px 14px', border: '1px solid #e4e5e7', borderRadius: '6px',
                  fontSize: '0.9rem', color: '#404145', background: '#fff', minWidth: '140px', cursor: 'pointer',
                }}>
                  {Object.keys(unitCategories[category].units).map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <button onClick={() => { setFromUnit(toUnit); setToUnit(fromUnit); }} style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: '#f0fdf4', border: '1px solid #bbf7d0',
                color: '#1dbf73', cursor: 'pointer', fontSize: '1.1rem',
              }}>⇅</button>
            </div>

            {/* To */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: '#62646a', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem' }}>To</label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  readOnly
                  value={getResult()}
                  style={{ flex: 1, padding: '12px 14px', border: '1px solid #bbf7d0', background: '#f0fdf4', borderRadius: '6px', fontSize: '1rem', color: '#1dbf73', fontWeight: 700, outline: 'none' }}
                />
                <select value={toUnit} onChange={e => setToUnit(e.target.value)} style={{
                  padding: '12px 14px', border: '1px solid #e4e5e7', borderRadius: '6px',
                  fontSize: '0.9rem', color: '#404145', background: '#fff', minWidth: '140px', cursor: 'pointer',
                }}>
                  {Object.keys(unitCategories[category].units).map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div style={{ background: '#fafafa', borderRadius: '8px', padding: '1rem', textAlign: 'center', color: '#62646a', fontSize: '0.9rem' }}>
              <strong style={{ color: '#404145' }}>{inputValue || '0'} {fromUnit}</strong> = <strong style={{ color: '#1dbf73' }}>{getResult()} {toUnit}</strong>
            </div>
          </div>

          {/* RELATED TOOLS */}
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#404145', marginBottom: '1rem' }}>More Calculator Tools</h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { name: 'BMI Calculator', slug: 'bmi-calculator', icon: '⚖️' },
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
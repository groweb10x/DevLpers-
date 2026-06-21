import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export const metadata: Metadata = {
  title: 'Free Online Tools — DevLpers',
  description: 'Free online tools built by developers: calculators, converters, and utilities. Fast, accurate, no signup required.',
  keywords: 'free online tools, calculator, unit converter, bmi calculator, loan emi calculator, percentage calculator, developer tools',
  alternates: { canonical: 'https://develpers.com/tools' },
};

const calculatorTools = [
  { icon: '📏', name: 'Unit Converter', slug: 'unit-converter', desc: 'Convert length, weight, temperature and more instantly', badge: 'Popular' },
  { icon: '⚖️', name: 'BMI Calculator', slug: 'bmi-calculator', desc: 'Calculate your Body Mass Index and health category', badge: 'Health' },
  { icon: '🏦', name: 'Loan EMI Calculator', slug: 'loan-emi-calculator', desc: 'Calculate monthly EMI for home, car or personal loans', badge: 'Finance' },
  { icon: '🔢', name: 'Percentage Calculator', slug: 'percentage-calculator', desc: 'Quick percentage calculations for any number', badge: 'Math' },
];

function ToolGrid({ tools }: { tools: typeof calculatorTools }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
      {tools.map(function (tool) {
        return (
          <a key={tool.slug} href={'/tools/' + tool.slug} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '1.75rem', height: '100%', boxSizing: 'border-box', transition: 'all 0.2s', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', position: 'relative' }}>
              <span style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#f0fdf4', color: '#1dbf73', border: '1px solid #bbf7d0', borderRadius: '100px', padding: '2px 10px', fontSize: '0.7rem', fontWeight: 600 }}>
                {tool.badge}
              </span>
              <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>{tool.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#404145', marginBottom: '0.5rem' }}>
                {tool.name}
              </h3>
              <p style={{ color: '#62646a', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                {tool.desc}
              </p>
              <span style={{ color: '#1dbf73', fontWeight: 600, fontSize: '0.85rem' }}>
                Open Tool →
              </span>
            </div>
          </a>
        );
      })}
    </div>
  );
}

export default function ToolsHub() {
  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>

        {/* HEADER */}
        <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 60%)', borderBottom: '1px solid #e4e5e7', padding: '3rem 5%', textAlign: 'center' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ display: 'inline-block', background: '#e8fdf2', border: '1px solid #bbf7d0', borderRadius: '100px', padding: '4px 16px', fontSize: '0.82rem', color: '#1dbf73', fontWeight: 600, marginBottom: '1rem' }}>
              🧮 Free Tools
            </div>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', marginBottom: '0.75rem', color: '#404145' }}>
              Free Online Tools
            </h1>
            <p style={{ color: '#62646a', fontSize: '1rem', lineHeight: 1.7 }}>
              Fast, accurate online tools — built by developers on DevLpers. No signup, no ads, just results.
            </p>
          </div>
        </div>

        {/* DEV ZEESHAN CREDIT — TOP SECTION */}
        <div style={{ padding: '2rem 5% 0' }}>
          <div style={{
            maxWidth: '1000px', margin: '0 auto',
            background: '#fff', border: '1px solid #e4e5e7',
            borderRadius: '12px', padding: '1.5rem 2rem',
            display: 'flex', alignItems: 'center', gap: '1.25rem',
            flexWrap: 'wrap',
          }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: '#1dbf73', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '1.4rem', flexShrink: 0,
            }}>DZ</div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <p style={{ color: '#62646a', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                All tools below are built and maintained by
              </p>
              <p style={{ fontWeight: 700, color: '#404145', fontSize: '1.05rem' }}>
                Dev Zeeshan <span style={{ color: '#95979d', fontWeight: 400, fontSize: '0.85rem' }}>— Top-rated developer on DevLpers</span>
              </p>
            </div>
            <Link href="/developers" style={{ textDecoration: 'none' }}>
              <button style={{
                background: '#1dbf73', color: '#fff', border: 'none',
                padding: '9px 20px', borderRadius: '6px',
                fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', whiteSpace: 'nowrap',
              }}>Browse Developers →</button>
            </Link>
          </div>
        </div>

        {/* SECTION: CALCULATOR TOOLS */}
        <div style={{ padding: '3rem 5% 1rem', maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '1.3rem', color: '#404145', marginBottom: '0.4rem' }}>
            🧮 Calculator Tools
          </h2>
          <p style={{ color: '#95979d', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Quick math, finance and health calculators
          </p>
          <ToolGrid tools={calculatorTools} />
        </div>

        {/* FUTURE SECTIONS GO HERE — e.g. Developer Tools, Text Tools */}

      </div>
    </div>
  );
}
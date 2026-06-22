'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';

const calculatorTools = [
  { icon: '📏', name: 'Unit Converter', slug: '/unit-converter', desc: 'Convert length, weight, temperature and more instantly', badge: 'Popular' },
  { icon: '⚖️', name: 'BMI Calculator', slug: '/bmi-calculator', desc: 'Calculate your Body Mass Index and health category', badge: 'Health' },
  { icon: '🏦', name: 'Loan EMI Calculator', slug: '/loan-emi-calculator', desc: 'Calculate monthly EMI for home, car or personal loans', badge: 'Finance' },
  { icon: '🔢', name: 'Percentage Calculator', slug: '/percentage-calculator', desc: 'Quick percentage calculations for any number', badge: 'Math' },
];

const imageTools = [
  { icon: '🖼️', name: 'Image Format Converter', slug: '/image-format-converter', desc: 'Convert between PNG, JPG, WebP, BMP, GIF and AVIF in bulk', badge: 'Popular' },
  { icon: '🗜️', name: 'Image Compressor', slug: '/image-compressor', desc: 'Reduce image file size without losing visible quality', badge: 'Popular' },
  { icon: '📐', name: 'Image Resizer', slug: '/image-resizer', desc: 'Resize photos to any dimension or social media preset', badge: 'Design' },
  { icon: '🔖', name: 'Favicon Generator', slug: '/favicon-generator', desc: 'Create all favicon sizes from one image instantly', badge: 'Dev' },
];

function ToolCard({ icon, name, slug, desc, badge }: { icon: string; name: string; slug: string; desc: string; badge: string }) {
  return (
    <a href={slug} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: '#fff', border: '1px solid #e4e5e7',
          borderRadius: '12px', padding: '1.5rem',
          height: '100%', boxSizing: 'border-box',
          transition: 'all 0.2s', cursor: 'pointer',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5rem',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = '#1dbf73';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(29,191,115,0.12)';
          e.currentTarget.style.transform = 'translateY(-3px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#e4e5e7';
          e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <span style={{
          position: 'absolute', top: '1rem', right: '1rem',
          background: '#f0fdf4', color: '#1dbf73',
          border: '1px solid #bbf7d0', borderRadius: '100px',
          padding: '2px 10px', fontSize: '0.7rem', fontWeight: 600,
        }}>{badge}</span>
        <div style={{ fontSize: '2rem' }}>{icon}</div>
        <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#404145', margin: 0 }}>{name}</h3>
        <p style={{ color: '#62646a', fontSize: '0.82rem', lineHeight: 1.6, margin: 0, flex: 1 }}>{desc}</p>
        <span style={{ color: '#1dbf73', fontWeight: 600, fontSize: '0.82rem' }}>Open Tool →</span>
      </div>
    </a>
  );
}

export default function ToolsHub() {
  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>

        {/* HERO */}
        <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 60%)', borderBottom: '1px solid #e4e5e7', padding: '3rem 5%', textAlign: 'center' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ display: 'inline-block', background: '#e8fdf2', border: '1px solid #bbf7d0', borderRadius: '100px', padding: '4px 16px', fontSize: '0.82rem', color: '#1dbf73', fontWeight: 600, marginBottom: '1rem' }}>
              🛠️ Free Tools
            </div>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', marginBottom: '0.75rem', color: '#404145' }}>
              Free Online Tools for Everyone
            </h1>
            <p style={{ color: '#62646a', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Fast, free tools built by developers on DevLpers. No signup required, no file uploads, no limits. Everything runs in your browser.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['Image Tools', 'Calculators', 'No Signup', '100% Free', 'No Limits'].map(tag => (
                <span key={tag} style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '100px', padding: '4px 14px', fontSize: '0.78rem', color: '#62646a' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* DEV ZEESHAN CREDIT */}
        <div style={{ padding: '2rem 5% 0', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{
            background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px',
            padding: '1.25rem 1.75rem',
            display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: '#1dbf73', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '1.1rem', flexShrink: 0,
            }}>DZ</div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <p style={{ color: '#404145', fontWeight: 700, fontSize: '0.92rem', margin: 0 }}>
                Dev Zeeshan <span style={{ color: '#95979d', fontWeight: 400, fontSize: '0.82rem' }}>— Top-rated developer on DevLpers</span>
              </p>
              <p style={{ color: '#62646a', fontSize: '0.78rem', margin: '0.2rem 0 0' }}>
                All tools on this page are built and maintained by Dev Zeeshan
              </p>
            </div>
            <Link href="/developers" style={{ textDecoration: 'none' }}>
              <button style={{
                background: '#1dbf73', color: '#fff', border: 'none',
                padding: '8px 18px', borderRadius: '6px',
                fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', whiteSpace: 'nowrap',
              }}>Browse Developers →</button>
            </Link>
          </div>
        </div>

        {/* IMAGE TOOLS */}
        <div style={{ padding: '3rem 5% 1rem', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '1.25rem', color: '#404145', marginBottom: '0.3rem' }}>
              🖼️ Image Tools
            </h2>
            <p style={{ color: '#95979d', fontSize: '0.85rem', margin: 0 }}>
              Convert, compress, resize and generate image assets — all in your browser, no uploads needed
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1rem' }}>
            {imageTools.map(tool => (
              <ToolCard key={tool.slug} icon={tool.icon} name={tool.name} slug={tool.slug} desc={tool.desc} badge={tool.badge} />
            ))}
          </div>
        </div>

        {/* CALCULATOR TOOLS */}
        <div style={{ padding: '2rem 5% 1rem', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '1.25rem', color: '#404145', marginBottom: '0.3rem' }}>
              🧮 Calculator Tools
            </h2>
            <p style={{ color: '#95979d', fontSize: '0.85rem', margin: 0 }}>
              Quick math, finance and health calculators — instant results, no signup required
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1rem' }}>
            {calculatorTools.map(tool => (
              <ToolCard key={tool.slug} icon={tool.icon} name={tool.name} slug={tool.slug} desc={tool.desc} badge={tool.badge} />
            ))}
          </div>
        </div>

        {/* SEO CONTENT */}
        <div style={{ padding: '2rem 5% 1rem', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '2rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#404145', marginBottom: '1rem' }}>
              Free Tools Built by Real Developers
            </h2>
            <p style={{ color: '#62646a', fontSize: '0.88rem', lineHeight: 1.8, marginBottom: '1rem' }}>
              Every tool on this page is built and maintained by verified developers on DevLpers — the global developer marketplace.
              These tools are designed to be fast, private and completely free, with no hidden limits, no account required, and no files
              uploaded to any server. Whether you need to convert a PNG to WebP, compress images for your website, calculate a loan EMI,
              or generate favicons in all sizes, you can do it here instantly.
            </p>
            <p style={{ color: '#62646a', fontSize: '0.88rem', lineHeight: 1.8 }}>
              Looking for a developer to build custom tools for your business?{' '}
              <Link href="/post-job" style={{ color: '#1dbf73', textDecoration: 'none', fontWeight: 600 }}>Post a job on DevLpers</Link>{' '}
              and get proposals from top developers within hours.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: '2rem 5% 4rem', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ background: 'linear-gradient(135deg, #1dbf73 0%, #19a463 100%)', borderRadius: '12px', padding: '2.5rem 2rem', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.2rem, 2.5vw, 1.75rem)', color: '#fff', marginBottom: '0.75rem' }}>
              Need a Custom Tool Built?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.92rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>
              Hire a developer on DevLpers to build exactly what you need — APIs, web apps, automation tools and more.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/post-job" style={{ textDecoration: 'none' }}>
                <button style={{ background: '#fff', color: '#1dbf73', border: 'none', padding: '12px 28px', borderRadius: '6px', fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer' }}>
                  Post a Job Free
                </button>
              </Link>
              <Link href="/developers" style={{ textDecoration: 'none' }}>
                <button style={{ background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.6)', padding: '12px 28px', borderRadius: '6px', fontWeight: 600, fontSize: '0.92rem', cursor: 'pointer' }}>
                  Browse Developers
                </button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';

// ============ IMAGE TOOLS — 4 cards ============
const imageTools = [
  { icon: '🖼️', name: 'Image Format Converter', slug: '/image-format-converter', desc: 'Convert between PNG, JPG, WebP, BMP, GIF and AVIF in bulk', badge: 'Popular' },
  { icon: '🗜️', name: 'Image Compressor', slug: '/image-compressor', desc: 'Reduce image file size without losing visible quality', badge: 'Popular' },
  { icon: '📐', name: 'Image Resizer', slug: '/image-resizer', desc: 'Resize photos to any dimension or social media preset', badge: 'Design' },
  { icon: '🔖', name: 'Favicon Generator', slug: '/favicon-generator', desc: 'Create all favicon sizes from one image instantly', badge: 'Dev' },
];

// ============ CALCULATOR TOOLS — 4 cards ============
const calculatorTools = [
  { icon: '📏', name: 'Unit Converter', slug: '/unit-converter', desc: 'Convert length, weight, temperature and more instantly', badge: 'Popular' },
  { icon: '⚖️', name: 'BMI Calculator', slug: '/bmi-calculator', desc: 'Calculate your Body Mass Index and health category', badge: 'Health' },
  { icon: '🏦', name: 'Loan EMI Calculator', slug: '/loan-emi-calculator', desc: 'Calculate monthly EMI for home, car or personal loans', badge: 'Finance' },
  { icon: '🔢', name: 'Percentage Calculator', slug: '/percentage-calculator', desc: 'Quick percentage calculations for any number', badge: 'Math' },
];

// ============ FREELANCE TOOLS — 4 cards ============
const freelanceTools = [
  { icon: '📝', name: 'Urdu Word Counter', slug: '/urdu-word-counter', desc: 'Count words, characters and sentences in Urdu text instantly', badge: 'Unique' },
  { icon: '💰', name: 'Freelancer Rate Calculator', slug: '/freelancer-rate-calculator', desc: 'Calculate your ideal hourly rate based on income goals', badge: 'Popular' },
  { icon: '💻', name: 'Code Line Counter', slug: '/code-line-counter', desc: 'Count lines of code, comments and blank lines instantly', badge: 'Dev' },
  { icon: '🧾', name: 'Invoice Generator', slug: '/invoice-generator', desc: 'Create professional PDF invoices free — no signup needed', badge: 'Free' },
];

// ============ SEO TOOLS — 4 cards ============
const seoTools = [
  { icon: '🔗', name: 'DevLpers Backlink Indexer', slug: '/devlpers-backlink-indexer', desc: 'Submit and index your backlinks instantly for faster Google ranking', badge: 'SEO' },
  { icon: '📊', name: 'DA PA Checker', slug: '/da-pa-checker', desc: 'Check Domain Authority and Page Authority of any website instantly', badge: 'SEO' },
  { icon: '🛡️', name: 'Spam Score Checker', slug: '/spam-score-checker', desc: 'Analyze if a domain is spammy or safe using 10+ real signals', badge: 'SEO' },
  { icon: '🔍', name: 'Backlink Checker', slug: '/backlink-checker', desc: 'Find 100-200+ real backlinks and referring domains for any website', badge: 'Free' },
];

// ============ AI TOOLS — 4 cards ============

const aiTools = [
  { icon: '✍️', name: 'AI Article Generator', slug: '/article-generator', desc: 'Generate better articles from competitor content in 8+ languages', badge: 'AI' },
  { icon: '📊', name: 'Coming Soon', slug: '/tools', desc: 'More AI writing tools coming soon', badge: 'Soon' },
  { icon: '🤖', name: 'Coming Soon', slug: '/tools', desc: 'More AI tools coming soon', badge: 'Soon' },
  { icon: '🧠', name: 'Coming Soon', slug: '/tools', desc: 'More AI tools coming soon', badge: 'Soon' },
];


// ============ SECTION CONFIGS ============
const sections = [
  {
    id: 'image',
    emoji: '🖼️',
    title: 'Image Tools',
    desc: 'Convert, compress, resize and generate image assets — all in your browser, no uploads needed',
    tools: imageTools,
    gradient: 'linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 100%)',
    border: '#bae6fd',
    iconBg: '#0ea5e9',
  },
  {
    id: 'calculator',
    emoji: '🧮',
    title: 'Calculator Tools',
    desc: 'Quick math, finance and health calculators — instant results, no signup required',
    tools: calculatorTools,
    gradient: 'linear-gradient(135deg, #fdf4ff 0%, #fce7f3 100%)',
    border: '#e9d5ff',
    iconBg: '#a855f7',
  },
  {
    id: 'freelance',
    emoji: '💼',
    title: 'Freelance Tools',
    desc: 'Tools built specifically for freelancers and developers to manage their work',
    tools: freelanceTools,
    gradient: 'linear-gradient(135deg, #fff7ed 0%, #fef9c3 100%)',
    border: '#fed7aa',
    iconBg: '#f59e0b',
  },
  {
    id: 'seo',
    emoji: '📈',
    title: 'SEO Tools',
    desc: 'Boost your website rankings with free SEO and backlink tools',
    tools: seoTools,
    gradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    border: '#bbf7d0',
    iconBg: '#1dbf73',
  },

  {
  id: 'ai',
  emoji: '🤖',
  title: 'AI Tools',
  desc: 'AI-powered writing and content generation tools — free, fast, multilingual',
  tools: aiTools,
  gradient: 'linear-gradient(135deg, #ede9fe 0%, #dbeafe 100%)',
  border: '#c4b5fd',
  iconBg: '#7c3aed',
},
];

type Tool = {
  icon: string;
  name: string;
  slug: string;
  desc: string;
  badge: string;
};

type Section = {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  tools: Tool[];
  gradient: string;
  border: string;
  iconBg: string;
};

function ToolCard({ icon, name, slug, desc, badge, iconBg }: {
  icon: string; name: string; slug: string; desc: string; badge: string; iconBg: string;
}) {
  const isComingSoon = name === 'Coming Soon';
  return (
    <a
      href={isComingSoon ? undefined : slug}
      target={isComingSoon ? undefined : '_blank'}
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', cursor: isComingSoon ? 'default' : 'pointer' }}
    >
      <div
        style={{
          background: '#fff',
          border: '1px solid #e4e5e7',
          borderRadius: '14px',
          padding: '1.5rem',
          height: '100%',
          boxSizing: 'border-box',
          transition: 'all 0.2s',
          cursor: isComingSoon ? 'default' : 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          opacity: isComingSoon ? 0.5 : 1,
        }}
        onMouseEnter={e => {
          if (!isComingSoon) {
            e.currentTarget.style.borderColor = iconBg;
            e.currentTarget.style.boxShadow = `0 8px 24px ${iconBg}22`;
            e.currentTarget.style.transform = 'translateY(-4px)';
          }
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#e4e5e7';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {/* Badge */}
        <span style={{
          position: 'absolute', top: '1rem', right: '1rem',
          background: `${iconBg}18`,
          color: iconBg,
          border: `1px solid ${iconBg}44`,
          borderRadius: '100px',
          padding: '2px 10px', fontSize: '0.68rem', fontWeight: 700,
        }}>{badge}</span>

        {/* Icon */}
        <div style={{
          width: '44px', height: '44px', borderRadius: '10px',
          background: `${iconBg}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.4rem',
        }}>{icon}</div>

        {/* Name */}
        <h3 style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1a1a2e', margin: 0, lineHeight: 1.3 }}>{name}</h3>

        {/* Desc */}
        <p style={{ color: '#62646a', fontSize: '0.8rem', lineHeight: 1.6, margin: 0, flex: 1 }}>{desc}</p>

        {/* CTA */}
        {!isComingSoon && (
          <span style={{ color: iconBg, fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Open Tool →
          </span>
        )}
      </div>
    </a>
  );
}

function ToolSection({ section }: { section: Section }) {
  return (
    <div style={{ padding: '2.5rem 5%', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Section Header */}
      <div style={{
        background: section.gradient,
        border: `1px solid ${section.border}`,
        borderRadius: '16px',
        padding: '1.5rem 2rem',
        marginBottom: '1.5rem',
        display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
      }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '12px',
          background: section.iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.4rem', flexShrink: 0,
        }}>{section.emoji}</div>
        <div>
          <h2 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '1.15rem', color: '#1a1a2e', margin: 0 }}>
            {section.title}
          </h2>
          <p style={{ color: '#62646a', fontSize: '0.82rem', margin: '0.2rem 0 0' }}>
            {section.desc}
          </p>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div
        className={`tools-grid-${section.id}`}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
        }}
      >
        <style>{`
          @media (max-width: 1024px) {
            .tools-grid-${section.id} {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          @media (max-width: 600px) {
            .tools-grid-${section.id} {
              grid-template-columns: repeat(1, 1fr) !important;
            }
          }
        `}</style>
        {section.tools.map(tool => (
          <ToolCard
            key={tool.slug + tool.name}
            icon={tool.icon}
            name={tool.name}
            slug={tool.slug}
            desc={tool.desc}
            badge={tool.badge}
            iconBg={section.iconBg}
          />
        ))}
      </div>
    </div>
  );
}

export default function ToolsHub() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>

        {/* HERO */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          padding: '4rem 5%', textAlign: 'center',
        }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(29,191,115,0.15)',
              border: '1px solid rgba(29,191,115,0.3)',
              borderRadius: '100px', padding: '6px 18px',
              fontSize: '0.82rem', color: '#1dbf73', fontWeight: 700, marginBottom: '1.25rem',
            }}>🛠️ 15+ Free Tools Available</div>
            <h1 style={{
              fontFamily: 'Inter', fontWeight: 800,
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              marginBottom: '1rem', color: '#ffffff', lineHeight: 1.2,
            }}>
              Free Online Tools<br />
              <span style={{ color: '#1dbf73' }}>Built by Developers</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              Fast, free tools — image conversion, calculators, freelance utilities and SEO tools.
              No signup, no uploads, no limits.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['🖼️ Image Tools', '🧮 Calculators', '💼 Freelance', '📈 SEO', '🔒 Private', '⚡ Instant'].map(tag => (
                <span key={tag} style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '100px', padding: '5px 14px',
                  fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)',
                }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* DEV ZEESHAN CREDIT */}
        <div style={{ padding: '2rem 5% 0', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            background: '#fff', border: '1px solid #e4e5e7', borderRadius: '14px',
            padding: '1.25rem 1.75rem',
            display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}>
            <div style={{
              width: '50px', height: '50px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #1dbf73, #19a463)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '1.1rem', flexShrink: 0,
            }}>DZ</div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <p style={{ color: '#1a1a2e', fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>
                Dev Zeeshan
                <span style={{ color: '#95979d', fontWeight: 400, fontSize: '0.82rem' }}> — Top-rated developer on DevLpers</span>
              </p>
              <p style={{ color: '#62646a', fontSize: '0.78rem', margin: '0.2rem 0 0' }}>
                All tools on this page are built and maintained by Dev Zeeshan
              </p>
            </div>
            <Link href="/developers" style={{ textDecoration: 'none' }}>
              <button style={{
                background: '#1dbf73', color: '#fff', border: 'none',
                padding: '9px 20px', borderRadius: '8px',
                fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
              }}>Browse Developers →</button>
            </Link>
          </div>
        </div>

        {/* ALL SECTIONS */}
        {sections.map(section => (
          <ToolSection key={section.id} section={section} />
        ))}

        {/* SEO CONTENT */}
        <div style={{ padding: '0 5% 2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '14px', padding: '2rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1a1a2e', marginBottom: '1rem' }}>
              Free Tools Built by Real Developers
            </h2>
            <p style={{ color: '#62646a', fontSize: '0.88rem', lineHeight: 1.8, marginBottom: '1rem' }}>
              Every tool is built by verified developers on DevLpers. Fast, private and free — no hidden limits, no account required.
              Convert images, calculate EMI, generate invoices, count code lines, and more — all instant, all in your browser.
            </p>
            <p style={{ color: '#62646a', fontSize: '0.88rem', lineHeight: 1.8 }}>
              Need a custom tool built?{' '}
              <Link href="/post-job" style={{ color: '#1dbf73', textDecoration: 'none', fontWeight: 600 }}>Post a job on DevLpers</Link>
              {' '}and get proposals from top developers within hours.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: '0 5% 4rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            borderRadius: '16px', padding: '3rem 2rem', textAlign: 'center',
          }}>
            <h2 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.2rem, 2.5vw, 1.75rem)', color: '#fff', marginBottom: '0.75rem' }}>
              Need a Custom Tool Built?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.92rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>
              Hire a developer on DevLpers to build exactly what you need.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/post-job" style={{ textDecoration: 'none' }}>
                <button style={{ background: '#1dbf73', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '8px', fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer' }}>
                  Post a Job Free
                </button>
              </Link>
              <Link href="/developers" style={{ textDecoration: 'none' }}>
                <button style={{ background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.3)', padding: '12px 28px', borderRadius: '8px', fontWeight: 600, fontSize: '0.92rem', cursor: 'pointer' }}>
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
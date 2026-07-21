'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function CodeLineCounter() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('auto');

  const languages = ['auto', 'JavaScript', 'Python', 'TypeScript', 'PHP', 'Java', 'C++', 'CSS', 'HTML', 'SQL'];

  const analyze = () => {
    const lines = code.split('\n');
    const totalLines = lines.length;
    const blankLines = lines.filter(l => l.trim() === '').length;
    const commentLines = lines.filter(l => {
      const t = l.trim();
      return t.startsWith('//') || t.startsWith('#') || t.startsWith('*') || t.startsWith('/*') || t.startsWith('<!--');
    }).length;
    const codeLines = totalLines - blankLines - commentLines;
    const words = code.trim() ? code.trim().split(/\s+/).length : 0;
    const chars = code.length;
    const functions = (code.match(/function\s+\w+|def\s+\w+|const\s+\w+\s*=\s*\(|=>\s*{/g) || []).length;
    const imports = (code.match(/^import\s|^from\s|^require\s*\(/gm) || []).length;

    return { totalLines, blankLines, commentLines, codeLines, words, chars, functions, imports };
  };

  const stats = analyze();

  const faqs = [
    { q: 'What languages does this tool support?', a: 'It works with any programming language including JavaScript, Python, TypeScript, PHP, Java, C++, HTML, CSS, SQL and more. It automatically detects comment styles.' },
    { q: 'How are blank and comment lines counted?', a: 'Blank lines have no characters. Comment lines start with //, #, *, /* or <!--. Everything else counts as code lines.' },
    { q: 'Is my code stored anywhere?', a: 'No. All processing happens in your browser. Your code never leaves your device and is never sent to any server.' },
    { q: 'Why count lines of code?', a: 'Line count helps estimate project complexity, billing hours, documentation needs, and code review time.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>

        {/* HERO */}
        <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 60%)', borderBottom: '1px solid #e4e5e7', padding: '3rem 5%' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <nav style={{ marginBottom: '1rem' }}>
              <Link href="/tools" style={{ color: '#1dbf73', fontSize: '0.85rem', textDecoration: 'none' }}>← Back to Tools</Link>
            </nav>
            <div style={{ display: 'inline-block', background: '#e8fdf2', border: '1px solid #bbf7d0', borderRadius: '100px', padding: '4px 16px', fontSize: '0.82rem', color: '#1dbf73', fontWeight: 600, marginBottom: '1rem' }}>
              💻 Free Developer Tool
            </div>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', color: '#404145', marginBottom: '0.5rem' }}>
              Code Line Counter — Count Lines of Code Online
            </h1>
            <p style={{ color: '#62646a', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Paste your code and instantly count total lines, code lines, comment lines, blank lines, functions and imports. Works with any programming language.
            </p>
          </div>
        </div>

        <div style={{ padding: '2.5rem 5%', maxWidth: '800px', margin: '0 auto' }}>

          {/* TOOL */}
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '2rem', marginBottom: '2rem' }}>

            {/* Language selector */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', color: '#62646a', fontSize: '0.82rem', fontWeight: 500, marginBottom: '0.5rem' }}>Language</label>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {languages.map(lang => (
                  <button key={lang} onClick={() => setLanguage(lang)} style={{
                    padding: '5px 12px', borderRadius: '100px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500,
                    background: language === lang ? '#1dbf73' : '#fff',
                    border: `1px solid ${language === lang ? '#1dbf73' : '#e4e5e7'}`,
                    color: language === lang ? '#fff' : '#62646a',
                  }}>{lang}</button>
                ))}
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {[
                { label: 'Total Lines', value: stats.totalLines, color: '#404145' },
                { label: 'Code Lines', value: stats.codeLines, color: '#1dbf73' },
                { label: 'Comment Lines', value: stats.commentLines, color: '#3b82f6' },
                { label: 'Blank Lines', value: stats.blankLines, color: '#95979d' },
                { label: 'Functions', value: stats.functions, color: '#8b5cf6' },
                { label: 'Imports', value: stats.imports, color: '#f59e0b' },
                { label: 'Words', value: stats.words, color: '#ec4899' },
                { label: 'Characters', value: stats.chars, color: '#06b6d4' },
              ].map(stat => (
                <div key={stat.label} style={{ background: '#fafafa', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '0.85rem', textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.3rem', color: stat.color }}>{stat.value}</div>
                  <div style={{ color: '#95979d', fontSize: '0.7rem', marginTop: '0.2rem' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Code Textarea */}
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="// Paste your code here...&#10;function example() {&#10;  return 'Hello World';&#10;}"
              rows={14}
              style={{
                width: '100%', padding: '1rem',
                border: '1px solid #e4e5e7', borderRadius: '8px',
                fontSize: '0.88rem', outline: 'none', resize: 'vertical',
                fontFamily: 'Courier New, monospace',
                color: '#404145', lineHeight: 1.6,
                background: '#1e1e1e',
                boxSizing: 'border-box',
              }}
              onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
              onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
            />

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => setCode('')} style={{ padding: '10px 20px', background: '#fff', border: '1px solid #e4e5e7', borderRadius: '6px', color: '#62646a', cursor: 'pointer', fontSize: '0.88rem' }}>
                Clear
              </button>
              <button onClick={() => navigator.clipboard.writeText(`Total: ${stats.totalLines} | Code: ${stats.codeLines} | Comments: ${stats.commentLines} | Blank: ${stats.blankLines}`)} style={{ padding: '10px 20px', background: '#fff', border: '1px solid #e4e5e7', borderRadius: '6px', color: '#62646a', cursor: 'pointer', fontSize: '0.88rem' }}>
                Copy Stats
              </button>
            </div>
          </div>

          {/* HOW IT WORKS */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.2rem', color: '#404145', marginBottom: '1.25rem' }}>How It Works</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {[
                { icon: '📋', title: 'Paste Code', desc: 'Paste any code from any programming language' },
                { icon: '⚡', title: 'Instant Analysis', desc: 'Get real-time line counts as you type' },
                { icon: '📊', title: 'Full Breakdown', desc: 'Code, comments, blanks, functions and imports' },
                { icon: '🔒', title: 'Private', desc: 'Your code never leaves your browser' },
              ].map(s => (
                <div key={s.title} style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '10px', padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#404145', marginBottom: '0.3rem' }}>{s.title}</div>
                  <div style={{ color: '#95979d', fontSize: '0.78rem' }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.2rem', color: '#404145', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.25rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#404145', marginBottom: '0.5rem' }}>{faq.q}</div>
                  <div style={{ color: '#62646a', fontSize: '0.85rem', lineHeight: 1.7 }}>{faq.a}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SEO CONTENT */}
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#404145', marginBottom: '1rem' }}>Online Code Line Counter for Developers</h2>
            <p style={{ color: '#62646a', fontSize: '0.88rem', lineHeight: 1.8 }}>
              Whether you need to count lines of code for project estimation, billing, documentation, or code review, this free tool gives you an instant
              breakdown. It separates code lines, comment lines, and blank lines, and also detects functions and import statements.
              Works with JavaScript, TypeScript, Python, PHP, Java, C++, HTML, CSS, SQL and any other language.
            </p>
          </div>

          {/* RELATED */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#404145', marginBottom: '1rem' }}>More Free Tools</h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { name: 'Freelancer Rate Calculator', slug: 'freelancer-rate-calculator', icon: '💰' },
                { name: 'Invoice Generator', slug: 'invoice-generator', icon: '🧾' },
                { name: 'Urdu Word Counter', slug: 'urdu-word-counter', icon: '📝' },
              ].map(t => (
                <a key={t.slug} href={`/${t.slug}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '0.6rem 1rem', fontSize: '0.85rem', color: '#62646a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {t.icon} {t.name}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* CREDIT */}
          <div style={{ textAlign: 'center', padding: '1.5rem', background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px' }}>
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
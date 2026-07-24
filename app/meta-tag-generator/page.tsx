'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function MetaTagGenerator() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    keywords: '',
    author: '',
    url: '',
    image: '',
    siteName: '',
    twitterHandle: '',
    robots: 'index, follow',
    language: 'en',
    type: 'website',
  });
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateMetaTags = () => {
    const tags: string[] = [];
    tags.push('<!-- Basic Meta Tags -->');
    if (form.title) tags.push(`<title>${form.title}</title>`);
    if (form.description) tags.push(`<meta name="description" content="${form.description}">`);
    if (form.keywords) tags.push(`<meta name="keywords" content="${form.keywords}">`);
    if (form.author) tags.push(`<meta name="author" content="${form.author}">`);
    tags.push(`<meta name="robots" content="${form.robots}">`);
    tags.push(`<meta http-equiv="Content-Language" content="${form.language}">`);
    tags.push(`<meta name="viewport" content="width=device-width, initial-scale=1">`);
    tags.push('');
    tags.push('<!-- Open Graph (Facebook, LinkedIn) -->');
    if (form.title) tags.push(`<meta property="og:title" content="${form.title}">`);
    if (form.description) tags.push(`<meta property="og:description" content="${form.description}">`);
    tags.push(`<meta property="og:type" content="${form.type}">`);
    if (form.url) tags.push(`<meta property="og:url" content="${form.url}">`);
    if (form.image) tags.push(`<meta property="og:image" content="${form.image}">`);
    if (form.siteName) tags.push(`<meta property="og:site_name" content="${form.siteName}">`);
    tags.push('');
    tags.push('<!-- Twitter Card -->');
    tags.push('<meta name="twitter:card" content="summary_large_image">');
    if (form.title) tags.push(`<meta name="twitter:title" content="${form.title}">`);
    if (form.description) tags.push(`<meta name="twitter:description" content="${form.description}">`);
    if (form.image) tags.push(`<meta name="twitter:image" content="${form.image}">`);
    if (form.twitterHandle) tags.push(`<meta name="twitter:site" content="@${form.twitterHandle.replace('@', '')}">`);
    if (form.url) tags.push(`<link rel="canonical" href="${form.url}">`);
    return tags.join('\n');
  };

  const output = generateMetaTags();

  const copyCode = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #e4e5e7', borderRadius: '6px', fontSize: '0.88rem', outline: 'none', color: '#404145', boxSizing: 'border-box' as const };
  const labelStyle = { display: 'block', color: '#62646a', fontSize: '0.82rem', fontWeight: 500, marginBottom: '0.3rem' };

  const titleLen = form.title.length;
  const descLen = form.description.length;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>

        {/* HERO */}
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '3.5rem 5%', textAlign: 'center' }}>
          <div style={{ maxWidth: '750px', margin: '0 auto' }}>
            <div style={{ display: 'inline-block', background: 'rgba(29,191,115,0.15)', border: '1px solid rgba(29,191,115,0.3)', borderRadius: '100px', padding: '5px 18px', fontSize: '0.82rem', color: '#1dbf73', fontWeight: 700, marginBottom: '1.25rem' }}>
              🏷️ Free SEO Tool
            </div>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', color: '#fff', marginBottom: '0.75rem', lineHeight: 1.2 }}>
              Meta Tag Generator<br />
              <span style={{ color: '#1dbf73' }}>For Perfect SEO</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Generate complete HTML meta tags — Basic SEO, Open Graph and Twitter Cards — instantly. Free, no signup required.
            </p>
          </div>
        </div>

        <div style={{ padding: '2.5rem 5%', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>

            {/* LEFT - INPUTS */}
            <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#404145', marginBottom: '1.25rem' }}>Enter Your Website Details</h2>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '0', marginBottom: '1.5rem', border: '1px solid #e4e5e7', borderRadius: '8px', overflow: 'hidden' }}>
                {[
                  { id: 'basic', label: '📋 Basic' },
                  { id: 'social', label: '📱 Social' },
                  { id: 'advanced', label: '⚙️ Advanced' },
                ].map(t => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                    flex: 1, padding: '9px 6px', border: 'none', fontSize: '0.78rem',
                    background: activeTab === t.id ? '#1a1a2e' : '#fff',
                    color: activeTab === t.id ? '#fff' : '#62646a',
                    fontWeight: activeTab === t.id ? 700 : 400, cursor: 'pointer',
                  }}>{t.label}</button>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {activeTab === 'basic' && (
                  <>
                    <div>
                      <label style={labelStyle}>
                        Page Title *
                        <span style={{ float: 'right', color: titleLen > 60 ? '#dc2626' : titleLen > 50 ? '#f59e0b' : '#1dbf73' }}>
                          {titleLen}/60
                        </span>
                      </label>
                      <input name="title" value={form.title} onChange={handleInput} placeholder="My Awesome Website" style={inputStyle}
                        onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                        onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'} />
                    </div>
                    <div>
                      <label style={labelStyle}>
                        Meta Description *
                        <span style={{ float: 'right', color: descLen > 160 ? '#dc2626' : descLen > 140 ? '#f59e0b' : '#1dbf73' }}>
                          {descLen}/160
                        </span>
                      </label>
                      <textarea name="description" value={form.description} onChange={handleInput}
                        placeholder="A brief description of your page for search engines..." rows={3}
                        style={{ ...inputStyle, resize: 'vertical', fontFamily: 'Inter, sans-serif' }}
                        onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                        onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'} />
                    </div>
                    <div>
                      <label style={labelStyle}>Keywords (comma separated)</label>
                      <input name="keywords" value={form.keywords} onChange={handleInput} placeholder="seo, website, tools" style={inputStyle}
                        onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                        onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'} />
                    </div>
                    <div>
                      <label style={labelStyle}>Author</label>
                      <input name="author" value={form.author} onChange={handleInput} placeholder="Your Name" style={inputStyle}
                        onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                        onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'} />
                    </div>
                    <div>
                      <label style={labelStyle}>Page URL</label>
                      <input name="url" value={form.url} onChange={handleInput} placeholder="https://yourwebsite.com/page" style={inputStyle}
                        onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                        onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'} />
                    </div>
                  </>
                )}

                {activeTab === 'social' && (
                  <>
                    <div>
                      <label style={labelStyle}>OG Image URL (1200×630 recommended)</label>
                      <input name="image" value={form.image} onChange={handleInput} placeholder="https://yoursite.com/og-image.jpg" style={inputStyle}
                        onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                        onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'} />
                    </div>
                    <div>
                      <label style={labelStyle}>Site Name</label>
                      <input name="siteName" value={form.siteName} onChange={handleInput} placeholder="My Website" style={inputStyle}
                        onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                        onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'} />
                    </div>
                    <div>
                      <label style={labelStyle}>Twitter Handle (without @)</label>
                      <input name="twitterHandle" value={form.twitterHandle} onChange={handleInput} placeholder="yourtwitterhandle" style={inputStyle}
                        onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                        onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'} />
                    </div>
                    <div>
                      <label style={labelStyle}>Content Type</label>
                      <select name="type" value={form.type} onChange={handleInput} style={{ ...inputStyle, cursor: 'pointer' }}>
                        {['website', 'article', 'product', 'profile', 'blog'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {activeTab === 'advanced' && (
                  <>
                    <div>
                      <label style={labelStyle}>Robots</label>
                      <select name="robots" value={form.robots} onChange={handleInput} style={{ ...inputStyle, cursor: 'pointer' }}>
                        {['index, follow', 'noindex, follow', 'index, nofollow', 'noindex, nofollow'].map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Language</label>
                      <select name="language" value={form.language} onChange={handleInput} style={{ ...inputStyle, cursor: 'pointer' }}>
                        {[
                          { value: 'en', label: 'English' },
                          { value: 'ur', label: 'Urdu' },
                          { value: 'ar', label: 'Arabic' },
                          { value: 'es', label: 'Spanish' },
                          { value: 'fr', label: 'French' },
                          { value: 'de', label: 'German' },
                        ].map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* RIGHT - OUTPUT */}
            <div style={{ background: '#1e1e1e', border: '1px solid #333', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: '#d4d4d4', fontWeight: 700, fontSize: '0.88rem' }}>Generated Meta Tags</div>
                <button onClick={copyCode} style={{
                  background: copied ? '#1dbf73' : '#2d2d2d', border: '1px solid #444',
                  color: copied ? '#fff' : '#d4d4d4', padding: '6px 16px',
                  borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                }}>{copied ? '✓ Copied!' : '📋 Copy All'}</button>
              </div>
              <pre style={{
                padding: '1.5rem', color: '#d4d4d4', fontSize: '0.78rem',
                lineHeight: 1.7, overflow: 'auto', margin: 0,
                fontFamily: 'Courier New, monospace', minHeight: '400px',
                whiteSpace: 'pre-wrap', wordBreak: 'break-all',
              }}>{output}</pre>
            </div>
          </div>

          {/* PREVIEW */}
          {form.title && (
            <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#404145', marginBottom: '1rem' }}>Search Engine Preview</h3>
              <div style={{ border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.25rem', background: '#fff' }}>
                <div style={{ color: '#1a0dab', fontSize: '1.05rem', fontWeight: 500, marginBottom: '0.3rem', cursor: 'pointer' }}>
                  {form.title || 'Page Title'}
                </div>
                <div style={{ color: '#006621', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                  {form.url || 'https://yourwebsite.com'}
                </div>
                <div style={{ color: '#545454', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  {form.description || 'Page description will appear here...'}
                </div>
              </div>
              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: titleLen > 60 ? '#dc2626' : '#1dbf73', fontWeight: 500 }}>
                  {titleLen > 60 ? '⚠️ Title too long' : '✅ Title OK'}
                </span>
                <span style={{ fontSize: '0.75rem', color: descLen > 160 ? '#dc2626' : descLen < 120 ? '#f59e0b' : '#1dbf73', fontWeight: 500 }}>
                  {descLen > 160 ? '⚠️ Description too long' : descLen < 120 ? '⚠️ Description too short' : '✅ Description OK'}
                </span>
              </div>
            </div>
          )}

          {/* FAQ */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.2rem', color: '#404145', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { q: 'What are meta tags?', a: 'Meta tags are HTML elements that provide information about your webpage to search engines and social media platforms. They affect how your page appears in search results and when shared on social media.' },
                { q: 'How long should my title tag be?', a: 'Title tags should be 50-60 characters. Google typically displays the first 50-60 characters of a title tag. Longer titles may be truncated in search results.' },
                { q: 'What is Open Graph?', a: 'Open Graph (og:) tags control how your content appears when shared on Facebook, LinkedIn and other social platforms. They define the title, description and image shown in link previews.' },
                { q: 'Do meta keywords still matter for SEO?', a: 'Meta keywords are largely ignored by Google and most major search engines. Focus on title and description tags which still significantly impact click-through rates.' },
              ].map((faq, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.25rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#404145', marginBottom: '0.5rem' }}>{faq.q}</div>
                  <div style={{ color: '#62646a', fontSize: '0.85rem', lineHeight: 1.7 }}>{faq.a}</div>
                </div>
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
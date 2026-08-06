'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

export default function ArticleGenerator() {
  const [tab, setTab] = useState<'paste' | 'url'>('paste');
  const [sampleArticle, setSampleArticle] = useState('');
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [instructions, setInstructions] = useState('');
  const [language, setLanguage] = useState('auto');
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const languages = [
    { value: 'auto', label: '🌐 Auto Detect' },
    { value: 'English', label: '🇬🇧 English' },
    { value: 'Urdu', label: '🇵🇰 Urdu' },
    { value: 'Hindi', label: '🇮🇳 Hindi' },
    { value: 'Arabic', label: '🇸🇦 Arabic' },
    { value: 'Spanish', label: '🇪🇸 Spanish' },
    { value: 'French', label: '🇫🇷 French' },
    { value: 'German', label: '🇩🇪 German' },
  ];

  const generateArticle = async () => {
    if (!sampleArticle.trim() && !competitorUrl.trim()) {
      setError('Please paste a sample article or enter a competitor URL');
      return;
    }
    setLoading(true);
    setError('');
    setArticle('');

    try {
      const res = await fetch('/api/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sampleArticle: tab === 'paste' ? sampleArticle : '',
          competitorUrl: tab === 'url' ? competitorUrl : '',
          instructions,
          language: language === 'auto' ? '' : language,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setArticle(data.article);
      setWordCount(data.article.split(/\s+/).filter((w: string) => w).length);
    } catch (err: any) {
      setError(err.message || 'Failed to generate article. Please try again.');
    }
    setLoading(false);
  };

  const copyArticle = () => {
    navigator.clipboard.writeText(article);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadArticle = () => {
    const blob = new Blob([article], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'article.md';
    a.click();
  };

  const renderMarkdown = (text: string) => {
    return text
      .replace(/^### (.*)/gm, '<h3 style="font-size:1.1rem;font-weight:700;color:#1a1a2e;margin:1.5rem 0 0.5rem">$1</h3>')
      .replace(/^## (.*)/gm, '<h2 style="font-size:1.3rem;font-weight:700;color:#1a1a2e;margin:2rem 0 0.75rem">$1</h2>')
      .replace(/^# (.*)/gm, '<h1 style="font-size:1.6rem;font-weight:800;color:#1a1a2e;margin:0 0 1rem">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*)/gm, '<li style="margin:0.3rem 0;color:#404145">$1</li>')
      .replace(/^(\d+)\. (.*)/gm, '<li style="margin:0.3rem 0;color:#404145">$2</li>')
      .replace(/\n\n/g, '</p><p style="margin:0.75rem 0;line-height:1.8;color:#404145">')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>

        {/* HERO */}
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', padding: '3.5rem 5%', textAlign: 'center' }}>
          <div style={{ maxWidth: '750px', margin: '0 auto' }}>
            <div style={{ display: 'inline-block', background: 'rgba(29,191,115,0.15)', border: '1px solid rgba(29,191,115,0.3)', borderRadius: '100px', padding: '5px 18px', fontSize: '0.82rem', color: '#1dbf73', fontWeight: 700, marginBottom: '1.25rem' }}>
              ✍️ AI Article Generator — Powered by Llama 3
            </div>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', color: '#fff', marginBottom: '0.75rem', lineHeight: 1.2 }}>
              Generate High-Quality Articles<br />
              <span style={{ color: '#1dbf73' }}>From Any Competitor Content</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Paste any article or competitor URL — get a better, more advanced version in seconds. Supports Urdu, English, Arabic and 5+ languages.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['🤖 Llama 3 AI', '🌐 8+ Languages', '📝 SEO Optimized', '⚡ 10 Seconds', '🆓 100% Free'].map(tag => (
                <span key={tag} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '100px', padding: '5px 14px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: '2.5rem 5%', maxWidth: '900px', margin: '0 auto' }}>

          {/* MAIN TOOL */}
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0', marginBottom: '1.5rem', border: '1px solid #e4e5e7', borderRadius: '10px', overflow: 'hidden' }}>
              {[
                { id: 'paste', icon: '📋', label: 'Paste Article' },
                { id: 'url', icon: '🔗', label: 'Competitor URL' },
              ].map(t => (
                <button key={t.id} onClick={() => setTab(t.id as any)} style={{
                  flex: 1, padding: '12px',
                  background: tab === t.id ? '#1a1a2e' : '#fff',
                  border: 'none',
                  color: tab === t.id ? '#fff' : '#62646a',
                  fontWeight: tab === t.id ? 700 : 400,
                  fontSize: '0.9rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                }}>
                  <span>{t.icon}</span> {t.label}
                </button>
              ))}
            </div>

            {/* Input */}
            {tab === 'paste' ? (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', color: '#62646a', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Paste Sample Article or Competitor Content *
                </label>
                <textarea
                  value={sampleArticle}
                  onChange={e => setSampleArticle(e.target.value)}
                  placeholder="Paste any article here — English, Urdu, Arabic or any language. The AI will create a better, more advanced version in the same language..."
                  rows={10}
                  style={{
                    width: '100%', padding: '1rem',
                    border: '2px solid #e4e5e7', borderRadius: '10px',
                    fontSize: '0.9rem', outline: 'none', resize: 'vertical',
                    fontFamily: 'Inter, sans-serif', color: '#404145',
                    lineHeight: 1.7, boxSizing: 'border-box',
                  }}
                  onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                  onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
                />
                {sampleArticle && (
                  <div style={{ color: '#95979d', fontSize: '0.78rem', marginTop: '0.4rem' }}>
                    {sampleArticle.split(/\s+/).filter(w => w).length} words pasted
                  </div>
                )}
              </div>
            ) : (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', color: '#62646a', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Competitor Article URL *
                </label>
                <input
                  value={competitorUrl}
                  onChange={e => setCompetitorUrl(e.target.value)}
                  placeholder="https://competitor.com/their-article"
                  style={{
                    width: '100%', padding: '12px 16px',
                    border: '2px solid #e4e5e7', borderRadius: '10px',
                    fontSize: '0.9rem', outline: 'none', color: '#404145',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                  onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
                />
                <div style={{ marginTop: '0.5rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px', padding: '0.5rem 0.75rem', color: '#92400e', fontSize: '0.78rem' }}>
                  ⚠️ Note: URL scraping may be blocked by some websites. For best results, paste the article text directly.
                </div>
              </div>
            )}

            {/* Language + Instructions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', color: '#62646a', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Output Language
                </label>
                <select value={language} onChange={e => setLanguage(e.target.value)} style={{
                  width: '100%', padding: '11px 14px',
                  border: '2px solid #e4e5e7', borderRadius: '10px',
                  fontSize: '0.88rem', color: '#404145', background: '#fff', cursor: 'pointer', outline: 'none',
                }}>
                  {languages.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', color: '#62646a', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Additional Instructions (Optional)
                </label>
                <input
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  placeholder="e.g. Focus on beginners, add more examples, make it 2000 words..."
                  style={{
                    width: '100%', padding: '11px 14px',
                    border: '2px solid #e4e5e7', borderRadius: '10px',
                    fontSize: '0.88rem', color: '#404145', outline: 'none', boxSizing: 'border-box',
                  }}
                  onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                  onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
                />
              </div>
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.85rem', color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem' }}>
                ⚠️ {error}
              </div>
            )}

            {/* Generate Button */}
            <button onClick={generateArticle} disabled={loading} style={{
              width: '100%', padding: '15px',
              background: loading ? '#a7f3d0' : 'linear-gradient(135deg, #1dbf73 0%, #19a463 100%)',
              border: 'none', borderRadius: '10px', color: '#fff',
              fontWeight: 700, fontSize: '1.05rem', cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
            }}>
              {loading ? (
                <>
                  <span>⏳</span>
                  Generating High-Quality Article... (10-20 seconds)
                </>
              ) : (
                <>
                  <span>✍️</span>
                  Generate Better Article
                </>
              )}
            </button>
          </div>

          {/* RESULT */}
          {article && (
            <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '16px', overflow: 'hidden', marginBottom: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              {/* Result Header */}
              <div style={{ background: '#1a1a2e', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>✅</span>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.92rem' }}>Article Generated!</div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>{wordCount} words · SEO Optimized</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={copyArticle} style={{
                    background: copied ? '#1dbf73' : 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff', padding: '7px 16px', borderRadius: '6px',
                    cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
                  }}>{copied ? '✓ Copied!' : '📋 Copy'}</button>
                  <button onClick={downloadArticle} style={{
                    background: '#1dbf73', border: 'none',
                    color: '#fff', padding: '7px 16px', borderRadius: '6px',
                    cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
                  }}>⬇️ Download .md</button>
                </div>
              </div>

              {/* Article Content */}
              <div style={{ padding: '2rem' }}>
                <div
                  style={{ color: '#404145', lineHeight: 1.8, fontSize: '0.95rem' }}
                  dangerouslySetInnerHTML={{ __html: `<p style="margin:0.75rem 0;line-height:1.8;color:#404145">${renderMarkdown(article)}</p>` }}
                />
              </div>

              {/* Raw Markdown */}
              <div style={{ borderTop: '1px solid #e4e5e7', padding: '1rem 1.5rem', background: '#fafafa' }}>
                <details>
                  <summary style={{ cursor: 'pointer', color: '#62646a', fontSize: '0.85rem', fontWeight: 600 }}>
                    📝 View Raw Markdown
                  </summary>
                  <textarea
                    readOnly
                    value={article}
                    rows={10}
                    style={{
                      width: '100%', marginTop: '0.75rem', padding: '1rem',
                      border: '1px solid #e4e5e7', borderRadius: '8px',
                      fontSize: '0.82rem', fontFamily: 'Courier New, monospace',
                      background: '#1e1e1e', color: '#d4d4d4',
                      resize: 'vertical', outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </details>
              </div>
            </div>
          )}

          {/* HOW IT WORKS */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.2rem', color: '#404145', marginBottom: '1.25rem' }}>How It Works</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {[
                { icon: '📋', title: 'Paste Content', desc: 'Paste competitor article or enter their URL' },
                { icon: '🤖', title: 'AI Analyzes', desc: 'Llama 3 AI reads structure, keywords and format' },
                { icon: '✍️', title: 'Generates Better', desc: 'Creates advanced version 30-50% more detailed' },
                { icon: '⬇️', title: 'Copy or Download', desc: 'Get article in markdown or copy to clipboard' },
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
              {[
                { q: 'What AI model is used?', a: 'We use Meta Llama 3.1 8B Instant via Groq API — one of the fastest and most capable open-source language models available.' },
                { q: 'Does it support Urdu and Arabic?', a: 'Yes! The AI automatically detects the language of your sample article and writes the new article in the same language. It supports 8+ languages.' },
                { q: 'Is the generated content unique?', a: 'Yes. The AI rewrites the article in its own words with new structure and insights. It is not a copy — it is a completely new, better article on the same topic.' },
                { q: 'Can I use this for commercial content?', a: 'Yes, completely free for personal and commercial use. Always review and edit the output before publishing.' },
                { q: 'Why is the URL option less reliable?', a: 'Many websites block automated access. For best results, copy and paste the article text directly into the tool.' },
              ].map((faq, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.25rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#404145', marginBottom: '0.5rem' }}>{faq.q}</div>
                  <div style={{ color: '#62646a', fontSize: '0.85rem', lineHeight: 1.7 }}>{faq.a}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SEO CONTENT */}
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#404145', marginBottom: '1rem' }}>
              Free AI Article Generator — Better Than Competitor Content
            </h2>
            <p style={{ color: '#62646a', fontSize: '0.88rem', lineHeight: 1.8, marginBottom: '1rem' }}>
              This free AI article generator uses Meta Llama 3 to analyze competitor articles and create better, more comprehensive versions.
              Whether you need to outrank a competitor, refresh old content, or create high-quality articles in multiple languages,
              this tool gets it done in seconds — completely free with no signup required.
            </p>
            <p style={{ color: '#62646a', fontSize: '0.88rem', lineHeight: 1.8 }}>
              Need a professional content writer or SEO developer?{' '}
              <Link href="/developers" style={{ color: '#1dbf73', textDecoration: 'none', fontWeight: 600 }}>Browse developers on DevLpers</Link>
              {' '}and hire top talent worldwide.
            </p>
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
'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

export default function RobotsTxtGenerator() {
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [rules, setRules] = useState([
    { userAgent: '*', allow: '/', disallow: '' },
  ]);
  const [crawlDelay, setCrawlDelay] = useState('');
  const [blockBots, setBlockBots] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const commonBots = ['GPTBot', 'ChatGPT-User', 'CCBot', 'anthropic-ai', 'Google-Extended', 'AhrefsBot', 'SemrushBot', 'MJ12bot', 'DotBot'];

  const addRule = () => setRules([...rules, { userAgent: '', allow: '/', disallow: '' }]);
  const removeRule = (i: number) => setRules(rules.filter((_, idx) => idx !== i));
  const updateRule = (i: number, field: string, value: string) => {
    setRules(rules.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
  };

  const toggleBot = (bot: string) => {
    setBlockBots(prev => prev.includes(bot) ? prev.filter(b => b !== bot) : [...prev, bot]);
  };

  const generateRobots = () => {
    const lines: string[] = [];
    rules.forEach(rule => {
      if (rule.userAgent) {
        lines.push(`User-agent: ${rule.userAgent}`);
        if (rule.allow) lines.push(`Allow: ${rule.allow}`);
        if (rule.disallow) lines.push(`Disallow: ${rule.disallow}`);
        if (crawlDelay) lines.push(`Crawl-delay: ${crawlDelay}`);
        lines.push('');
      }
    });

    if (blockBots.length > 0) {
      lines.push('# Blocked Bots');
      blockBots.forEach(bot => {
        lines.push(`User-agent: ${bot}`);
        lines.push('Disallow: /');
        lines.push('');
      });
    }

    if (sitemapUrl) lines.push(`Sitemap: ${sitemapUrl}`);
    return lines.join('\n');
  };

  const output = generateRobots();

  const copyCode = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    a.click();
  };

  const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid #e4e5e7', borderRadius: '6px', fontSize: '0.85rem', outline: 'none', color: '#404145', boxSizing: 'border-box' as const };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>

        {/* HERO */}
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', padding: '3.5rem 5%', textAlign: 'center' }}>
          <div style={{ maxWidth: '750px', margin: '0 auto' }}>
            <div style={{ display: 'inline-block', background: 'rgba(29,191,115,0.15)', border: '1px solid rgba(29,191,115,0.3)', borderRadius: '100px', padding: '5px 18px', fontSize: '0.82rem', color: '#1dbf73', fontWeight: 700, marginBottom: '1.25rem' }}>
              🤖 Free SEO Tool
            </div>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', color: '#fff', marginBottom: '0.75rem', lineHeight: 1.2 }}>
              Robots.txt Generator<br />
              <span style={{ color: '#1dbf73' }}>Control Search Engine Crawling</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Generate a perfect robots.txt file for your website. Block AI bots, control crawling, add sitemap. Free, instant, download ready.
            </p>
          </div>
        </div>

        <div style={{ padding: '2.5rem 5%', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>

            {/* LEFT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Rules */}
              <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#404145', marginBottom: '1rem' }}>Crawl Rules</h3>
                {rules.map((rule, i) => (
                  <div key={i} style={{ background: '#fafafa', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.82rem', color: '#404145' }}>Rule {i + 1}</span>
                      {rules.length > 1 && (
                        <button onClick={() => removeRule(i)} style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.8rem' }}>✕ Remove</button>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div>
                        <label style={{ display: 'block', color: '#62646a', fontSize: '0.75rem', fontWeight: 500, marginBottom: '0.25rem' }}>User-agent</label>
                        <input value={rule.userAgent} onChange={e => updateRule(i, 'userAgent', e.target.value)} placeholder="* (all bots)" style={inputStyle} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <div>
                          <label style={{ display: 'block', color: '#62646a', fontSize: '0.75rem', fontWeight: 500, marginBottom: '0.25rem' }}>Allow</label>
                          <input value={rule.allow} onChange={e => updateRule(i, 'allow', e.target.value)} placeholder="/" style={inputStyle} />
                        </div>
                        <div>
                          <label style={{ display: 'block', color: '#62646a', fontSize: '0.75rem', fontWeight: 500, marginBottom: '0.25rem' }}>Disallow</label>
                          <input value={rule.disallow} onChange={e => updateRule(i, 'disallow', e.target.value)} placeholder="/admin/" style={inputStyle} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addRule} style={{ width: '100%', padding: '8px', background: '#f0fdf4', border: '1px dashed #bbf7d0', borderRadius: '6px', color: '#1dbf73', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>
                  + Add Rule
                </button>
              </div>

              {/* Block AI Bots */}
              <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#404145', marginBottom: '0.5rem' }}>Block AI & SEO Bots</h3>
                <p style={{ color: '#95979d', fontSize: '0.78rem', marginBottom: '1rem' }}>Click to block specific bots from crawling your site</p>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {commonBots.map(bot => (
                    <button key={bot} onClick={() => toggleBot(bot)} style={{
                      padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500,
                      background: blockBots.includes(bot) ? '#fef2f2' : '#fff',
                      border: `1px solid ${blockBots.includes(bot) ? '#fecaca' : '#e4e5e7'}`,
                      color: blockBots.includes(bot) ? '#dc2626' : '#62646a',
                    }}>{blockBots.includes(bot) ? '✗ ' : ''}{bot}</button>
                  ))}
                </div>
              </div>

              {/* Sitemap + Crawl Delay */}
              <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#404145', marginBottom: '1rem' }}>Additional Settings</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', color: '#62646a', fontSize: '0.82rem', fontWeight: 500, marginBottom: '0.3rem' }}>Sitemap URL</label>
                    <input value={sitemapUrl} onChange={e => setSitemapUrl(e.target.value)} placeholder="https://yoursite.com/sitemap.xml" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#62646a', fontSize: '0.82rem', fontWeight: 500, marginBottom: '0.3rem' }}>Crawl Delay (seconds)</label>
                    <input type="number" value={crawlDelay} onChange={e => setCrawlDelay(e.target.value)} placeholder="10" style={inputStyle} />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT - OUTPUT */}
            <div style={{ background: '#1e1e1e', border: '1px solid #333', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: '#d4d4d4', fontWeight: 700, fontSize: '0.88rem' }}>robots.txt</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={copyCode} style={{ background: copied ? '#1dbf73' : '#2d2d2d', border: '1px solid #444', color: copied ? '#fff' : '#d4d4d4', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                    {copied ? '✓' : '📋'} Copy
                  </button>
                  <button onClick={downloadFile} style={{ background: '#1dbf73', border: 'none', color: '#fff', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                    ⬇️ Download
                  </button>
                </div>
              </div>
              <pre style={{ padding: '1.5rem', color: '#d4d4d4', fontSize: '0.82rem', lineHeight: 1.8, overflow: 'auto', margin: 0, fontFamily: 'Courier New, monospace', minHeight: '500px', whiteSpace: 'pre-wrap' }}>
                {output}
              </pre>
            </div>
          </div>

          {/* FAQ */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.2rem', color: '#404145', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { q: 'What is robots.txt?', a: 'robots.txt is a text file in your website root that tells search engine crawlers which pages or files they can or cannot request. It helps control indexing and crawl budget.' },
                { q: 'Where do I put robots.txt?', a: 'Place robots.txt in the root directory of your website. It must be accessible at https://yourwebsite.com/robots.txt. Most CMS platforms have settings to manage this.' },
                { q: 'Should I block AI bots?', a: 'Many website owners block AI training bots like GPTBot and CCBot to prevent their content being used to train AI models without permission. Search bots like Googlebot should generally be allowed.' },
                { q: 'Does robots.txt affect SEO?', a: 'Yes. Blocking Googlebot from crawling important pages will prevent them from being indexed. Use Disallow carefully and never block CSS or JS files that affect rendering.' },
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
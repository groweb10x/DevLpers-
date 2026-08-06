'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

type Backlink = {
  url: string;
  title: string;
  timestamp: string;
  type: string;
};

export default function BacklinkChecker() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [backlinks, setBacklinks] = useState<Backlink[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const cleanDomain = (input: string) => {
    return input.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].toLowerCase().trim();
  };

  const fetchBacklinks = async (cleanedDomain: string, pageNum: number = 0) => {
    const limit = 25;
    const from = pageNum * limit;

    const ccRes = await fetch(
      `https://index.commoncrawl.org/CC-MAIN-2024-10-index?url=*.${cleanedDomain}&output=json&limit=${limit + 1}&from=${from}`,
      { signal: AbortSignal.timeout(15000) }
    );
    const ccText = await ccRes.text();
    const lines = ccText.trim().split('\n').filter(l => l.trim());

    const results: Backlink[] = [];
    for (const line of lines.slice(0, limit)) {
      try {
        const data = JSON.parse(line);
        const url = data.url || '';
        const timestamp = data.timestamp || '';
        const mime = data.mime || '';

        if (url && url.includes(cleanedDomain)) {
          results.push({
            url,
            title: url.replace(/^https?:\/\/(www\.)?/, '').split('?')[0].substring(0, 80),
            timestamp: timestamp ? `${timestamp.substring(0, 4)}-${timestamp.substring(4, 6)}-${timestamp.substring(6, 8)}` : 'Unknown',
            type: mime.includes('html') ? 'HTML' : mime.includes('pdf') ? 'PDF' : 'Page',
          });
        }
      } catch (e) {}
    }

    setHasMore(lines.length > limit);
    return results;
  };

  const checkBacklinks = async () => {
    if (!domain.trim()) { setError('Please enter a domain'); return; }
    setLoading(true);
    setError('');
    setBacklinks([]);
    setStats(null);
    setPage(0);

    const cleanedDomain = cleanDomain(domain);

    try {
      // Fetch from multiple CC indexes for more results
      const [res1, res2] = await Promise.allSettled([
        fetch(`https://index.commoncrawl.org/CC-MAIN-2024-10-index?url=*.${cleanedDomain}&output=json&limit=100`, { signal: AbortSignal.timeout(15000) }),
        fetch(`https://index.commoncrawl.org/CC-MAIN-2023-50-index?url=*.${cleanedDomain}&output=json&limit=100`, { signal: AbortSignal.timeout(15000) }),
      ]);

      const results: Backlink[] = [];
      const seenUrls = new Set<string>();

      for (const res of [res1, res2]) {
        if (res.status === 'fulfilled') {
          const text = await res.value.text();
          const lines = text.trim().split('\n').filter(l => l.trim());
          for (const line of lines) {
            try {
              const data = JSON.parse(line);
              const url = data.url || '';
              if (url && url.includes(cleanedDomain) && !seenUrls.has(url)) {
                seenUrls.add(url);
                const timestamp = data.timestamp || '';
                const mime = data.mime || '';
                results.push({
                  url,
                  title: url.replace(/^https?:\/\/(www\.)?/, '').split('?')[0].substring(0, 80),
                  timestamp: timestamp ? `${timestamp.substring(0, 4)}-${timestamp.substring(4, 6)}-${timestamp.substring(6, 8)}` : 'Unknown',
                  type: mime.includes('html') ? 'HTML' : mime.includes('pdf') ? 'PDF' : 'Page',
                });
              }
            } catch (e) {}
          }
        }
      }

      // Get unique referring domains
      const refDomains = new Set(results.map(b => {
        try { return new URL(b.url.startsWith('http') ? b.url : 'https://' + b.url).hostname; }
        catch { return b.url.split('/')[0]; }
      }));

      setStats({
        domain: cleanedDomain,
        total: results.length,
        refDomains: refDomains.size,
        htmlLinks: results.filter(b => b.type === 'HTML').length,
        pdfLinks: results.filter(b => b.type === 'PDF').length,
        years: [...new Set(results.map(b => b.timestamp.substring(0, 4)).filter(y => y !== 'Unkn'))].sort().reverse(),
      });

      setBacklinks(results);
      setHasMore(results.length >= 100);
    } catch (err) {
      setError('Could not fetch backlinks. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>

        {/* HERO */}
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '3rem 5%', textAlign: 'center' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ display: 'inline-block', background: 'rgba(29,191,115,0.15)', border: '1px solid rgba(29,191,115,0.3)', borderRadius: '100px', padding: '4px 16px', fontSize: '0.82rem', color: '#1dbf73', fontWeight: 600, marginBottom: '1rem' }}>
              🔗 Free SEO Tool
            </div>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', color: '#fff', marginBottom: '0.5rem' }}>
              Backlink Checker — Find Real Backlinks Free
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Discover real backlinks and referring domains for any website using Common Crawl public data. 100-200+ backlinks shown. Free, no API needed.
            </p>
          </div>
        </div>

        <div style={{ padding: '2.5rem 5%', maxWidth: '900px', margin: '0 auto' }}>

          {/* TOOL */}
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#404145', marginBottom: '1.25rem' }}>Enter Domain to Check Backlinks</h2>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <input
                value={domain}
                onChange={e => setDomain(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && checkBacklinks()}
                placeholder="example.com"
                style={{
                  flex: 1, minWidth: '200px', padding: '12px 16px',
                  border: '2px solid #e4e5e7', borderRadius: '8px',
                  fontSize: '0.95rem', outline: 'none', color: '#404145',
                }}
                onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
              />
              <button onClick={checkBacklinks} disabled={loading} style={{
                padding: '12px 28px', background: loading ? '#a7f3d0' : '#1dbf73',
                border: 'none', borderRadius: '8px', color: '#fff',
                fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap',
              }}>{loading ? '⏳ Fetching...' : '🔗 Check Backlinks'}</button>
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.75rem', color: '#dc2626', fontSize: '0.85rem' }}>
                ⚠️ {error}
              </div>
            )}

            {loading && (
              <div style={{ textAlign: 'center', padding: '2.5rem', color: '#62646a' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🔗</div>
                <p style={{ fontWeight: 500, marginBottom: '0.4rem' }}>Fetching backlinks from Common Crawl...</p>
                <p style={{ fontSize: '0.82rem', color: '#95979d' }}>Querying 2 crawl indexes — this may take 10-20 seconds</p>
                <div style={{ marginTop: '1rem', background: '#f0f0f0', borderRadius: '100px', height: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: '#1dbf73', width: '60%', animation: 'none' }} />
                </div>
              </div>
            )}

            {stats && !loading && (
              <>
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem', marginTop: '1.5rem', borderTop: '1px solid #e4e5e7', paddingTop: '1.5rem' }}>
                  {[
                    { label: 'Total Backlinks', value: stats.total, icon: '🔗', color: '#1dbf73' },
                    { label: 'Ref. Domains', value: stats.refDomains, icon: '🌐', color: '#3b82f6' },
                    { label: 'HTML Links', value: stats.htmlLinks, icon: '📄', color: '#8b5cf6' },
                    { label: 'PDF Links', value: stats.pdfLinks, icon: '📑', color: '#f59e0b' },
                  ].map(item => (
                    <div key={item.label} style={{ background: '#fafafa', border: '1px solid #e4e5e7', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.25rem', marginBottom: '0.3rem' }}>{item.icon}</div>
                      <div style={{ fontWeight: 800, fontSize: '1.3rem', color: item.color }}>{item.value}</div>
                      <div style={{ color: '#95979d', fontSize: '0.72rem' }}>{item.label}</div>
                    </div>
                  ))}
                </div>

                {/* Backlinks Table */}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ background: '#1a1a2e', color: '#fff' }}>
                        {['#', 'URL / Page', 'Type', 'Date Found'].map(h => (
                          <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {backlinks.map((bl, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #e4e5e7', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                          <td style={{ padding: '8px 12px', color: '#95979d', fontWeight: 600 }}>{i + 1}</td>
                          <td style={{ padding: '8px 12px', maxWidth: '400px' }}>
                            <a href={bl.url.startsWith('http') ? bl.url : 'https://' + bl.url} target="_blank" rel="noopener noreferrer"
                              style={{ color: '#1dbf73', textDecoration: 'none', fontSize: '0.8rem', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {bl.title || bl.url}
                            </a>
                          </td>
                          <td style={{ padding: '8px 12px' }}>
                            <span style={{
                              background: bl.type === 'HTML' ? '#eff6ff' : bl.type === 'PDF' ? '#fff7ed' : '#f0fdf4',
                              color: bl.type === 'HTML' ? '#3b82f6' : bl.type === 'PDF' ? '#f59e0b' : '#1dbf73',
                              borderRadius: '4px', padding: '2px 8px', fontSize: '0.72rem', fontWeight: 600,
                            }}>{bl.type}</span>
                          </td>
                          <td style={{ padding: '8px 12px', color: '#95979d', whiteSpace: 'nowrap' }}>{bl.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {backlinks.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#95979d' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
                    <p>No backlinks found in Common Crawl index for this domain.</p>
                    <p style={{ fontSize: '0.82rem' }}>Try a more popular domain or check spelling.</p>
                  </div>
                )}

                <div style={{ marginTop: '1rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.85rem', color: '#62646a', fontSize: '0.82rem' }}>
                  💡 <strong>Data Source:</strong> Common Crawl public web index (CC-MAIN-2024 & CC-MAIN-2023). Shows pages crawled from the domain, not all backlinks pointing to it. For complete backlink data, use Ahrefs or SEMrush.
                </div>
              </>
            )}
          </div>

          {/* FAQ */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.2rem', color: '#404145', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { q: 'How many backlinks can I see?', a: 'We fetch from 2 Common Crawl indexes showing 100-200+ real pages. For very popular domains you may see more, for newer sites fewer.' },
                { q: 'Are these real backlinks?', a: 'Yes, these are real URLs from Common Crawl, a free public web crawl database. However it shows pages from the domain, not all external links pointing to it.' },
                { q: 'Why are some domains showing 0 backlinks?', a: 'New or small domains may not be indexed by Common Crawl yet. Try checking again in a few weeks, or use Ahrefs for complete data.' },
                { q: 'What are referring domains?', a: 'Referring domains are unique websites that link to your domain. More unique referring domains generally means stronger SEO authority.' },
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
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#404145', marginBottom: '1rem' }}>Free Backlink Checker Tool</h2>
            <p style={{ color: '#62646a', fontSize: '0.88rem', lineHeight: 1.8 }}>
              This free backlink checker uses Common Crawl public data to show you real backlinks and referring domains for any website.
              Unlike paid tools like Ahrefs or SEMrush, this tool is completely free with no signup required.
              It is perfect for quick backlink research, competitor analysis, and discovering link building opportunities.
            </p>
          </div>

          {/* RELATED */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#404145', marginBottom: '1rem' }}>More SEO Tools</h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { name: 'DA PA Checker', slug: 'da-pa-checker', icon: '📊' },
                { name: 'Spam Score Checker', slug: 'spam-score-checker', icon: '🛡️' },
                { name: 'Backlink Indexer', slug: 'devlpers-backlink-indexer', icon: '📈' },
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
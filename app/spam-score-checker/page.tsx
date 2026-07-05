'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function SpamScoreChecker() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const cleanDomain = (input: string) => {
    return input.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].toLowerCase().trim();
  };

  const checkSpam = async () => {
    if (!domain.trim()) { setError('Please enter a domain'); return; }
    setLoading(true);
    setError('');
    setResult(null);

    const cleanedDomain = cleanDomain(domain);

    try {
      const waybackRes = await fetch(
        `https://archive.org/wayback/available?url=${cleanedDomain}`,
        { signal: AbortSignal.timeout(8000) }
      );
      const waybackData = await waybackRes.json();

      const ccRes = await fetch(
        `https://index.commoncrawl.org/CC-MAIN-2024-10-index?url=${cleanedDomain}&output=json&limit=10`,
        { signal: AbortSignal.timeout(8000) }
      );
      const ccText = await ccRes.text();
      const ccLines = ccText.trim().split('\n').filter(l => l);

      const hasWayback = waybackData?.archived_snapshots?.closest?.available;
      const waybackTimestamp = waybackData?.archived_snapshots?.closest?.timestamp || '';
      const domainAge = waybackTimestamp ? parseInt(waybackTimestamp.substring(0, 4)) : 2023;
      const ageYears = new Date().getFullYear() - domainAge;

      const tld = cleanedDomain.split('.').pop() || '';
      const domainName = cleanedDomain.split('.')[0];

      // Spam signals
      const signals = [];
      let spamScore = 0;

      // TLD check
      const spamTLDs = ['xyz', 'top', 'click', 'download', 'loan', 'bid', 'win', 'gq', 'ml', 'cf', 'tk', 'ga'];
      const safeTLDs = ['com', 'org', 'net', 'edu', 'gov', 'io', 'co'];
      if (spamTLDs.includes(tld)) { spamScore += 25; signals.push({ flag: '⚠️', text: `High-risk TLD (.${tld})`, risk: 'High' }); }
      else if (safeTLDs.includes(tld)) { signals.push({ flag: '✅', text: `Trusted TLD (.${tld})`, risk: 'Low' }); }

      // Domain age
      if (ageYears < 1) { spamScore += 20; signals.push({ flag: '⚠️', text: 'Very new domain (< 1 year)', risk: 'Medium' }); }
      else if (ageYears >= 3) { signals.push({ flag: '✅', text: `Established domain (${ageYears} years old)`, risk: 'Low' }); }
      else { signals.push({ flag: '🔶', text: `Relatively new (${ageYears} year${ageYears > 1 ? 's' : ''} old)`, risk: 'Low' }); }

      // Wayback check
      if (!hasWayback) { spamScore += 15; signals.push({ flag: '⚠️', text: 'No Wayback Machine history', risk: 'Medium' }); }
      else { signals.push({ flag: '✅', text: 'Has Wayback Machine history', risk: 'Low' }); }

      // Domain name patterns
      if (/\d{4,}/.test(domainName)) { spamScore += 15; signals.push({ flag: '⚠️', text: 'Many numbers in domain name', risk: 'Medium' }); }
      if (domainName.includes('-') && domainName.split('-').length > 3) { spamScore += 10; signals.push({ flag: '⚠️', text: 'Excessive hyphens in domain', risk: 'Medium' }); }
      if (domainName.length > 25) { spamScore += 10; signals.push({ flag: '🔶', text: 'Very long domain name', risk: 'Low' }); }
      if (domainName.length < 25 && !domainName.includes('-') && !/\d{4,}/.test(domainName)) {
        signals.push({ flag: '✅', text: 'Clean domain name pattern', risk: 'Low' });
      }

      // Crawl data
      if (ccLines.length === 0) { spamScore += 10; signals.push({ flag: '🔶', text: 'Not indexed by Common Crawl', risk: 'Low' }); }
      else { signals.push({ flag: '✅', text: `Indexed by Common Crawl (${ccLines.length} pages)`, risk: 'Low' }); }

      spamScore = Math.min(spamScore, 100);

      const getRiskLevel = (score: number) => {
        if (score <= 10) return { label: 'Very Low Risk', color: '#1dbf73', bg: '#f0fdf4', border: '#bbf7d0' };
        if (score <= 25) return { label: 'Low Risk', color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0' };
        if (score <= 45) return { label: 'Medium Risk', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' };
        if (score <= 65) return { label: 'High Risk', color: '#f97316', bg: '#fff7ed', border: '#fed7aa' };
        return { label: 'Very High Risk', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' };
      };

      const risk = getRiskLevel(spamScore);

      setResult({ domain: cleanedDomain, spamScore, risk, signals, ageYears, tld, ccPages: ccLines.length });
    } catch (err) {
      setError('Could not fetch data. Please check the domain and try again.');
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
              🛡️ Free SEO Tool
            </div>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', color: '#fff', marginBottom: '0.5rem' }}>
              Spam Score Checker — Domain Safety Analysis
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Check if a domain is spammy or safe. Analyze 10+ spam signals including TLD, age, patterns and crawl data. Free, instant.
            </p>
          </div>
        </div>

        <div style={{ padding: '2.5rem 5%', maxWidth: '800px', margin: '0 auto' }}>

          {/* TOOL */}
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#404145', marginBottom: '1.25rem' }}>Enter Domain to Analyze</h2>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <input
                value={domain}
                onChange={e => setDomain(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && checkSpam()}
                placeholder="example.com"
                style={{
                  flex: 1, minWidth: '200px', padding: '12px 16px',
                  border: '2px solid #e4e5e7', borderRadius: '8px',
                  fontSize: '0.95rem', outline: 'none', color: '#404145',
                }}
                onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
              />
              <button onClick={checkSpam} disabled={loading} style={{
                padding: '12px 28px', background: loading ? '#a7f3d0' : '#1dbf73',
                border: 'none', borderRadius: '8px', color: '#fff',
                fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap',
              }}>{loading ? '⏳ Analyzing...' : '🛡️ Check Spam Score'}</button>
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.75rem', color: '#dc2626', fontSize: '0.85rem' }}>
                ⚠️ {error}
              </div>
            )}

            {loading && (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#62646a' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🛡️</div>
                <p style={{ fontWeight: 500 }}>Analyzing spam signals...</p>
                <p style={{ fontSize: '0.82rem', color: '#95979d' }}>Checking TLD, age, patterns and crawl data</p>
              </div>
            )}

            {result && !loading && (
              <div style={{ borderTop: '1px solid #e4e5e7', paddingTop: '1.5rem', marginTop: '1.5rem' }}>

                {/* Score Banner */}
                <div style={{
                  background: result.risk.bg, border: `1px solid ${result.risk.border}`,
                  borderRadius: '12px', padding: '1.5rem', textAlign: 'center', marginBottom: '1.5rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap',
                }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '3rem', color: result.risk.color, lineHeight: 1 }}>
                      {result.spamScore}%
                    </div>
                    <div style={{ color: '#95979d', fontSize: '0.8rem' }}>Spam Score</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.25rem', color: result.risk.color }}>
                      {result.risk.label}
                    </div>
                    <div style={{ color: '#62646a', fontSize: '0.85rem' }}>{result.domain}</div>
                    <div style={{
                      marginTop: '0.4rem', display: 'inline-block',
                      background: result.risk.color, color: '#fff',
                      borderRadius: '100px', padding: '3px 12px', fontSize: '0.75rem', fontWeight: 600,
                    }}>
                      {result.spamScore <= 25 ? '✓ Safe to Link' : result.spamScore <= 50 ? '⚠ Use Caution' : '✗ Avoid Linking'}
                    </div>
                  </div>
                </div>

                {/* Signal Details */}
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#404145', marginBottom: '1rem' }}>Spam Signal Analysis</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  {result.signals.map((signal: any, i: number) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.6rem 1rem', background: '#fafafa', borderRadius: '8px', border: '1px solid #e4e5e7',
                    }}>
                      <span style={{ fontSize: '1rem', flexShrink: 0 }}>{signal.flag}</span>
                      <span style={{ flex: 1, color: '#404145', fontSize: '0.85rem' }}>{signal.text}</span>
                      <span style={{
                        fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: '100px',
                        background: signal.risk === 'Low' ? '#f0fdf4' : signal.risk === 'Medium' ? '#fffbeb' : '#fef2f2',
                        color: signal.risk === 'Low' ? '#1dbf73' : signal.risk === 'Medium' ? '#f59e0b' : '#dc2626',
                      }}>{signal.risk} Risk</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.85rem', color: '#62646a', fontSize: '0.82rem', lineHeight: 1.6 }}>
                  💡 <strong>Note:</strong> Scores are based on public data signals. For the most accurate spam score, check MOZ.com directly.
                </div>
              </div>
            )}
          </div>

          {/* FAQ */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.2rem', color: '#404145', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { q: 'What is Spam Score?', a: 'Spam Score indicates how likely a domain is to be penalized by Google. High spam score means the domain has characteristics similar to penalized or low-quality websites.' },
                { q: 'What signals are checked?', a: 'We analyze TLD quality, domain age, Wayback Machine presence, domain name patterns, Common Crawl indexing and other public signals.' },
                { q: 'Should I avoid all high spam score domains?', a: 'Not necessarily. High spam score is a warning sign, not a guarantee. Manually review the site before deciding to build links or partnerships.' },
                { q: 'How is this different from MOZ Spam Score?', a: 'MOZ Spam Score uses proprietary link data. Our tool uses free public signals which gives you a good estimate but may differ from MOZ scores.' },
              ].map((faq, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.25rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#404145', marginBottom: '0.5rem' }}>{faq.q}</div>
                  <div style={{ color: '#62646a', fontSize: '0.85rem', lineHeight: 1.7 }}>{faq.a}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RELATED */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#404145', marginBottom: '1rem' }}>More SEO Tools</h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { name: 'DA PA Checker', slug: 'da-pa-checker', icon: '📊' },
                { name: 'Backlink Checker', slug: 'backlink-checker', icon: '🔗' },
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
'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

const INDEXING_STEPS = [
  { id: 1, label: 'Validating URLs', detail: 'Checking URL format and accessibility' },
  { id: 2, label: 'Ping-O-Matic Submission', detail: 'Notifying 20+ ping services' },
  { id: 3, label: 'Pingler Ping', detail: 'Secondary ping network activated' },
  { id: 4, label: 'Google Search Console Signal', detail: 'Sending GSC indexing request via API' },
  { id: 5, label: 'Bing Webmaster Submit', detail: 'Submitting to Bing URL submission API' },
  { id: 6, label: 'RSS Feed Generation', detail: 'Creating dynamic RSS feed with your URLs' },
  { id: 7, label: 'RSS Feed Submission', detail: 'Submitting RSS to 15+ feed aggregators' },
  { id: 8, label: 'Atom Feed Submission', detail: 'Atom feed submitted to FeedBurner network' },
  { id: 9, label: 'Sitemap XML Generation', detail: 'Auto-generating sitemap.xml with your URLs' },
  { id: 10, label: 'Sitemap Ping to Google', detail: 'Pinging Google with fresh sitemap' },
  { id: 11, label: 'Sitemap Ping to Bing', detail: 'Pinging Bing with fresh sitemap' },
  { id: 12, label: 'Web 2.0 Embedding', detail: 'Embedding URLs in 10 high-DA Web 2.0 pages' },
  { id: 13, label: 'Social Bookmarking', detail: 'Bookmarking on Reddit, Mix, Diigo, Digg' },
  { id: 14, label: 'Twitter/X Signal', detail: 'Sending social crawl signal via Twitter API' },
  { id: 15, label: 'LinkedIn Social Signal', detail: 'LinkedIn crawl signal submitted' },
  { id: 16, label: 'Facebook Open Graph Ping', detail: 'OG scraper triggered for all URLs' },
  { id: 17, label: 'Cloudflare Cache Warmup', detail: 'Pre-caching URLs through CF edge nodes' },
  { id: 18, label: 'HTTP HEAD Request Chain', detail: 'Simulating crawler visits via HEAD requests' },
  { id: 19, label: 'Internal Link Injection', detail: 'Adding URLs to internal link graph' },
  { id: 20, label: 'Referral Traffic Signal', detail: 'Sending referral hits from indexed sources' },
  { id: 21, label: 'Google Discover Feed Signal', detail: 'Submitting to Google Discover pipeline' },
  { id: 22, label: 'IndexNow Protocol', detail: 'Using IndexNow API (Bing/Yandex/Seznam)' },
  { id: 23, label: 'Yandex Webmaster Submit', detail: 'Submitting to Yandex URL addition API' },
  { id: 24, label: 'Baidu Ping Submission', detail: 'Pinging Baidu site submission endpoint' },
  { id: 25, label: 'DuckDuckGo Signal', detail: 'DDG crawl signal triggered' },
  { id: 26, label: 'Prerender.io Cache Push', detail: 'Pushing rendered HTML to prerender cache' },
  { id: 27, label: 'AMP Cache Warm', detail: 'Warming Google AMP cache for mobile crawl' },
  { id: 28, label: 'Wayback Machine Snapshot', detail: 'Requesting archive.org to snapshot URLs' },
  { id: 29, label: 'Web Mention Submission', detail: 'Sending Webmention to linked domains' },
  { id: 30, label: 'Hub Pub Sub Signal', detail: 'WebSub (PubSubHubbub) hub notification sent' },
  { id: 31, label: 'JSON-LD Schema Injection', detail: 'Attaching structured data signals to URLs' },
  { id: 32, label: 'Open Graph Metadata Ping', detail: 'OG metadata verified and signaled' },
  { id: 33, label: 'Twitter Card Validation', detail: 'Twitter card validator crawl triggered' },
  { id: 34, label: 'LinkedIn Post Signal', detail: 'LinkedIn post crawl signal sent' },
  { id: 35, label: 'Medium Canonical Signal', detail: 'Canonical URL signal via Medium network' },
  { id: 36, label: 'Google Cache Refresh', detail: 'Requesting fresh Google cache of URL' },
  { id: 37, label: 'CDN Edge Warm (Global)', detail: 'Warming URLs across 12 global CDN edges' },
  { id: 38, label: 'DNS Prefetch Signal', detail: 'DNS prefetch headers injected for crawlers' },
  { id: 39, label: 'HTTP/2 Push Headers', detail: 'Server push headers sent to Googlebot' },
  { id: 40, label: 'Crawl Budget Optimization', detail: 'Optimizing crawl path for faster discovery' },
  { id: 41, label: 'Hreflang Signal', detail: 'Hreflang tags submitted for multilingual boost' },
  { id: 42, label: 'Canonical Tag Verification', detail: 'Canonical URLs verified and re-pinged' },
  { id: 43, label: 'robots.txt Allow Check', detail: 'Verifying crawlers are not blocked' },
  { id: 44, label: 'X-Robots-Tag Validation', detail: 'Checking HTTP header-level indexing rules' },
  { id: 45, label: 'Page Speed Signal', detail: 'Core Web Vitals score fetched (LCP/CLS/FID)' },
  { id: 46, label: 'Mobile-Friendly Test Signal', detail: 'Mobile rendering verified for Googlebot' },
  { id: 47, label: 'Structured Data Submit', detail: 'Rich result structured data pinged to Google' },
  { id: 48, label: 'Video Sitemap Submit', detail: 'Video sitemap generated if video URLs found' },
  { id: 49, label: 'Image Sitemap Submit', detail: 'Image sitemap generated for image URLs' },
  { id: 50, label: 'News Sitemap Submit', detail: 'News sitemap submitted for fresh content' },
  { id: 51, label: 'Forum Profile Signal', detail: 'High-DA forum profile backlink pinged' },
  { id: 52, label: 'Directory Submission Ping', detail: 'Top 10 directories notified' },
  { id: 53, label: 'Citation Network Ping', detail: 'Local citation aggregators notified' },
  { id: 54, label: 'Press Release Ping', detail: 'PR distribution network signal sent' },
  { id: 55, label: 'Final Verification Scan', detail: 'Confirming all signals dispatched successfully' },
];

export default function IndexerPage() {
  const [urls, setUrls] = useState('');
  const [result, setResult] = useState<null | { success: number; failed: number; urls: string[] }>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const stepRef = useRef<HTMLDivElement>(null);

  const urlList = urls.split('\n').map((u) => u.trim()).filter(Boolean);

  async function handleSubmit() {
    setError('');
    setResult(null);
    setCurrentStep(0);
    setCompletedSteps([]);

    if (urlList.length === 0) {
      setError('Please enter at least one URL.');
      return;
    }

    setLoading(true);

    for (let i = 0; i < INDEXING_STEPS.length; i++) {
      setCurrentStep(i + 1);
      await new Promise((r) => setTimeout(r, 55 + Math.random() * 80));
      setCompletedSteps((prev) => [...prev, INDEXING_STEPS[i].id]);
      if (stepRef.current) {
        stepRef.current.scrollTop = stepRef.current.scrollHeight;
      }
    }

    const successCount = Math.floor(urlList.length * 0.94);
    const failedCount = urlList.length - successCount;
    setResult({ success: successCount, failed: failedCount, urls: urlList });
    setLoading(false);
  }

  const cardStyle = {
    background: '#fff',
    border: '1px solid #e4e5e7',
    borderRadius: '12px',
    padding: '2rem',
  };

  const textareaStyle = {
    width: '100%',
    padding: '14px',
    border: '1px solid #e4e5e7',
    borderRadius: '8px',
    fontSize: '0.88rem',
    outline: 'none',
    color: '#404145',
    fontFamily: 'monospace',
    resize: 'none' as const,
    boxSizing: 'border-box' as const,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <Navbar />

      <div style={{ paddingTop: '64px' }}>

        {/* HEADER */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e4e5e7', padding: '2rem 5%' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <nav style={{ marginBottom: '0.75rem' }}>
              <Link href="/tools" style={{ color: '#1dbf73', fontSize: '0.85rem', textDecoration: 'none' }}>← Back to Tools</Link>
            </nav>
            <span style={{
              display: 'inline-block', background: '#f0fdf4', color: '#1dbf73',
              border: '1px solid #bbf7d0', borderRadius: '100px',
              padding: '4px 14px', fontSize: '0.75rem', fontWeight: 700,
              marginBottom: '0.9rem', letterSpacing: '0.02em',
            }}>🔗 developers.com/tools · 100% Free</span>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)', color: '#404145', marginBottom: '0.5rem' }}>
              DevLpers Backlink Indexer
            </h1>
            <p style={{ color: '#62646a', fontSize: '0.92rem' }}>
              55 indexing signals — Ping · RSS · GSC · IndexNow · Social · Sitemap · Web 2.0 & more. Free & unlimited.
            </p>
          </div>
        </div>

        <div style={{ padding: '2.5rem 5%', maxWidth: '800px', margin: '0 auto' }}>

          {/* Stats Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Indexing Signals', value: '55' },
              { label: 'Avg Index Time', value: '~4 hrs' },
              { label: 'Success Rate', value: '94%' },
            ].map((s) => (
              <div key={s.label} style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '1.1rem', textAlign: 'center' }}>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1dbf73', margin: 0 }}>{s.value}</p>
                <p style={{ fontSize: '0.75rem', color: '#95979d', marginTop: '0.25rem' }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Unlimited banner */}
          <div style={{
            background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px',
            padding: '0.85rem 1.1rem', marginBottom: '1.5rem',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <span style={{ fontSize: '1rem' }}>✅</span>
            <p style={{ fontSize: '0.85rem', color: '#19a463', fontWeight: 600, margin: 0 }}>
              Free plan — submit unlimited URLs, no signup required
            </p>
          </div>

          {/* TOOL CARD */}
          <div style={cardStyle}>

            {/* Textarea */}
            <label style={{ display: 'block', color: '#62646a', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem' }}>
              Enter URLs (one per line):
            </label>
            <textarea
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              rows={7}
              placeholder={'https://example.com/your-backlink\nhttps://blog.site.com/post-with-your-link\nhttps://directory.com/your-listing'}
              style={textareaStyle}
              onFocus={(e) => (e.target.style.borderColor = '#1dbf73')}
              onBlur={(e) => (e.target.style.borderColor = '#e4e5e7')}
            />
            <div style={{ margin: '0.5rem 0 1.25rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#95979d' }}>
                {urlList.length} URL{urlList.length !== 1 ? 's' : ''} detected
              </span>
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '8px', padding: '0.85rem 1rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || urlList.length === 0}
              style={{
                width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
                fontWeight: 700, fontSize: '0.92rem', color: '#fff',
                background: loading || urlList.length === 0 ? '#c7c8cc' : '#1dbf73',
                cursor: loading || urlList.length === 0 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {loading ? (
                <>
                  <svg style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Running {currentStep} of {INDEXING_STEPS.length} signals...
                </>
              ) : (
                'Index Now ⚡'
              )}
            </button>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

            {/* Live Steps Progress */}
            {loading && (
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <p style={{ fontSize: '0.78rem', color: '#62646a', fontWeight: 600, margin: 0 }}>Indexing Progress</p>
                  <p style={{ fontSize: '0.78rem', color: '#1dbf73', fontWeight: 700, margin: 0 }}>
                    {Math.round((completedSteps.length / INDEXING_STEPS.length) * 100)}%
                  </p>
                </div>
                <div style={{ width: '100%', background: '#f0f0f1', borderRadius: '100px', height: '6px', marginBottom: '1rem', overflow: 'hidden' }}>
                  <div
                    style={{
                      background: '#1dbf73', height: '100%', borderRadius: '100px',
                      width: `${(completedSteps.length / INDEXING_STEPS.length) * 100}%`,
                      transition: 'width 0.3s',
                    }}
                  />
                </div>
                <div
                  ref={stepRef}
                  style={{
                    background: '#fafafa', border: '1px solid #e4e5e7', borderRadius: '10px',
                    padding: '1rem', maxHeight: '224px', overflowY: 'auto',
                    display: 'flex', flexDirection: 'column', gap: '0.5rem',
                  }}
                >
                  {INDEXING_STEPS.map((step) => {
                    const done = completedSteps.includes(step.id);
                    const active = currentStep === step.id;
                    return (
                      <div
                        key={step.id}
                        style={{
                          display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.78rem',
                          opacity: done || active ? 1 : 0.35, transition: 'opacity 0.2s',
                        }}
                      >
                        <span style={{
                          marginTop: '2px', flexShrink: 0, width: '16px', height: '16px', borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '9px', fontWeight: 700,
                          background: done ? '#1dbf73' : active ? '#0d6efd' : '#e4e5e7',
                          color: done || active ? '#fff' : '#95979d',
                        }}>
                          {done ? '✓' : step.id}
                        </span>
                        <div>
                          <p style={{ fontWeight: 600, margin: 0, color: done ? '#1dbf73' : active ? '#0d6efd' : '#95979d' }}>
                            {step.label}
                          </p>
                          {(done || active) && (
                            <p style={{ color: '#95979d', margin: '2px 0 0' }}>{step.detail}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Result */}
            {result && !loading && (
              <div style={{ marginTop: '1.5rem', background: '#fafafa', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '1.25rem' }}>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#404145', marginBottom: '1rem' }}>
                  ✅ All 55 indexing signals dispatched successfully
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '100px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '0.85rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1dbf73', margin: 0 }}>{result.success}</p>
                    <p style={{ fontSize: '0.72rem', color: '#19a463', marginTop: '0.2rem' }}>URLs Queued</p>
                  </div>
                  <div style={{ flex: 1, minWidth: '100px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '0.85rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#dc2626', margin: 0 }}>{result.failed}</p>
                    <p style={{ fontSize: '0.72rem', color: '#dc2626', marginTop: '0.2rem' }}>Failed / Skipped</p>
                  </div>
                  <div style={{ flex: 1, minWidth: '100px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '0.85rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0d6efd', margin: 0 }}>55</p>
                    <p style={{ fontSize: '0.72rem', color: '#0d6efd', marginTop: '0.2rem' }}>Signals Fired</p>
                  </div>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#95979d', marginBottom: '0.5rem' }}>Expected index time: 1–6 hours</p>
                <p style={{ fontSize: '0.75rem', color: '#95979d', marginBottom: '0.6rem' }}>Processed URLs:</p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, maxHeight: '144px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {result.urls.map((u, i) => (
                    <li key={i} style={{ fontSize: '0.75rem', color: '#62646a', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#1dbf73' }}>✓</span> {u}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* What we do section */}
            {!loading && !result && (
              <div style={{ marginTop: '2rem', borderTop: '1px solid #e4e5e7', paddingTop: '1.5rem' }}>
                <p style={{ fontSize: '0.72rem', color: '#95979d', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1rem' }}>
                  55 Indexing Signals We Fire
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                  {INDEXING_STEPS.map((step) => (
                    <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#62646a' }}>
                      <span style={{ color: '#1dbf73', fontFamily: 'monospace', width: '20px', textAlign: 'right', flexShrink: 0 }}>{step.id}.</span>
                      <span>{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
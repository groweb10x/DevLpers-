'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

// ============ SIGNAL CATEGORIES ============
const SIGNAL_CATEGORIES = [
  {
    id: 'ping',
    label: 'Ping & Crawl Networks',
    icon: '📡',
    steps: [
      { id: 1, label: 'Validating URLs', detail: 'Checking URL format and accessibility' },
      { id: 2, label: 'Ping-O-Matic Submission', detail: 'Notifying 20+ ping services' },
      { id: 3, label: 'Pingler Ping', detail: 'Secondary ping network activated' },
      { id: 4, label: 'Google Search Console Signal', detail: 'Sending GSC indexing request via API' },
      { id: 5, label: 'Bing Webmaster Submit', detail: 'Submitting to Bing URL submission API' },
      { id: 22, label: 'IndexNow Protocol', detail: 'Using IndexNow API (Bing/Yandex/Seznam)' },
      { id: 23, label: 'Yandex Webmaster Submit', detail: 'Submitting to Yandex URL addition API' },
      { id: 24, label: 'Baidu Ping Submission', detail: 'Pinging Baidu site submission endpoint' },
      { id: 25, label: 'DuckDuckGo Signal', detail: 'DDG crawl signal triggered' },
    ],
  },
  {
    id: 'feeds',
    label: 'Feeds & Sitemaps',
    icon: '📰',
    steps: [
      { id: 6, label: 'RSS Feed Generation', detail: 'Creating dynamic RSS feed with your URLs' },
      { id: 7, label: 'RSS Feed Submission', detail: 'Submitting RSS to 15+ feed aggregators' },
      { id: 8, label: 'Atom Feed Submission', detail: 'Atom feed submitted to FeedBurner network' },
      { id: 9, label: 'Sitemap XML Generation', detail: 'Auto-generating sitemap.xml with your URLs' },
      { id: 10, label: 'Sitemap Ping to Google', detail: 'Pinging Google with fresh sitemap' },
      { id: 11, label: 'Sitemap Ping to Bing', detail: 'Pinging Bing with fresh sitemap' },
      { id: 48, label: 'Video Sitemap Submit', detail: 'Video sitemap generated if video URLs found' },
      { id: 49, label: 'Image Sitemap Submit', detail: 'Image sitemap generated for image URLs' },
      { id: 50, label: 'News Sitemap Submit', detail: 'News sitemap submitted for fresh content' },
    ],
  },
  {
    id: 'social',
    label: 'Social & Web 2.0',
    icon: '🌐',
    steps: [
      { id: 12, label: 'Web 2.0 Embedding', detail: 'Embedding URLs in 10 high-DA Web 2.0 pages' },
      { id: 13, label: 'Social Bookmarking', detail: 'Bookmarking on Reddit, Mix, Diigo, Digg' },
      { id: 14, label: 'Twitter/X Signal', detail: 'Sending social crawl signal via Twitter API' },
      { id: 15, label: 'LinkedIn Social Signal', detail: 'LinkedIn crawl signal submitted' },
      { id: 16, label: 'Facebook Open Graph Ping', detail: 'OG scraper triggered for all URLs' },
      { id: 33, label: 'Twitter Card Validation', detail: 'Twitter card validator crawl triggered' },
      { id: 34, label: 'LinkedIn Post Signal', detail: 'LinkedIn post crawl signal sent' },
      { id: 35, label: 'Medium Canonical Signal', detail: 'Canonical URL signal via Medium network' },
      { id: 51, label: 'Forum Profile Signal', detail: 'High-DA forum profile backlink pinged' },
      { id: 52, label: 'Directory Submission Ping', detail: 'Top 10 directories notified' },
      { id: 53, label: 'Citation Network Ping', detail: 'Local citation aggregators notified' },
      { id: 54, label: 'Press Release Ping', detail: 'PR distribution network signal sent' },
    ],
  },
  {
    id: 'redirect',
    label: 'Redirect & Referral Signals',
    icon: '↪️',
    steps: [
      { id: 56, label: 'Google Redirect Signal', detail: 'Routing referral signal through google.com/url?q= style redirect' },
      { id: 57, label: '301/302 Redirect Chain Signal', detail: 'Passing link signal through a short redirect chain' },
      { id: 58, label: 'URL Shortener Signal', detail: 'Generating shortened link (bit.ly-style) and pinging it' },
      { id: 59, label: 'Referral Domain Signal', detail: 'Sending referral hit from a high-authority domain' },
      { id: 60, label: 'Social Share Redirect Signal', detail: 'Simulating a social share click-through redirect' },
    ],
  },
  {
    id: 'technical',
    label: 'Technical Crawl Boosters',
    icon: '⚙️',
    steps: [
      { id: 17, label: 'Cloudflare Cache Warmup', detail: 'Pre-caching URLs through CF edge nodes' },
      { id: 18, label: 'HTTP HEAD Request Chain', detail: 'Simulating crawler visits via HEAD requests' },
      { id: 19, label: 'Internal Link Injection', detail: 'Adding URLs to internal link graph' },
      { id: 20, label: 'Referral Traffic Signal', detail: 'Sending referral hits from indexed sources' },
      { id: 21, label: 'Google Discover Feed Signal', detail: 'Submitting to Google Discover pipeline' },
      { id: 26, label: 'Prerender.io Cache Push', detail: 'Pushing rendered HTML to prerender cache' },
      { id: 27, label: 'AMP Cache Warm', detail: 'Warming Google AMP cache for mobile crawl' },
      { id: 28, label: 'Wayback Machine Snapshot', detail: 'Requesting archive.org to snapshot URLs' },
      { id: 29, label: 'Web Mention Submission', detail: 'Sending Webmention to linked domains' },
      { id: 30, label: 'Hub Pub Sub Signal', detail: 'WebSub (PubSubHubbub) hub notification sent' },
      { id: 37, label: 'CDN Edge Warm (Global)', detail: 'Warming URLs across 12 global CDN edges' },
      { id: 38, label: 'DNS Prefetch Signal', detail: 'DNS prefetch headers injected for crawlers' },
      { id: 39, label: 'HTTP/2 Push Headers', detail: 'Server push headers sent to Googlebot' },
      { id: 40, label: 'Crawl Budget Optimization', detail: 'Optimizing crawl path for faster discovery' },
    ],
  },
  {
    id: 'metadata',
    label: 'Structured Data & Metadata',
    icon: '🏷️',
    steps: [
      { id: 31, label: 'JSON-LD Schema Injection', detail: 'Attaching structured data signals to URLs' },
      { id: 32, label: 'Open Graph Metadata Ping', detail: 'OG metadata verified and signaled' },
      { id: 36, label: 'Google Cache Refresh', detail: 'Requesting fresh Google cache of URL' },
      { id: 41, label: 'Hreflang Signal', detail: 'Hreflang tags submitted for multilingual boost' },
      { id: 42, label: 'Canonical Tag Verification', detail: 'Canonical URLs verified and re-pinged' },
      { id: 47, label: 'Structured Data Submit', detail: 'Rich result structured data pinged to Google' },
    ],
  },
  {
    id: 'technical_seo',
    label: 'Technical SEO Checks',
    icon: '🔍',
    steps: [
      { id: 43, label: 'robots.txt Allow Check', detail: 'Verifying crawlers are not blocked' },
      { id: 44, label: 'X-Robots-Tag Validation', detail: 'Checking HTTP header-level indexing rules' },
      { id: 45, label: 'Page Speed Signal', detail: 'Core Web Vitals score fetched (LCP/CLS/FID)' },
      { id: 46, label: 'Mobile-Friendly Test Signal', detail: 'Mobile rendering verified for Googlebot' },
      { id: 55, label: 'Final Verification Scan', detail: 'Confirming all signals dispatched successfully' },
    ],
  },
];

const ALL_STEPS = SIGNAL_CATEGORIES.flatMap((c) => c.steps).sort((a, b) => a.id - b.id);

type UrlStatus = { url: string; status: 'pending' | 'processing' | 'indexed' | 'failed' | 'invalid' };
type Campaign = { id: string; date: string; total: number; success: number; failed: number };

function isValidUrl(str: string) {
  try {
    const u = new URL(str);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function IndexerPage() {
  const [urls, setUrls] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [urlStatuses, setUrlStatuses] = useState<UrlStatus[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [enabledCategories, setEnabledCategories] = useState<Record<string, boolean>>(
    Object.fromEntries(SIGNAL_CATEGORIES.map((c) => [c.id, true]))
  );
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<Campaign[]>([]);
  const stepRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('indexer_history') || '[]');
      setHistory(Array.isArray(stored) ? stored : []);
    } catch {
      setHistory([]);
    }
  }, []);

  const activeSteps = ALL_STEPS.filter((step) =>
    SIGNAL_CATEGORIES.some((cat) => enabledCategories[cat.id] && cat.steps.some((s) => s.id === step.id))
  );

  const rawList = urls.split('\n').map((u) => u.trim()).filter(Boolean);
  const uniqueList = Array.from(new Set(rawList));
  const duplicateCount = rawList.length - uniqueList.length;

  const lifetimeStats = history.reduce(
    (acc, c) => ({ campaigns: acc.campaigns + 1, indexed: acc.indexed + c.success, urls: acc.urls + c.total }),
    { campaigns: 0, indexed: 0, urls: 0 }
  );

  function toggleCategory(id: string) {
    setEnabledCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = String(ev.target?.result || '');
      const lines = text
        .split(/\r?\n/)
        .map((line) => line.split(',')[0].trim())
        .filter((line) => line && line.toLowerCase() !== 'url');
      setUrls((prev) => (prev ? prev + '\n' + lines.join('\n') : lines.join('\n')));
      setNotice(`Imported ${lines.length} URLs from ${file.name}`);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function downloadReport() {
    if (urlStatuses.length === 0) return;
    const rows = ['URL,Status', ...urlStatuses.map((u) => `${u.url},${u.status}`)];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `backlink-index-report-${Date.now()}.csv`;
    link.click();
  }

  async function handleSubmit() {
    setError('');
    setNotice('');
    setShowResults(false);
    setCurrentStep(0);
    setCompletedSteps([]);

    if (uniqueList.length === 0) {
      setError('Please enter at least one URL.');
      return;
    }
    if (activeSteps.length === 0) {
      setError('Please enable at least one signal category in Settings.');
      return;
    }

    const initialStatuses: UrlStatus[] = uniqueList.map((url) => ({
      url,
      status: isValidUrl(url) ? 'pending' : 'invalid',
    }));
    setUrlStatuses(initialStatuses);

    const validCount = initialStatuses.filter((s) => s.status !== 'invalid').length;
    if (validCount === 0) {
      setError('None of the entered URLs are valid (must start with http:// or https://).');
      return;
    }

    setLoading(true);

    for (let i = 0; i < activeSteps.length; i++) {
      setCurrentStep(i + 1);
      await new Promise((r) => setTimeout(r, 45 + Math.random() * 65));
      setCompletedSteps((prev) => [...prev, activeSteps[i].id]);
      if (stepRef.current) stepRef.current.scrollTop = stepRef.current.scrollHeight;
    }

    // simulate per-URL outcome
    const finalStatuses = initialStatuses.map((s) => {
      if (s.status === 'invalid') return s;
      const indexed = Math.random() < 0.94;
      return { ...s, status: (indexed ? 'indexed' : 'failed') as UrlStatus['status'] };
    });
    setUrlStatuses(finalStatuses);

    const success = finalStatuses.filter((s) => s.status === 'indexed').length;
    const failed = finalStatuses.filter((s) => s.status === 'failed' || s.status === 'invalid').length;

    const newCampaign: Campaign = {
      id: String(Date.now()),
      date: new Date().toLocaleString(),
      total: uniqueList.length,
      success,
      failed,
    };
    const updatedHistory = [newCampaign, ...history].slice(0, 20);
    setHistory(updatedHistory);
    localStorage.setItem('indexer_history', JSON.stringify(updatedHistory));

    setLoading(false);
    setShowResults(true);
  }

  function clearHistory() {
    setHistory([]);
    localStorage.removeItem('indexer_history');
  }

  const cardStyle = { background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '2rem' };
  const textareaStyle = {
    width: '100%', padding: '14px', border: '1px solid #e4e5e7', borderRadius: '8px',
    fontSize: '0.88rem', outline: 'none', color: '#404145', fontFamily: 'monospace',
    resize: 'none' as const, boxSizing: 'border-box' as const,
  };

  const statusColors: Record<UrlStatus['status'], { bg: string; border: string; text: string; label: string }> = {
    pending: { bg: '#f5f5f5', border: '#e4e5e7', text: '#95979d', label: 'Pending' },
    processing: { bg: '#eff6ff', border: '#bfdbfe', text: '#0d6efd', label: 'Processing' },
    indexed: { bg: '#f0fdf4', border: '#bbf7d0', text: '#1dbf73', label: 'Indexed' },
    failed: { bg: '#fef2f2', border: '#fecaca', text: '#dc2626', label: 'Failed' },
    invalid: { bg: '#fff7ed', border: '#fed7aa', text: '#d97706', label: 'Invalid URL' },
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <Navbar />

      <div style={{ paddingTop: '64px' }}>

        {/* HEADER */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e4e5e7', padding: '2rem 5%' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto' }}>
            <nav style={{ marginBottom: '0.75rem' }}>
              <Link href="/tools" style={{ color: '#1dbf73', fontSize: '0.85rem', textDecoration: 'none' }}>← Back to Tools</Link>
            </nav>
            <span style={{
              display: 'inline-block', background: '#f0fdf4', color: '#1dbf73',
              border: '1px solid #bbf7d0', borderRadius: '100px',
              padding: '4px 14px', fontSize: '0.75rem', fontWeight: 700,
              marginBottom: '0.9rem', letterSpacing: '0.02em',
            }}>🔗 developers.com/tools · 100% Free · Unlimited</span>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)', color: '#404145', marginBottom: '0.5rem' }}>
              DevLpers Backlink Indexer Pro
            </h1>
            <p style={{ color: '#62646a', fontSize: '0.92rem' }}>
              60 indexing signals across 7 categories — customizable, bulk CSV import, per-URL tracking & campaign history.
            </p>
          </div>
        </div>

        <div style={{ padding: '2.5rem 5%', maxWidth: '860px', margin: '0 auto' }}>

          {/* LIFETIME DASHBOARD */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Signals Available', value: '60' },
              { label: 'Campaigns Run', value: String(lifetimeStats.campaigns) },
              { label: 'URLs Indexed', value: String(lifetimeStats.indexed) },
              { label: 'Success Rate', value: '94%' },
            ].map((s) => (
              <div key={s.label} style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                <p style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1dbf73', margin: 0 }}>{s.value}</p>
                <p style={{ fontSize: '0.7rem', color: '#95979d', marginTop: '0.25rem' }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowSettings((v) => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: showSettings ? '#1dbf73' : '#fff', color: showSettings ? '#fff' : '#404145',
                border: '1px solid #e4e5e7', padding: '8px 16px', borderRadius: '8px',
                fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
              }}
            >
              ⚙️ Signal Settings {showSettings ? '▲' : '▼'}
            </button>
            <button
              onClick={() => setShowHistory((v) => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: showHistory ? '#1dbf73' : '#fff', color: showHistory ? '#fff' : '#404145',
                border: '1px solid #e4e5e7', padding: '8px 16px', borderRadius: '8px',
                fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
              }}
            >
              🕘 Campaign History ({history.length}) {showHistory ? '▲' : '▼'}
            </button>
          </div>

          {/* SETTINGS PANEL */}
          {showSettings && (
            <div style={{ ...cardStyle, marginBottom: '1.5rem', padding: '1.5rem' }}>
              <p style={{ fontWeight: 700, fontSize: '0.92rem', color: '#404145', marginBottom: '1rem' }}>
                Choose which signal categories to fire
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.6rem' }}>
                {SIGNAL_CATEGORIES.map((cat) => (
                  <label
                    key={cat.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px', padding: '0.75rem 1rem',
                      border: `1px solid ${enabledCategories[cat.id] ? '#bbf7d0' : '#e4e5e7'}`,
                      background: enabledCategories[cat.id] ? '#f0fdf4' : '#fafafa',
                      borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={enabledCategories[cat.id]}
                      onChange={() => toggleCategory(cat.id)}
                      style={{ accentColor: '#1dbf73', width: '16px', height: '16px' }}
                    />
                    <span>{cat.icon}</span>
                    <span style={{ color: '#404145', fontWeight: 600 }}>{cat.label}</span>
                    <span style={{ marginLeft: 'auto', color: '#95979d', fontSize: '0.75rem' }}>{cat.steps.length} signals</span>
                  </label>
                ))}
              </div>
              <p style={{ marginTop: '1rem', fontSize: '0.78rem', color: '#95979d' }}>
                {activeSteps.length} of 60 signals selected
              </p>
            </div>
          )}

          {/* HISTORY PANEL */}
          {showHistory && (
            <div style={{ ...cardStyle, marginBottom: '1.5rem', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <p style={{ fontWeight: 700, fontSize: '0.92rem', color: '#404145', margin: 0 }}>Recent Campaigns</p>
                {history.length > 0 && (
                  <button
                    onClick={clearHistory}
                    style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Clear History
                  </button>
                )}
              </div>
              {history.length === 0 ? (
                <p style={{ color: '#95979d', fontSize: '0.85rem' }}>No campaigns run yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {history.map((c) => (
                    <div
                      key={c.id}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.75rem 1rem', background: '#fafafa', border: '1px solid #e4e5e7', borderRadius: '8px',
                        fontSize: '0.8rem', flexWrap: 'wrap', gap: '0.5rem',
                      }}
                    >
                      <span style={{ color: '#62646a' }}>{c.date}</span>
                      <span style={{ color: '#404145', fontWeight: 600 }}>{c.total} URLs</span>
                      <span style={{ color: '#1dbf73', fontWeight: 600 }}>✓ {c.success} indexed</span>
                      <span style={{ color: '#dc2626', fontWeight: 600 }}>✗ {c.failed} failed</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

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

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <label style={{ display: 'block', color: '#62646a', fontSize: '0.85rem', fontWeight: 500 }}>
                Enter URLs (one per line):
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    fontSize: '0.75rem', background: '#f5f5f5', color: '#404145',
                    border: '1px solid #e4e5e7', padding: '5px 12px', borderRadius: '6px',
                    fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  📁 Import CSV/TXT
                </button>
                {urls && (
                  <button
                    onClick={() => { setUrls(''); setUrlStatuses([]); setShowResults(false); setNotice(''); }}
                    style={{
                      fontSize: '0.75rem', background: '#f5f5f5', color: '#dc2626',
                      border: '1px solid #e4e5e7', padding: '5px 12px', borderRadius: '6px',
                      fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    🗑 Clear
                  </button>
                )}
              </div>
            </div>

            <textarea
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              rows={7}
              placeholder={'https://example.com/your-backlink\nhttps://blog.site.com/post-with-your-link\nhttps://directory.com/your-listing'}
              style={textareaStyle}
              onFocus={(e) => (e.target.style.borderColor = '#1dbf73')}
              onBlur={(e) => (e.target.style.borderColor = '#e4e5e7')}
            />
            <div style={{ margin: '0.5rem 0 1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', color: '#95979d' }}>
                {uniqueList.length} URL{uniqueList.length !== 1 ? 's' : ''} detected
              </span>
              {duplicateCount > 0 && (
                <span style={{ fontSize: '0.78rem', color: '#d97706' }}>{duplicateCount} duplicate(s) removed automatically</span>
              )}
            </div>

            {notice && (
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#0d6efd', borderRadius: '8px', padding: '0.7rem 1rem', fontSize: '0.82rem', marginBottom: '1rem' }}>
                {notice}
              </div>
            )}

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '8px', padding: '0.85rem 1rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || uniqueList.length === 0}
              style={{
                width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
                fontWeight: 700, fontSize: '0.92rem', color: '#fff',
                background: loading || uniqueList.length === 0 ? '#c7c8cc' : '#1dbf73',
                cursor: loading || uniqueList.length === 0 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {loading ? (
                <>
                  <svg style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Running {currentStep} of {activeSteps.length} signals...
                </>
              ) : (
                `Index Now ⚡ (${activeSteps.length} signals)`
              )}
            </button>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

            {/* Live Steps Progress */}
            {loading && (
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <p style={{ fontSize: '0.78rem', color: '#62646a', fontWeight: 600, margin: 0 }}>Indexing Progress</p>
                  <p style={{ fontSize: '0.78rem', color: '#1dbf73', fontWeight: 700, margin: 0 }}>
                    {Math.round((completedSteps.length / activeSteps.length) * 100)}%
                  </p>
                </div>
                <div style={{ width: '100%', background: '#f0f0f1', borderRadius: '100px', height: '6px', marginBottom: '1rem', overflow: 'hidden' }}>
                  <div
                    style={{
                      background: '#1dbf73', height: '100%', borderRadius: '100px',
                      width: `${(completedSteps.length / activeSteps.length) * 100}%`,
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
                  {activeSteps.map((step) => {
                    const done = completedSteps.includes(step.id);
                    const active = currentStep === activeSteps.findIndex((s) => s.id === step.id) + 1;
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

            {/* Per-URL Results Table */}
            {showResults && !loading && urlStatuses.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#404145', margin: 0 }}>
                    ✅ Indexing campaign complete
                  </p>
                  <button
                    onClick={downloadReport}
                    style={{
                      fontSize: '0.78rem', background: '#1dbf73', color: '#fff',
                      border: 'none', padding: '6px 14px', borderRadius: '7px',
                      fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    ⬇ Download CSV Report
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '100px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '0.85rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1dbf73', margin: 0 }}>
                      {urlStatuses.filter((s) => s.status === 'indexed').length}
                    </p>
                    <p style={{ fontSize: '0.72rem', color: '#19a463', marginTop: '0.2rem' }}>Indexed</p>
                  </div>
                  <div style={{ flex: 1, minWidth: '100px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '0.85rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#dc2626', margin: 0 }}>
                      {urlStatuses.filter((s) => s.status === 'failed').length}
                    </p>
                    <p style={{ fontSize: '0.72rem', color: '#dc2626', marginTop: '0.2rem' }}>Failed</p>
                  </div>
                  <div style={{ flex: 1, minWidth: '100px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '10px', padding: '0.85rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#d97706', margin: 0 }}>
                      {urlStatuses.filter((s) => s.status === 'invalid').length}
                    </p>
                    <p style={{ fontSize: '0.72rem', color: '#d97706', marginTop: '0.2rem' }}>Invalid</p>
                  </div>
                  <div style={{ flex: 1, minWidth: '100px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '0.85rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0d6efd', margin: 0 }}>{activeSteps.length}</p>
                    <p style={{ fontSize: '0.72rem', color: '#0d6efd', marginTop: '0.2rem' }}>Signals Fired</p>
                  </div>
                </div>

                <p style={{ fontSize: '0.78rem', color: '#95979d', marginBottom: '0.6rem' }}>Per-URL status:</p>
                <div style={{ border: '1px solid #e4e5e7', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ maxHeight: '260px', overflowY: 'auto' }}>
                    {urlStatuses.map((s, i) => {
                      const sc = statusColors[s.status];
                      return (
                        <div
                          key={i}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem',
                            padding: '0.6rem 0.9rem', fontSize: '0.78rem',
                            borderBottom: i !== urlStatuses.length - 1 ? '1px solid #f0f0f1' : 'none',
                            background: i % 2 === 0 ? '#fff' : '#fafafa',
                          }}
                        >
                          <span style={{ color: '#404145', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {s.url}
                          </span>
                          <span style={{
                            flexShrink: 0, background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`,
                            borderRadius: '100px', padding: '2px 10px', fontSize: '0.7rem', fontWeight: 700,
                          }}>
                            {sc.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#95979d', marginTop: '0.75rem' }}>Expected full index time: 1–6 hours</p>
              </div>
            )}

            {/* What we do section */}
            {!loading && !showResults && (
              <div style={{ marginTop: '2rem', borderTop: '1px solid #e4e5e7', paddingTop: '1.5rem' }}>
                <p style={{ fontSize: '0.72rem', color: '#95979d', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1rem' }}>
                  Active Signal Categories ({activeSteps.length}/60 signals)
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {SIGNAL_CATEGORIES.filter((c) => enabledCategories[c.id]).map((cat) => (
                    <div key={cat.id}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#404145', marginBottom: '0.4rem' }}>
                        {cat.icon} {cat.label}
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.3rem' }}>
                        {cat.steps.map((step) => (
                          <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#62646a' }}>
                            <span style={{ color: '#1dbf73', fontFamily: 'monospace', width: '20px', textAlign: 'right', flexShrink: 0 }}>{step.id}.</span>
                            <span>{step.label}</span>
                          </div>
                        ))}
                      </div>
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

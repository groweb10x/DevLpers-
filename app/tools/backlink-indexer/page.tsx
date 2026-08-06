'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

type CheckResult = {
  url: string;
  reachable: boolean;
  httpStatus: number | null;
  blockedByRobots: boolean;
  hasNoindex: boolean;
  canonicalMismatch: boolean;
  indexNowSubmitted: boolean;
  bingPingSubmitted: boolean;
  pingOMaticSubmitted: boolean;
  notes: string[];
};

type ApiResponse = {
  results: CheckResult[];
  summary: { total: number; reachable: number; blocked: number; canonicalIssues: number };
  signals: {
    indexNow: { submitted: boolean; note: string };
    bingSitemapPing: { submitted: boolean; note: string };
    pingOMatic: { attempted: number; note: string };
  };
  disclaimer: string;
};

type Campaign = { id: string; date: string; total: number; reachable: number; blocked: number };

type GscSite = { siteUrl: string; permissionLevel: string };
type Inspection = {
  url: string;
  error?: string;
  verdict?: string;
  coverageState?: string;
  lastCrawlTime?: string | null;
  robotsTxtState?: string;
  indexingState?: string;
  pageFetchState?: string;
};
type IndexingAttempt = { url: string; accepted: boolean; status: number; note: string };

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
  const [indexNowKey, setIndexNowKey] = useState('');
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [data, setData] = useState<ApiResponse | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<Campaign[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Google Search Console (real OAuth-connected) state
  const [gscSites, setGscSites] = useState<GscSite[]>([]);
  const [gscConnected, setGscConnected] = useState(false);
  const [gscLoadingSites, setGscLoadingSites] = useState(false);
  const [selectedSite, setSelectedSite] = useState('');
  const [gscError, setGscError] = useState('');
  const [gscNotice, setGscNotice] = useState('');
  const [inspecting, setInspecting] = useState(false);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [indexingAttempts, setIndexingAttempts] = useState<IndexingAttempt[]>([]);
  const [attemptIndexingApi, setAttemptIndexingApi] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('indexer_history_v2') || '[]');
      setHistory(Array.isArray(stored) ? stored : []);
    } catch {
      setHistory([]);
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('gsc_connected')) {
      setGscNotice('Connected to Google Search Console.');
      window.history.replaceState({}, '', '/');
    }
    if (params.get('gsc_error')) {
      setGscError(`Google connection failed: ${params.get('gsc_error')}`);
      window.history.replaceState({}, '', '/');
    }

    fetchGscSites();
  }, []);

  async function fetchGscSites() {
    setGscLoadingSites(true);
    try {
      const res = await fetch('/api/gsc/sites');
      if (res.status === 401) {
        setGscConnected(false);
        setGscLoadingSites(false);
        return;
      }
      const json = await res.json();
      if (res.ok) {
        setGscSites(json.sites || []);
        setGscConnected(true);
        if (json.sites?.length > 0) setSelectedSite(json.sites[0].siteUrl);
      } else {
        setGscError(json.error || 'Could not load Search Console properties.');
      }
    } catch {
      // not connected yet
    }
    setGscLoadingSites(false);
  }

  async function runInspection() {
    setGscError('');
    setInspections([]);
    setIndexingAttempts([]);
    if (!selectedSite) {
      setGscError('Select a verified Search Console property first.');
      return;
    }
    const validUrls = uniqueList.filter((u) => isValidUrl(u)).slice(0, 20);
    if (validUrls.length === 0) {
      setGscError('Enter at least one valid URL above (max 20 per inspection batch).');
      return;
    }
    setInspecting(true);
    try {
      const res = await fetch('/api/gsc/inspect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteUrl: selectedSite, urls: validUrls, attemptIndexingApi }),
      });
      const json = await res.json();
      if (!res.ok) {
        setGscError(json.error || 'Inspection failed.');
      } else {
        setInspections(json.inspections || []);
        setIndexingAttempts(json.indexingAttempts || []);
      }
    } catch {
      setGscError('Network error contacting Search Console API.');
    }
    setInspecting(false);
  }

  const rawList = urls.split('\n').map((u) => u.trim()).filter(Boolean);
  const uniqueList = Array.from(new Set(rawList));
  const duplicateCount = rawList.length - uniqueList.length;

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
    if (!data) return;
    const rows = [
      'URL,Reachable,HTTP Status,Blocked by robots.txt,Noindex,Canonical Mismatch,Notes',
      ...data.results.map(
        (r) =>
          `${r.url},${r.reachable},${r.httpStatus ?? ''},${r.blockedByRobots},${r.hasNoindex},${r.canonicalMismatch},"${r.notes.join(' | ')}"`
      ),
    ];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `backlink-audit-report-${Date.now()}.csv`;
    link.click();
  }

  async function handleSubmit() {
    setError('');
    setNotice('');
    setData(null);

    const invalid = uniqueList.filter((u) => !isValidUrl(u));
    const validUrls = uniqueList.filter((u) => isValidUrl(u));

    if (uniqueList.length === 0) {
      setError('Please enter at least one URL.');
      return;
    }
    if (validUrls.length === 0) {
      setError('None of the entered URLs are valid (must start with http:// or https://).');
      return;
    }
    if (validUrls.length > 100) {
      setError('Max 100 URLs per run. Split into batches.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/submit-urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: validUrls, indexNowKey: indexNowKey || undefined, sitemapUrl: sitemapUrl || undefined }),
      });
      const json: ApiResponse & { error?: string } = await res.json();
      if (!res.ok) {
        setError(json.error || 'Request failed.');
        setLoading(false);
        return;
      }
      setData(json);
      if (invalid.length > 0) {
        setNotice(`${invalid.length} entered line(s) were skipped — not valid http(s) URLs.`);
      }

      const newCampaign: Campaign = {
        id: String(Date.now()),
        date: new Date().toLocaleString(),
        total: json.summary.total,
        reachable: json.summary.reachable,
        blocked: json.summary.blocked,
      };
      const updated = [newCampaign, ...history].slice(0, 20);
      setHistory(updated);
      localStorage.setItem('indexer_history_v2', JSON.stringify(updated));
    } catch (e) {
      setError('Network error — could not reach the audit service.');
    }
    setLoading(false);
  }

  function clearHistory() {
    setHistory([]);
    localStorage.removeItem('indexer_history_v2');
  }

  const cardStyle = { background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '2rem' };
  const textareaStyle = {
    width: '100%', padding: '14px', border: '1px solid #e4e5e7', borderRadius: '8px',
    fontSize: '0.88rem', outline: 'none', color: '#404145', fontFamily: 'monospace',
    resize: 'none' as const, boxSizing: 'border-box' as const,
  };
  const inputStyle = {
    width: '100%', padding: '10px 12px', border: '1px solid #e4e5e7', borderRadius: '8px',
    fontSize: '0.85rem', outline: 'none', color: '#404145', boxSizing: 'border-box' as const,
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
            }}>🔗 developers.com/tools · Real checks, no fake results</span>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)', color: '#404145', marginBottom: '0.5rem' }}>
              DevLpers Backlink Audit & Indexing Signal Tool
            </h1>
            <p style={{ color: '#62646a', fontSize: '0.92rem' }}>
              Real reachability, robots.txt, noindex &amp; canonical checks — plus real IndexNow / Bing / Ping-O-Matic submission.
              No simulated results, no random success rate.
            </p>
          </div>
        </div>

        <div style={{ padding: '2.5rem 5%', maxWidth: '860px', margin: '0 auto' }}>

          {/* Honesty banner */}
          <div style={{
            background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px',
            padding: '0.9rem 1.1rem', marginBottom: '1.5rem', display: 'flex', gap: '8px',
          }}>
            <span>ℹ️</span>
            <p style={{ fontSize: '0.82rem', color: '#0d6efd', margin: 0 }}>
              No tool can force Google to index a page — that decision is Google&apos;s alone and can take hours to weeks.
              This tool tells you honestly whether a URL <em>can</em> be indexed, and sends real discovery signals.
              Verify final status in Google Search Console.
            </p>
          </div>

          {/* GOOGLE SEARCH CONSOLE — real OAuth-connected data, for pages you actually own */}
          <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#404145', margin: 0 }}>Google Search Console (real, authoritative)</p>
                <p style={{ fontSize: '0.78rem', color: '#95979d', marginTop: '0.2rem' }}>
                  Only works for domains you own & have verified in Search Console — not third-party backlink URLs.
                </p>
              </div>
              {!gscConnected ? (
                <a
                  href="/api/auth/google"
                  style={{ background: '#0d6efd', color: '#fff', padding: '9px 18px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}
                >
                  Connect Google Search Console
                </a>
              ) : (
                <span style={{ background: '#f0fdf4', color: '#1dbf73', border: '1px solid #bbf7d0', borderRadius: '100px', padding: '5px 14px', fontSize: '0.78rem', fontWeight: 700 }}>
                  ✓ Connected
                </span>
              )}
            </div>

            {gscNotice && <p style={{ fontSize: '0.8rem', color: '#1dbf73', marginBottom: '0.5rem' }}>{gscNotice}</p>}
            {gscError && <p style={{ fontSize: '0.8rem', color: '#dc2626', marginBottom: '0.5rem' }}>{gscError}</p>}

            {gscConnected && (
              <>
                <p style={{ fontSize: '0.78rem', color: '#62646a', marginBottom: '0.4rem', fontWeight: 600 }}>Verified property:</p>
                {gscLoadingSites ? (
                  <p style={{ fontSize: '0.8rem', color: '#95979d' }}>Loading your Search Console properties…</p>
                ) : gscSites.length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: '#95979d' }}>No verified properties found on this Google account.</p>
                ) : (
                  <select
                    value={selectedSite}
                    onChange={(e) => setSelectedSite(e.target.value)}
                    style={{ ...inputStyle, marginBottom: '0.75rem' }}
                  >
                    {gscSites.map((s) => (
                      <option key={s.siteUrl} value={s.siteUrl}>{s.siteUrl} ({s.permissionLevel})</option>
                    ))}
                  </select>
                )}

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#62646a', marginBottom: '0.75rem' }}>
                  <input type="checkbox" checked={attemptIndexingApi} onChange={(e) => setAttemptIndexingApi(e.target.checked)} style={{ accentColor: '#1dbf73' }} />
                  Also attempt Indexing API (only succeeds for JobPosting/BroadcastEvent pages — Google will reject others, shown honestly below)
                </label>

                <button
                  onClick={runInspection}
                  disabled={inspecting || gscSites.length === 0}
                  style={{
                    background: inspecting ? '#c7c8cc' : '#404145', color: '#fff', border: 'none',
                    padding: '10px 18px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700,
                    cursor: inspecting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {inspecting ? 'Asking Google…' : 'Inspect real index status (uses URLs entered below, max 20)'}
                </button>

                {inspections.length > 0 && (
                  <div style={{ marginTop: '1rem', border: '1px solid #e4e5e7', borderRadius: '10px', overflow: 'hidden' }}>
                    {inspections.map((r, i) => (
                      <div key={i} style={{ padding: '0.75rem 0.9rem', fontSize: '0.78rem', borderBottom: i !== inspections.length - 1 ? '1px solid #f0f0f1' : 'none', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                        <p style={{ fontFamily: 'monospace', color: '#404145', margin: '0 0 0.3rem' }}>{r.url}</p>
                        {r.error ? (
                          <p style={{ color: '#dc2626', margin: 0 }}>{r.error}</p>
                        ) : (
                          <p style={{ color: '#62646a', margin: 0 }}>
                            Coverage: <strong>{r.coverageState}</strong> · Verdict: <strong>{r.verdict}</strong> · Last crawled: {r.lastCrawlTime || 'never'} · Robots: {r.robotsTxtState} · Indexing state: {r.indexingState}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {indexingAttempts.length > 0 && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#404145', marginBottom: '0.3rem' }}>Indexing API attempt (per-URL, real Google response):</p>
                    {indexingAttempts.map((a, i) => (
                      <p key={i} style={{ fontSize: '0.75rem', color: a.accepted ? '#1dbf73' : '#d97706', margin: '0.2rem 0' }}>
                        {a.accepted ? '✓' : '⚠'} {a.url} — {a.note}
                      </p>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Toolbar */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowAdvanced((v) => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: showAdvanced ? '#1dbf73' : '#fff', color: showAdvanced ? '#fff' : '#404145',
                border: '1px solid #e4e5e7', padding: '8px 16px', borderRadius: '8px',
                fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
              }}
            >
              ⚙️ Advanced (IndexNow / Sitemap) {showAdvanced ? '▲' : '▼'}
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
              🕘 History ({history.length}) {showHistory ? '▲' : '▼'}
            </button>
          </div>

          {showAdvanced && (
            <div style={{ ...cardStyle, marginBottom: '1.5rem', padding: '1.5rem' }}>
              <p style={{ fontWeight: 700, fontSize: '0.88rem', color: '#404145', marginBottom: '0.5rem' }}>
                IndexNow key (only for domains you own)
              </p>
              <p style={{ fontSize: '0.78rem', color: '#95979d', marginBottom: '0.5rem' }}>
                Generate a key at <a href="https://www.bing.com/indexnow" target="_blank" rel="noreferrer" style={{ color: '#1dbf73' }}>bing.com/indexnow</a>,
                then host it at <code>https://yourdomain.com/&#123;key&#125;.txt</code> before submitting. This will NOT work for backlink URLs on domains you don&apos;t control.
              </p>
              <input
                value={indexNowKey}
                onChange={(e) => setIndexNowKey(e.target.value)}
                placeholder="e.g. a1b2c3d4e5f6..."
                style={{ ...inputStyle, marginBottom: '1rem' }}
              />
              <p style={{ fontWeight: 700, fontSize: '0.88rem', color: '#404145', marginBottom: '0.5rem' }}>
                Sitemap URL (for Bing ping — Google&apos;s ping endpoint was retired in 2023)
              </p>
              <input
                value={sitemapUrl}
                onChange={(e) => setSitemapUrl(e.target.value)}
                placeholder="https://yourdomain.com/sitemap.xml"
                style={inputStyle}
              />
            </div>
          )}

          {showHistory && (
            <div style={{ ...cardStyle, marginBottom: '1.5rem', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <p style={{ fontWeight: 700, fontSize: '0.92rem', color: '#404145', margin: 0 }}>Recent Audits</p>
                {history.length > 0 && (
                  <button onClick={clearHistory} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}>
                    Clear History
                  </button>
                )}
              </div>
              {history.length === 0 ? (
                <p style={{ color: '#95979d', fontSize: '0.85rem' }}>No audits run yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {history.map((c) => (
                    <div key={c.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.75rem 1rem', background: '#fafafa', border: '1px solid #e4e5e7', borderRadius: '8px',
                      fontSize: '0.8rem', flexWrap: 'wrap', gap: '0.5rem',
                    }}>
                      <span style={{ color: '#62646a' }}>{c.date}</span>
                      <span style={{ color: '#404145', fontWeight: 600 }}>{c.total} URLs</span>
                      <span style={{ color: '#1dbf73', fontWeight: 600 }}>✓ {c.reachable} reachable</span>
                      <span style={{ color: '#dc2626', fontWeight: 600 }}>⚠ {c.blocked} blocked/noindex</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TOOL CARD */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <label style={{ display: 'block', color: '#62646a', fontSize: '0.85rem', fontWeight: 500 }}>
                Enter URLs (one per line, max 100):
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input ref={fileInputRef} type="file" accept=".csv,.txt" onChange={handleFileUpload} style={{ display: 'none' }} />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{ fontSize: '0.75rem', background: '#f5f5f5', color: '#404145', border: '1px solid #e4e5e7', padding: '5px 12px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                  📁 Import CSV/TXT
                </button>
                {urls && (
                  <button
                    onClick={() => { setUrls(''); setData(null); setNotice(''); }}
                    style={{ fontSize: '0.75rem', background: '#f5f5f5', color: '#dc2626', border: '1px solid #e4e5e7', padding: '5px 12px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
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
              placeholder={'https://example.com/your-backlink\nhttps://blog.site.com/post-with-your-link'}
              style={textareaStyle}
              onFocus={(e) => (e.target.style.borderColor = '#1dbf73')}
              onBlur={(e) => (e.target.style.borderColor = '#e4e5e7')}
            />
            <div style={{ margin: '0.5rem 0 1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', color: '#95979d' }}>{uniqueList.length} URL{uniqueList.length !== 1 ? 's' : ''} detected</span>
              {duplicateCount > 0 && <span style={{ fontSize: '0.78rem', color: '#d97706' }}>{duplicateCount} duplicate(s) removed</span>}
            </div>

            {notice && (
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#0d6efd', borderRadius: '8px', padding: '0.7rem 1rem', fontSize: '0.82rem', marginBottom: '1rem' }}>{notice}</div>
            )}
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '8px', padding: '0.85rem 1rem', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>
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
                  Running real checks &amp; submitting signals...
                </>
              ) : (
                'Run Real Audit & Submit Signals'
              )}
            </button>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

            {/* REAL RESULTS */}
            {data && !loading && (
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#404145', margin: 0 }}>✅ Audit complete — real results</p>
                  <button onClick={downloadReport} style={{ fontSize: '0.78rem', background: '#1dbf73', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '7px', fontWeight: 600, cursor: 'pointer' }}>
                    ⬇ Download CSV Report
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '100px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '0.85rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1dbf73', margin: 0 }}>{data.summary.reachable}</p>
                    <p style={{ fontSize: '0.72rem', color: '#19a463', marginTop: '0.2rem' }}>Reachable</p>
                  </div>
                  <div style={{ flex: 1, minWidth: '100px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '0.85rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#dc2626', margin: 0 }}>{data.summary.blocked}</p>
                    <p style={{ fontSize: '0.72rem', color: '#dc2626', marginTop: '0.2rem' }}>Blocked / noindex</p>
                  </div>
                  <div style={{ flex: 1, minWidth: '100px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '10px', padding: '0.85rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#d97706', margin: 0 }}>{data.summary.canonicalIssues}</p>
                    <p style={{ fontSize: '0.72rem', color: '#d97706', marginTop: '0.2rem' }}>Canonical issues</p>
                  </div>
                </div>

                {/* Real signal status */}
                <div style={{ background: '#fafafa', border: '1px solid #e4e5e7', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#404145', marginBottom: '0.5rem' }}>Signal submission (real, not simulated):</p>
                  <p style={{ fontSize: '0.78rem', color: data.signals.indexNow.submitted ? '#1dbf73' : '#95979d', margin: '0.2rem 0' }}>
                    {data.signals.indexNow.submitted ? '✓' : '—'} IndexNow: {data.signals.indexNow.note}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: data.signals.bingSitemapPing.submitted ? '#1dbf73' : '#95979d', margin: '0.2rem 0' }}>
                    {data.signals.bingSitemapPing.submitted ? '✓' : '—'} Bing sitemap ping: {data.signals.bingSitemapPing.note}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: '#95979d', margin: '0.2rem 0' }}>
                    — Ping-O-Matic: {data.signals.pingOMatic.note} ({data.signals.pingOMatic.attempted} host(s) pinged)
                  </p>
                </div>

                <p style={{ fontSize: '0.78rem', color: '#95979d', marginBottom: '0.6rem' }}>Per-URL results:</p>
                <div style={{ border: '1px solid #e4e5e7', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                    {data.results.map((r, i) => {
                      const problem = r.blockedByRobots || r.hasNoindex || !r.reachable;
                      return (
                        <div key={i} style={{
                          padding: '0.75rem 0.9rem', fontSize: '0.78rem',
                          borderBottom: i !== data.results.length - 1 ? '1px solid #f0f0f1' : 'none',
                          background: i % 2 === 0 ? '#fff' : '#fafafa',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                            <span style={{ color: '#404145', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.url}</span>
                            <span style={{
                              flexShrink: 0,
                              background: problem ? '#fef2f2' : '#f0fdf4',
                              color: problem ? '#dc2626' : '#1dbf73',
                              border: `1px solid ${problem ? '#fecaca' : '#bbf7d0'}`,
                              borderRadius: '100px', padding: '2px 10px', fontSize: '0.7rem', fontWeight: 700,
                            }}>
                              {r.httpStatus ?? 'no response'}
                            </span>
                          </div>
                          {r.notes.length > 0 && (
                            <ul style={{ margin: '0.4rem 0 0', paddingLeft: '1.1rem', color: '#95979d' }}>
                              {r.notes.map((n, ni) => <li key={ni}>{n}</li>)}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#95979d', marginTop: '0.75rem' }}>{data.disclaimer}</p>
              </div>
            )}
          </div>

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
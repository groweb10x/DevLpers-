import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

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

async function fetchWithTimeout(url: string, opts: RequestInit = {}, ms = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...opts, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

async function checkUrl(url: string): Promise<Partial<CheckResult>> {
  const notes: string[] = [];
  let httpStatus: number | null = null;
  let reachable = false;
  let hasNoindex = false;
  let canonicalMismatch = false;

  try {
    const res = await fetchWithTimeout(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BacklinkAuditBot/1.0)' },
      redirect: 'follow',
    });
    httpStatus = res.status;
    reachable = res.status >= 200 && res.status < 400;

    const xRobots = res.headers.get('x-robots-tag') || '';
    if (/noindex/i.test(xRobots)) {
      hasNoindex = true;
      notes.push('X-Robots-Tag header contains "noindex" — Google will not index this page regardless of any other signal.');
    }

    if (reachable) {
      const html = await res.text();

      const metaRobotsMatch = html.match(/<meta[^>]+name=["']robots["'][^>]*content=["']([^"']+)["'][^>]*>/i);
      if (metaRobotsMatch && /noindex/i.test(metaRobotsMatch[1])) {
        hasNoindex = true;
        notes.push('Page contains <meta name="robots" content="noindex">.');
      }

      const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
      if (canonicalMatch) {
        const canonicalUrl = canonicalMatch[1].trim();
        try {
          const normalizedCanonical = new URL(canonicalUrl, url).href.replace(/\/$/, '');
          const normalizedUrl = new URL(url).href.replace(/\/$/, '');
          if (normalizedCanonical !== normalizedUrl) {
            canonicalMismatch = true;
            notes.push(`Canonical tag points to a different URL (${canonicalUrl}) — Google will attribute indexing to that URL instead.`);
          }
        } catch {
          // malformed canonical, ignore
        }
      }
    } else {
      notes.push(`Page returned HTTP ${httpStatus} — not indexable while broken.`);
    }
  } catch (err) {
    notes.push('Could not reach the URL (timeout, DNS failure, or connection refused).');
  }

  return { httpStatus, reachable, hasNoindex, canonicalMismatch, notes };
}

async function checkRobotsTxt(url: string): Promise<{ blocked: boolean; note?: string }> {
  try {
    const u = new URL(url);
    const robotsUrl = `${u.protocol}//${u.host}/robots.txt`;
    const res = await fetchWithTimeout(robotsUrl, {}, 5000);
    if (!res.ok) return { blocked: false };

    const text = await res.text();
    const lines = text.split('\n').map((l) => l.trim());
    let applies = false;
    let blocked = false;

    for (const line of lines) {
      if (/^user-agent:\s*\*/i.test(line)) applies = true;
      else if (/^user-agent:/i.test(line)) applies = false;
      else if (applies && /^disallow:\s*(.+)/i.test(line)) {
        const path = line.replace(/^disallow:\s*/i, '').trim();
        if (path && u.pathname.startsWith(path)) blocked = true;
      }
    }
    return { blocked, note: blocked ? `robots.txt disallows ${u.pathname} for all crawlers.` : undefined };
  } catch {
    return { blocked: false };
  }
}

async function submitIndexNow(urls: string[], indexNowKey?: string): Promise<{ submitted: boolean; note: string }> {
  if (!indexNowKey) {
    return { submitted: false, note: 'No IndexNow key configured — skipped. IndexNow only works for domains where you can host a key verification file.' };
  }
  try {
    const host = new URL(urls[0]).host;
    const res = await fetchWithTimeout('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key: indexNowKey,
        keyLocation: `https://${host}/${indexNowKey}.txt`,
        urlList: urls,
      }),
    }, 8000);
    if (res.status === 200 || res.status === 202) {
      return { submitted: true, note: `IndexNow accepted the submission (HTTP ${res.status}). Bing/Yandex will crawl based on this.` };
    }
    return { submitted: false, note: `IndexNow rejected the submission (HTTP ${res.status}). Check your key file is live at https://${host}/${indexNowKey}.txt` };
  } catch (e) {
    return { submitted: false, note: 'IndexNow request failed (network error).' };
  }
}

async function pingBingSitemap(sitemapUrl?: string): Promise<{ submitted: boolean; note: string }> {
  if (!sitemapUrl) return { submitted: false, note: 'No sitemap URL provided — skipped.' };
  try {
    const res = await fetchWithTimeout(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`, {}, 6000);
    return {
      submitted: res.ok,
      note: res.ok ? `Bing accepted the sitemap ping (HTTP ${res.status}).` : `Bing ping returned HTTP ${res.status}.`,
    };
  } catch {
    return { submitted: false, note: 'Bing ping request failed.' };
  }
}

async function pingOMatic(siteName: string, siteUrl: string): Promise<{ submitted: boolean; note: string }> {
  try {
    const xmlBody = `<?xml version="1.0"?><methodCall><methodName>weblogUpdates.ping</methodName><params><param><value>${siteName}</value></param><param><value>${siteUrl}</value></param></params></methodCall>`;
    const res = await fetchWithTimeout('http://rpc.pingomatic.com/', {
      method: 'POST',
      headers: { 'Content-Type': 'text/xml' },
      body: xmlBody,
    }, 6000);
    return {
      submitted: res.ok,
      note: res.ok
        ? 'Ping-O-Matic accepted the ping. This is a discovery aid only — it does not guarantee indexing.'
        : `Ping-O-Matic returned HTTP ${res.status}.`,
    };
  } catch {
    return { submitted: false, note: 'Ping-O-Matic request failed or is unreachable from this network.' };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const urls: string[] = Array.isArray(body.urls) ? body.urls.filter(Boolean) : [];
    const indexNowKey: string | undefined = body.indexNowKey || undefined;
    const sitemapUrl: string | undefined = body.sitemapUrl || undefined;

    if (urls.length === 0) {
      return NextResponse.json({ error: 'No URLs provided.' }, { status: 400 });
    }
    if (urls.length > 100) {
      return NextResponse.json({ error: 'Max 100 URLs per request to keep response times reasonable.' }, { status: 400 });
    }

    const results: CheckResult[] = await Promise.all(
      urls.map(async (url) => {
        const [pageCheck, robots] = await Promise.all([checkUrl(url), checkRobotsTxt(url)]);
        const notes = [...(pageCheck.notes || [])];
        if (robots.note) notes.push(robots.note);

        return {
          url,
          reachable: !!pageCheck.reachable,
          httpStatus: pageCheck.httpStatus ?? null,
          blockedByRobots: robots.blocked,
          hasNoindex: !!pageCheck.hasNoindex,
          canonicalMismatch: !!pageCheck.canonicalMismatch,
          indexNowSubmitted: false,
          bingPingSubmitted: false,
          pingOMaticSubmitted: false,
          notes,
        };
      })
    );

    const [indexNowResult, bingResult] = await Promise.all([
      submitIndexNow(urls.filter((u) => results.find((r) => r.url === u)?.reachable), indexNowKey),
      pingBingSitemap(sitemapUrl),
    ]);

    const uniqueHosts = Array.from(new Set(urls.map((u) => {
      try { return new URL(u).host; } catch { return null; }
    }).filter(Boolean))) as string[];

    const pingResults = await Promise.all(
      uniqueHosts.slice(0, 10).map((host) => pingOMatic(host, `https://${host}`))
    );

    for (const r of results) {
      r.indexNowSubmitted = indexNowResult.submitted && r.reachable;
      r.bingPingSubmitted = bingResult.submitted;
      r.pingOMaticSubmitted = pingResults.some((p) => p.submitted);
    }

    return NextResponse.json({
      results,
      summary: {
        total: results.length,
        reachable: results.filter((r) => r.reachable).length,
        blocked: results.filter((r) => r.blockedByRobots || r.hasNoindex).length,
        canonicalIssues: results.filter((r) => r.canonicalMismatch).length,
      },
      signals: {
        indexNow: indexNowResult,
        bingSitemapPing: bingResult,
        pingOMatic: { attempted: uniqueHosts.length, note: 'Ping-O-Matic is a best-effort discovery signal, not a guarantee of indexing.' },
      },
      disclaimer:
        'No tool — including this one — can force Google to index a page. Real crawl/index decisions belong entirely to Google and typically take hours to weeks. What this endpoint does is (a) tell you if a URL is actually indexable, and (b) send real, verifiable discovery signals. Verify final indexing status yourself in Google Search Console.',
    });
  } catch (e) {
    return NextResponse.json({ error: 'Server error processing request.' }, { status: 500 });
  }
}
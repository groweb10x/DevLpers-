import { NextRequest, NextResponse } from 'next/server';
import { getValidAccessToken } from '@/lib/google-auth';

export const dynamic = 'force-dynamic';

async function inspectUrl(token: string, siteUrl: string, inspectionUrl: string) {
  const res = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inspectionUrl, siteUrl }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { url: inspectionUrl, error: `${res.status}: ${text}` };
  }

  const json = await res.json();
  const result = json.inspectionResult?.indexStatusResult;
  return {
    url: inspectionUrl,
    verdict: result?.verdict,
    coverageState: result?.coverageState,
    lastCrawlTime: result?.lastCrawlTime || null,
    googleCanonical: result?.googleCanonical || null,
    userCanonical: result?.userCanonical || null,
    robotsTxtState: result?.robotsTxtState,
    indexingState: result?.indexingState,
    pageFetchState: result?.pageFetchState,
    sitemap: result?.sitemap || [],
  };
}

async function requestIndexing(token: string, url: string) {
  const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, type: 'URL_UPDATED' }),
  });
  const json = await res.json().catch(() => ({}));
  return {
    url,
    accepted: res.ok,
    status: res.status,
    note: res.ok
      ? 'Google accepted the indexing request.'
      : `Google rejected this (HTTP ${res.status}). Expected unless the page is JobPosting/BroadcastEvent structured content — this is a real API restriction, not a bug.`,
    raw: json,
  };
}

export async function POST(req: NextRequest) {
  const token = await getValidAccessToken();
  if (!token) {
    return NextResponse.json({ error: 'Not connected to Google. Visit /api/auth/google first.' }, { status: 401 });
  }

  const body = await req.json();
  const siteUrl: string = body.siteUrl;
  const urls: string[] = Array.isArray(body.urls) ? body.urls.filter(Boolean) : [];
  const attemptIndexingApi: boolean = !!body.attemptIndexingApi;

  if (!siteUrl || urls.length === 0) {
    return NextResponse.json({ error: 'siteUrl and urls[] are required.' }, { status: 400 });
  }
  if (urls.length > 20) {
    return NextResponse.json({ error: 'Max 20 URLs per inspection batch (Search Console API is rate-limited).' }, { status: 400 });
  }

  const inspections = [];
  for (const url of urls) {
    inspections.push(await inspectUrl(token, siteUrl, url));
  }

  let indexingAttempts: any[] = [];
  if (attemptIndexingApi) {
    indexingAttempts = await Promise.all(urls.map((u) => requestIndexing(token, u)));
  }

  return NextResponse.json({
    inspections,
    indexingAttempts,
    note: 'inspections[] is real, authoritative data from Google. indexingAttempts[] will show 403 for normal pages — that is Google enforcing its own API restriction, not a failure of this tool.',
  });
}
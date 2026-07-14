import { NextRequest, NextResponse } from 'next/server';
import { getValidAccessToken } from '@/lib/google-auth';

export async function POST(req: NextRequest) {
  const token = await getValidAccessToken();
  if (!token) {
    return NextResponse.json({ error: 'Not connected to Google. Visit /api/auth/google first.' }, { status: 401 });
  }

  const { siteUrl, sitemapUrl } = await req.json();
  if (!siteUrl || !sitemapUrl) {
    return NextResponse.json({ error: 'siteUrl and sitemapUrl are required.' }, { status: 400 });
  }

  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`,
    { method: 'PUT', headers: { Authorization: `Bearer ${token}` } }
  );

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: `Sitemap submission failed: ${res.status} ${text}` }, { status: res.status });
  }

  return NextResponse.json({ submitted: true, note: 'Google accepted the sitemap submission (HTTP 200/204). Crawling still happens on Google\'s own schedule.' });
}
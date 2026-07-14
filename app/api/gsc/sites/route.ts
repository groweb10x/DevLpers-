import { NextResponse } from 'next/server';
import { getValidAccessToken } from '@/lib/google-auth';

export async function GET() {
  const token = await getValidAccessToken();
  if (!token) {
    return NextResponse.json({ error: 'Not connected to Google. Visit /api/auth/google first.' }, { status: 401 });
  }

  const res = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: `Search Console API error: ${res.status} ${text}` }, { status: res.status });
  }

  const json = await res.json();
  const sites = (json.siteEntry || []).map((s: any) => ({
    siteUrl: s.siteUrl,
    permissionLevel: s.permissionLevel,
  }));

  return NextResponse.json({ sites });
}
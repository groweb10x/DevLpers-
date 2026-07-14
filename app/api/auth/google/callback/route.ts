import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens, saveTokens } from '@/lib/google-auth';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const errorParam = req.nextUrl.searchParams.get('error');

  if (errorParam) {
    return NextResponse.redirect(new URL(`/?gsc_error=${encodeURIComponent(errorParam)}`, req.url));
  }
  if (!code) {
    return NextResponse.redirect(new URL('/?gsc_error=missing_code', req.url));
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    await saveTokens(tokens);
    return NextResponse.redirect(new URL('/?gsc_connected=1', req.url));
  } catch (e) {
    return NextResponse.redirect(new URL('/?gsc_error=token_exchange_failed', req.url));
  }
}
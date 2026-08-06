import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Purane spam/hacked URLs jo Google ne index kiye the
const blockedPatterns = ['/?p=9', '?p='];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Check karo agar query string mein 'p=' hai (WordPress-style purana pattern)
  if (search.includes('p=')) {
    return new NextResponse('Gone', { status: 410 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/',
};
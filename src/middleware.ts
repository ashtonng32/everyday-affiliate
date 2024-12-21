import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    // Refresh session if exists
    const { data: { session } } = await supabase.auth.getSession();

    // Special handling for callback route
    if (req.nextUrl.pathname === '/auth/callback') {
      const code = req.nextUrl.searchParams.get('code');
      if (code) {
        return res;
      }
    }

    // Handle protected routes
    if (!session && req.nextUrl.pathname.startsWith('/retailers')) {
      return NextResponse.redirect(new URL('/auth/signup', req.url));
    }

    // Handle auth routes when already authenticated
    if (session && (
      req.nextUrl.pathname === '/auth/signup' ||
      req.nextUrl.pathname === '/auth/signin'
    )) {
      return NextResponse.redirect(new URL('/retailers', req.url));
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/retailers',
    '/auth/:path*',
  ],
}

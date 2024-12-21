import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Check for error in the URL
    const errorDescription = requestUrl.searchParams.get('error_description');
    if (errorDescription) {
      console.error('Auth error:', errorDescription);
      return NextResponse.redirect(new URL('/auth/error', request.url));
    }

    // Get code from URL
    const code = requestUrl.searchParams.get('code');
    if (!code) {
      console.error('No code in callback');
      return NextResponse.redirect(new URL('/auth/error', request.url));
    }

    // Exchange the code for a session
    const { data: { session }, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (exchangeError) {
      console.error('Code exchange error:', exchangeError);
      return NextResponse.redirect(new URL('/auth/error', request.url));
    }

    if (!session) {
      console.error('No session returned from code exchange');
      return NextResponse.redirect(new URL('/auth/error', request.url));
    }

    // Create response with redirect
    const response = NextResponse.redirect(new URL('/retailers', request.url));

    // Set auth cookie with session data
    response.cookies.set({
      name: 'sb-auth-token',
      value: session.access_token,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Set refresh token cookie
    response.cookies.set({
      name: 'sb-refresh-token',
      value: session.refresh_token || '',
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(new URL('/auth/error', request.url));
  }
}

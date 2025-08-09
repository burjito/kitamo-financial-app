import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  try {
    // Check for required environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase environment variables not available in middleware');
      // Allow access to public routes, redirect protected routes to login
      if (req.nextUrl.pathname.startsWith('/home') || 
          req.nextUrl.pathname.startsWith('/goal-tracker') ||
          req.nextUrl.pathname.startsWith('/what-if-simulator') ||
          req.nextUrl.pathname.startsWith('/financial-report') ||
          req.nextUrl.pathname.startsWith('/kitamo-bot') ||
          req.nextUrl.pathname.startsWith('/profile')) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
      return res;
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            req.cookies.set({
              name,
              value,
              ...options,
            })
            res = NextResponse.next({
              request: {
                headers: req.headers,
              },
            })
            res.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: any) {
            req.cookies.set({
              name,
              value: '',
              ...options,
            })
            res = NextResponse.next({
              request: {
                headers: req.headers,
              },
            })
            res.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    const {
      data: { session },
      error
    } = await supabase.auth.getSession()

    if (error) {
      console.error('Error getting session in middleware:', error);
      // Treat as no session and redirect protected routes
      if (req.nextUrl.pathname.startsWith('/home') || 
          req.nextUrl.pathname.startsWith('/goal-tracker') ||
          req.nextUrl.pathname.startsWith('/what-if-simulator') ||
          req.nextUrl.pathname.startsWith('/financial-report') ||
          req.nextUrl.pathname.startsWith('/kitamo-bot') ||
          req.nextUrl.pathname.startsWith('/profile')) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
      return res;
    }

    // Protect main app routes
    if (req.nextUrl.pathname.startsWith('/home') || 
        req.nextUrl.pathname.startsWith('/goal-tracker') ||
        req.nextUrl.pathname.startsWith('/what-if-simulator') ||
        req.nextUrl.pathname.startsWith('/financial-report') ||
        req.nextUrl.pathname.startsWith('/kitamo-bot') ||
        req.nextUrl.pathname.startsWith('/profile')) {
      if (!session) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }

    // Redirect authenticated users away from auth pages
    if (req.nextUrl.pathname.startsWith('/login') || 
        req.nextUrl.pathname.startsWith('/signup')) {
      if (session) {
        return NextResponse.redirect(new URL('/home', req.url))
      }
    }

    return res

  } catch (error) {
    console.error('Middleware error:', error);
    // On any error, allow the request to proceed but redirect protected routes to login
    if (req.nextUrl.pathname.startsWith('/home') || 
        req.nextUrl.pathname.startsWith('/goal-tracker') ||
        req.nextUrl.pathname.startsWith('/what-if-simulator') ||
        req.nextUrl.pathname.startsWith('/financial-report') ||
        req.nextUrl.pathname.startsWith('/kitamo-bot') ||
        req.nextUrl.pathname.startsWith('/profile')) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    return res;
  }
}
export const config = {
  matcher: [
    '/home/:path*',
    '/goal-tracker/:path*',
    '/what-if-simulator/:path*',
    '/financial-report/:path*',
    '/kitamo-bot/:path*',
    '/profile/:path*',
    '/login',
    '/signup'
  ]
}
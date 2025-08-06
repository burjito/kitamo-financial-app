
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

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

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  // Check for required environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables during email verification');
    return NextResponse.redirect(`${requestUrl.origin}/auth/verify-error?message=${encodeURIComponent('Service configuration error')}`)
  }

  if (code) {
    const cookieStore = await cookies()
    
    try {
      const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value
            },
            set(name: string, value: string, options: any) {
              cookieStore.set({ name, value, ...options })
            },
            remove(name: string, options: any) {
              cookieStore.set({ name, value: '', ...options })
            },
          },
        }
      )

      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Email verification error:', error)
        return NextResponse.redirect(`${requestUrl.origin}/auth/verify-error?message=${encodeURIComponent(error.message)}`)
      }

      // Verification successful - redirect to verification success page
      return NextResponse.redirect(`${requestUrl.origin}/auth/verify-success`)
    } catch (error) {
      console.error('Unexpected error during email verification:', error)
      return NextResponse.redirect(`${requestUrl.origin}/auth/verify-error?message=${encodeURIComponent('An unexpected error occurred')}`)
    }
  }

  // No code provided
  return NextResponse.redirect(`${requestUrl.origin}/auth/verify-error?message=${encodeURIComponent('No verification code provided')}`)
}

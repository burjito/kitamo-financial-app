import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

    try {
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

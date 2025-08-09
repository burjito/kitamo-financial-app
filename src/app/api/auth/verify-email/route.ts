import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')
  const next = requestUrl.searchParams.get('next') ?? '/home'

  // Check for required environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables during email verification');
    return NextResponse.redirect(`${requestUrl.origin}/auth/verify-error?message=${encodeURIComponent('Service configuration error')}`)
  }

  // Validate URL format
  try {
    new URL(supabaseUrl);
  } catch (error) {
    console.error('Invalid Supabase URL format during verification:', supabaseUrl);
    return NextResponse.redirect(`${requestUrl.origin}/auth/verify-error?message=${encodeURIComponent('Invalid service configuration')}`)
  }

  // Handle both PKCE code flow and legacy token_hash flow
  if (code) {
    // PKCE code flow
    const cookieStore = await cookies()
    
    try {
      const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll()
            },
            setAll(cookiesToSet) {
              try {
                cookiesToSet.forEach(({ name, value, options }) =>
                  cookieStore.set(name, value, options)
                )
              } catch {
                // The `setAll` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
              }
            },
          },
        }
      )

      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('PKCE verification error:', error)
        return NextResponse.redirect(`${requestUrl.origin}/auth/verify-error?message=${encodeURIComponent(error.message)}`)
      }

      // Verification successful
      return NextResponse.redirect(`${requestUrl.origin}/auth/verify-success`)
    } catch (error) {
      console.error('Unexpected error during PKCE verification:', error)
      return NextResponse.redirect(`${requestUrl.origin}/auth/verify-error?message=${encodeURIComponent('An unexpected error occurred')}`)
    }
  } else if (token_hash && type) {
    // Legacy token_hash flow
    const cookieStore = await cookies()
    
    try {
      const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll()
            },
            setAll(cookiesToSet) {
              try {
                cookiesToSet.forEach(({ name, value, options }) =>
                  cookieStore.set(name, value, options)
                )
              } catch {
                // The `setAll` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
              }
            },
          },
        }
      )

      const { error } = await supabase.auth.verifyOtp({
        type: type as any,
        token_hash,
      });
      
      if (error) {
        console.error('Token hash verification error:', error)
        return NextResponse.redirect(`${requestUrl.origin}/auth/verify-error?message=${encodeURIComponent(error.message)}`)
      }

      // Verification successful
      return NextResponse.redirect(`${requestUrl.origin}/auth/verify-success`)
    } catch (error) {
      console.error('Unexpected error during token hash verification:', error)
      return NextResponse.redirect(`${requestUrl.origin}/auth/verify-error?message=${encodeURIComponent('An unexpected error occurred')}`)
    }
  }

  // No valid verification parameters provided
  return NextResponse.redirect(`${requestUrl.origin}/auth/verify-error?message=${encodeURIComponent('No verification code provided')}`)
}

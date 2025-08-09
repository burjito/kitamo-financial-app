import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')
  const token = requestUrl.searchParams.get('token')
  const email = requestUrl.searchParams.get('email')
  const error = requestUrl.searchParams.get('error')
  const error_code = requestUrl.searchParams.get('error_code')
  const error_description = requestUrl.searchParams.get('error_description')

  // Debug: Log all query parameters
  console.log('Email verification URL:', requestUrl.toString())
  console.log('All search params:', Object.fromEntries(requestUrl.searchParams.entries()))

  // Immediately redirect PKCE codes to client-side before any server-side processing
  if (code && !token_hash) {
    // This is likely a PKCE code - redirect immediately to client-side handling
    console.log('PKCE code detected, immediately redirecting to client-side verification:', code)
    
    const clientParams = new URLSearchParams()
    clientParams.set('code', code)
    if (type) clientParams.set('type', type)
    if (email) clientParams.set('email', email)
    
    return NextResponse.redirect(`${requestUrl.origin}/auth/verify-client?${clientParams.toString()}`)
  }

  // Handle Supabase errors first (only for non-PKCE flows)
  if (error) {
    console.log('Supabase returned an error:', error, error_code, error_description)
    
    let userFriendlyMessage = 'An error occurred during verification'
    
    // Check for PKCE-related errors
    if (error_description && (
      error_description.includes('auth code and code verifier') ||
      error_description.includes('code verifier') ||
      error_description.includes('both auth code and code verifier should be non-empty')
    )) {
      // This is a PKCE configuration error, redirect to client-side verification
      console.log('PKCE error detected, redirecting to client-side verification')
      const codeParam = requestUrl.searchParams.get('code')
      if (codeParam) {
        const clientParams = new URLSearchParams()
        clientParams.set('code', codeParam)
        if (type) clientParams.set('type', type)
        if (email) clientParams.set('email', email)
        return NextResponse.redirect(`${requestUrl.origin}/auth/verify-client?${clientParams.toString()}`)
      } else {
        userFriendlyMessage = 'Email verification configuration error. Please try signing up again.'
      }
    } else if (error_code === 'otp_expired') {
      userFriendlyMessage = 'The verification link has expired. Please sign up again to receive a new verification email.'
    } else if (error === 'access_denied') {
      userFriendlyMessage = 'Access denied. The verification link may be invalid or expired.'
    } else if (error_description) {
      userFriendlyMessage = error_description
    }
    
    return NextResponse.redirect(`${requestUrl.origin}/auth/verify-error?message=${encodeURIComponent(userFriendlyMessage)}`)
  }

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

  // Handle different verification methods
  if (token_hash && type) {
    // Legacy token_hash flow (works with server-side verification)
    console.log('Using token_hash flow with token_hash:', token_hash, 'type:', type)
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
  } else if (token && type && email) {
    // Alternative token flow
    console.log('Using alternative token flow with token:', token, 'type:', type, 'email:', email)
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
        token,
        email,
      });
      
      if (error) {
        console.error('Token verification error:', error)
        return NextResponse.redirect(`${requestUrl.origin}/auth/verify-error?message=${encodeURIComponent(error.message)}`)
      }

      // Verification successful
      return NextResponse.redirect(`${requestUrl.origin}/auth/verify-success`)
    } catch (error) {
      console.error('Unexpected error during token verification:', error)
      return NextResponse.redirect(`${requestUrl.origin}/auth/verify-error?message=${encodeURIComponent('An unexpected error occurred')}`)
    }
  }

  // No valid verification parameters provided
  console.log('No valid verification parameters found')
  const availableParams = Object.fromEntries(requestUrl.searchParams.entries())
  const paramsList = Object.keys(availableParams).length > 0 ? 
    `Available parameters: ${JSON.stringify(availableParams)}` : 
    'No parameters received'
  
  return NextResponse.redirect(`${requestUrl.origin}/auth/verify-error?message=${encodeURIComponent(`No verification code provided. ${paramsList}`)}`)
}

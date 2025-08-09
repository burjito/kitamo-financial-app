import { NextRequest, NextResponse } from 'next/server'

/**
 * Clean email verification handler
 * Simply redirects all verification attempts to the unified client-side verification page
 * This eliminates server-side PKCE complexity and provides a consistent UX
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  
  console.log('📧 Email verification redirect:', requestUrl.toString())
  
  // Extract all parameters and forward them to the unified verification page
  const params = new URLSearchParams()
  
  // Forward all query parameters to the client-side verification
  requestUrl.searchParams.forEach((value, key) => {
    params.set(key, value)
  })
  
  const verifyUrl = `${requestUrl.origin}/verify?${params.toString()}`
  
  console.log('🔄 Redirecting to unified verification:', verifyUrl)
  
  return NextResponse.redirect(verifyUrl)
}

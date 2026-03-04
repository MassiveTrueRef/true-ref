import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const SHOP_ID = '75113169051'
const SHOPIFY_CLIENT_ID = process.env.SHOPIFY_CLIENT_ID || ''

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const error = url.searchParams.get('error')

  // Handle Shopify OIDC Cancellation or Errors
  if (error || !code) {
    console.error('Shopify OIDC Error:', error)
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
  }

  // Verify State Cookie
  const cookieStore = await cookies()
  const savedState = cookieStore.get('shopifyOauthState')?.value
  const codeVerifier = cookieStore.get('shopifyCodeVerifier')?.value

  if (!state || state !== savedState) {
    return NextResponse.redirect(new URL('/login?error=invalid_state', request.url))
  }

  if (!codeVerifier) {
    return NextResponse.redirect(new URL('/login?error=missing_verifier', request.url))
  }

  const redirectUri = `https://bracingly-bosomed-lennox.ngrok-free.dev/api/auth/shopify/callback`

  try {
    // Standard PKCE Token Exchange for Public Clients
    const tokenResponse = await fetch(`https://shopify.com/authentication/${SHOP_ID}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: SHOPIFY_CLIENT_ID,
        redirect_uri: redirectUri,
        code,
        code_verifier: codeVerifier, // Instead of Client Secret!
      }),
    })

    const tokenData: any = await tokenResponse.json()

    if (!tokenResponse.ok) {
      console.error('Customer Account API Token Exchange Failed:', tokenData)
      throw new Error(tokenData.error_description || 'Failed to exchange token')
    }

    // Success! We have the standard Customer Account API OIDC token
    const accessToken = tokenData.access_token

    // Store the customer's secure token
    cookieStore.set('customerAccessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: tokenData.expires_in || 7200,
    })

    // Clean up
    cookieStore.delete('shopifyOauthState')
    cookieStore.delete('shopifyCodeVerifier')

    // Take them natively back into their custom account portal
    return NextResponse.redirect(
      new URL('https://bracingly-bosomed-lennox.ngrok-free.dev/account', request.url),
    )
  } catch (err) {
    console.error('OIDC Callback exception:', err)
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
  }
}

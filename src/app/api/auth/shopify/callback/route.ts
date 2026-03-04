import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const SHOPIFY_CLIENT_ID = process.env.SHOPIFY_CLIENT_ID || ''
const SHOPIFY_CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET || ''
const SHOP_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || ''

function getAppUrl(request: Request) {
  const host = request.headers.get('host') || 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  return `${protocol}://${host}`
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const error = url.searchParams.get('error')
  const errorDescription = url.searchParams.get('error_description')

  // Handle User cancellation / Authorization errors
  if (error) {
    console.error('Shopify OAuth Error:', error, errorDescription)
    return NextResponse.redirect(new URL(`/login?error=${error}`, request.url))
  }

  // Verify State to protect against CSRF attacks
  const cookieStore = await cookies()
  const savedState = cookieStore.get('shopifyOauthState')?.value

  if (!state || state !== savedState) {
    return NextResponse.redirect(new URL('/login?error=invalid_state', request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', request.url))
  }

  const redirectUri = `${getAppUrl(request)}/api/auth/shopify/callback`

  try {
    // Exchange the Authorization Code for an Access Token
    // Required standard payload for Shopify OAuth Token Exchange
    const tokenResponse = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: SHOPIFY_CLIENT_ID,
        client_secret: SHOPIFY_CLIENT_SECRET,
        code,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      console.error('Token Exchange Failed:', tokenData)
      throw new Error(tokenData.error_description || 'Failed to exchange token')
    }

    // Success! We have the token
    const accessToken = tokenData.access_token
    const expiresIn = tokenData.expires_in || 7200 // Default 2 hours
    const idToken = tokenData.id_token // Contains user identity details if OIDC requested

    // Store the customer's secure token
    cookieStore.set('customerAccessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: expiresIn,
    })

    // Clean up state cookie
    cookieStore.delete('shopifyOauthState')

    // Redirect to the account hub natively
    return NextResponse.redirect(new URL('/account', request.url))
  } catch (err) {
    console.error('OAuth Callback exception:', err)
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
  }
}

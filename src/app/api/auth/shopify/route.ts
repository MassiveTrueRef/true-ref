import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Shopify OAuth constants
const SHOPIFY_CLIENT_ID = process.env.SHOPIFY_CLIENT_ID || ''
const SHOP_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || ''
// Base URL for the app (needed for redirect URI)
// In production, this should be your actual domain
// In development, handle standard localhost or ngrok
function getAppUrl(request: Request) {
  const host = request.headers.get('host') || 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  return `${protocol}://${host}`
}

export async function GET(request: Request) {
  const appUrl = getAppUrl(request)
  const redirectUri = `${appUrl}/api/auth/shopify/callback`

  // Scopes needed for our application
  // To read customer tags/data using Storefront/Admin API
  const scopes = 'unauthenticated_read_customers,unauthenticated_write_customers'

  // Generate a random state for security
  const state = Math.random().toString(36).substring(2, 15)

  // Save state in a secure httpOnly cookie to verify it in the callback
  const cookieStore = await cookies()
  cookieStore.set('shopifyOauthState', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  })

  // IMPORTANT: For true headless (Multipass or Customer Account API OAuth),
  // this flow typically uses the Shopify Customer Account API.
  // Standard Storefront apps use Multipass (Shopify Plus) or Storefront tokens.

  // Generate the Shopify Token Exchange authorization URL
  // https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/token-exchange
  const authUrl = new URL(`https://${SHOP_DOMAIN}/admin/oauth/authorize`)
  authUrl.searchParams.append('client_id', SHOPIFY_CLIENT_ID)
  authUrl.searchParams.append('redirect_uri', redirectUri)
  authUrl.searchParams.append('scope', scopes)
  authUrl.searchParams.append('state', state)

  return NextResponse.redirect(authUrl.toString())
}

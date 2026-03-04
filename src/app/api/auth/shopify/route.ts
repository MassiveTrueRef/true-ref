import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

// We fetched your actual Store ID dynamically for the Customer Accounts API
const SHOP_ID = '75113169051'
const SHOPIFY_CLIENT_ID = process.env.SHOPIFY_CLIENT_ID || ''

function base64URLEncode(str: Buffer) {
  return str.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export async function GET(request: Request) {
  const redirectUri = `https://bracingly-bosomed-lennox.ngrok-free.dev/api/auth/shopify/callback`

  // Standard OpenID Connect scopes required by the New Customer Account API
  const scopes = 'openid email customer-account-api:full'

  // Generate random state and nonce for OIDC security
  const state = Math.random().toString(36).substring(2, 15)
  const nonce = Math.random().toString(36).substring(2, 15)

  // Generate PKCE code verifier and challenge (No Client Secret Needed!)
  const codeVerifier = base64URLEncode(crypto.randomBytes(32))
  const codeChallenge = base64URLEncode(crypto.createHash('sha256').update(codeVerifier).digest())

  const cookieStore = await cookies()
  cookieStore.set('shopifyOauthState', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  })

  // Store the code_verifier so the callback can use it to exchange the token
  cookieStore.set('shopifyCodeVerifier', codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 10,
    path: '/',
  })

  // IMPORTANT: The New Customer Account API uses shopify.com/authentication/{shop_id}
  const authUrl = new URL(`https://shopify.com/authentication/${SHOP_ID}/oauth/authorize`)

  authUrl.searchParams.append('client_id', SHOPIFY_CLIENT_ID)
  authUrl.searchParams.append('response_type', 'code')
  authUrl.searchParams.append('redirect_uri', redirectUri)
  authUrl.searchParams.append('scope', scopes)
  authUrl.searchParams.append('state', state)
  authUrl.searchParams.append('nonce', nonce)
  authUrl.searchParams.append('code_challenge', codeChallenge)
  authUrl.searchParams.append('code_challenge_method', 'S256')

  return NextResponse.redirect(authUrl.toString())
}

import React, { Suspense } from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { CartBadge } from './CartBadge'
import { CurrencySwitcher } from './CurrencySwitcher'
import { cookies } from 'next/headers'

export async function Header() {
  const payload = await getPayload({ config: configPromise })
  const nav = await payload.findGlobal({
    slug: 'navigation',
  })

  const cookieStore = await cookies()
  const country = cookieStore.get('shop_country')?.value || 'US'

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="logo">
          <Link href="/">TrueRef</Link>
        </div>
        <div className="nav-links">
          {nav?.links?.map((link, i) => {
            if (link.type === 'custom') {
              return (
                <a key={i} href={link.url || '#'}>
                  {link.label}
                </a>
              )
            }

            // Page reference
            if (link.reference && typeof link.reference === 'object' && 'slug' in link.reference) {
              return (
                <Link key={i} href={`/${link.reference.slug}`}>
                  {link.label}
                </Link>
              )
            }

            return null
          })}
          <a href="/admin" target="_blank" rel="noopener noreferrer">
            Admin
          </a>
          <Suspense fallback={<div style={{ width: 24, height: 24 }} />}>
            <CartBadge />
          </Suspense>
          <CurrencySwitcher currentCountry={country} />
        </div>
      </div>
    </nav>
  )
}

import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export async function Header() {
  const payload = await getPayload({ config: configPromise })
  const nav = await payload.findGlobal({
    slug: 'navigation',
  })

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
            if (link.reference && typeof link.reference !== 'string') {
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
        </div>
      </div>
    </nav>
  )
}

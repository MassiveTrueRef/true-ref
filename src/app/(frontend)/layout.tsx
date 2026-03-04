import React from 'react'
import './styles.css'
import Link from 'next/link'
import { verifyMembership } from '@/lib/membership'

export const dynamic = 'force-dynamic'

export const metadata = {
  description: 'Create beautiful, interactive reference guides and documentation',
  title: 'TrueRef - Reference Guides Made Simple',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const { isAuthenticated } = await verifyMembership()

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="font-bold text-xl tracking-tight">
                  TrueRef
                </Link>
                <nav className="ml-8 space-x-4">
                  <Link href="/products" className="text-gray-600 hover:text-black">
                    Products
                  </Link>
                  <Link href="/vip" className="text-amber-600 font-medium hover:text-amber-800">
                    VIP Hub
                  </Link>
                  <Link href="/cart" className="text-gray-600 hover:text-black">
                    Cart
                  </Link>
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                  <Link
                    href="/account"
                    className="text-sm font-medium text-gray-700 hover:text-black"
                  >
                    My Account
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="text-sm font-medium bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                  >
                    Log In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}

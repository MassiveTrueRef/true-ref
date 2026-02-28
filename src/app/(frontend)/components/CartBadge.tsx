import React from 'react'
import Link from 'next/link'
import { fetchCart } from '../cart/actions'

export async function CartBadge() {
  let count = 0
  try {
    const cart = await fetchCart()
    count = cart?.totalQuantity || 0
  } catch (_err) {
    // silently fail
  }

  return (
    <Link
      href="/cart"
      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {count > 0 && <span>{count}</span>}
    </Link>
  )
}

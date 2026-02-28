'use client'

import React, { useTransition } from 'react'
import { addItemToCart } from '../cart/actions'

export function AddToCartButton({ variantId }: { variantId: string | undefined }) {
  const [isPending, startTransition] = useTransition()

  if (!variantId) {
    return (
      <button
        disabled
        className="btn btn-primary"
        style={{ marginTop: '2rem', width: '100%', maxWidth: '300px', opacity: 0.5 }}
      >
        Unavailable
      </button>
    )
  }

  return (
    <button
      onClick={() => {
        startTransition(() => {
          addItemToCart(variantId).then(() => {
            alert('Added to cart!')
          })
        })
      }}
      disabled={isPending}
      className="btn btn-primary"
      style={{
        marginTop: '2rem',
        width: '100%',
        maxWidth: '300px',
        cursor: isPending ? 'not-allowed' : 'pointer',
        textAlign: 'center',
        opacity: isPending ? 0.7 : 1,
      }}
    >
      {isPending ? 'Adding...' : 'Add to Cart'}
    </button>
  )
}

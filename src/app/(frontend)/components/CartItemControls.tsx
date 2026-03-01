'use client'

import React, { useTransition } from 'react'
import { updateItemQuantity, removeItem } from '../cart/actions'

export function CartItemControls({ lineId, quantity }: { lineId: string; quantity: number }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #ddd',
          borderRadius: '4px',
          overflow: 'hidden',
          opacity: isPending ? 0.5 : 1,
          pointerEvents: isPending ? 'none' : 'auto',
        }}
      >
        <button
          onClick={() => {
            startTransition(() => {
              updateItemQuantity(lineId, quantity - 1)
            })
          }}
          style={{
            padding: '0.25rem 0.75rem',
            background: '#f9f9f9',
            border: 'none',
            borderRight: '1px solid #ddd',
            cursor: 'pointer',
            fontSize: '1.2rem',
          }}
          disabled={isPending}
          aria-label="Decrease quantity"
        >
          -
        </button>
        <div
          style={{ padding: '0 1rem', fontSize: '0.9rem', minWidth: '2rem', textAlign: 'center' }}
        >
          {quantity}
        </div>
        <button
          onClick={() => {
            startTransition(() => {
              updateItemQuantity(lineId, quantity + 1)
            })
          }}
          style={{
            padding: '0.25rem 0.75rem',
            background: '#f9f9f9',
            border: 'none',
            borderLeft: '1px solid #ddd',
            cursor: 'pointer',
            fontSize: '1.2rem',
          }}
          disabled={isPending}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <button
        onClick={() => {
          startTransition(() => {
            removeItem(lineId)
          })
        }}
        style={{
          background: 'none',
          border: 'none',
          color: '#e53e3e',
          textDecoration: 'underline',
          cursor: isPending ? 'not-allowed' : 'pointer',
          opacity: isPending ? 0.5 : 1,
          fontSize: '0.85rem',
        }}
        disabled={isPending}
      >
        Remove
      </button>
    </div>
  )
}

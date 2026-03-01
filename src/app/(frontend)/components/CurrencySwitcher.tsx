'use client'

import React, { useTransition } from 'react'
import { setShopCountry } from '../actions/currency'

export function CurrencySwitcher({ currentCountry }: { currentCountry: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <select
      value={currentCountry}
      disabled={isPending}
      onChange={(e) => {
        startTransition(() => {
          setShopCountry(e.target.value)
        })
      }}
      style={{
        background: 'transparent',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '0.25rem 0.5rem',
        fontSize: '0.9rem',
        cursor: isPending ? 'wait' : 'pointer',
        opacity: isPending ? 0.7 : 1,
        color: 'inherit',
        marginLeft: '1rem',
      }}
      aria-label="Select Currency/Country"
    >
      <option value="US">USD</option>
      <option value="CA">CAD</option>
      <option value="GB">GBP</option>
      <option value="DE">EUR (DE)</option>
      <option value="AU">AUD</option>
    </select>
  )
}

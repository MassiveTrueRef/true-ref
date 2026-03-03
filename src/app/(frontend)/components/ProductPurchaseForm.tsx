'use client'

import React, { useState, useTransition } from 'react'
import { addItemToCart } from '../cart/actions'

export function ProductPurchaseForm({
  variantId,
  sellingPlanGroups,
}: {
  variantId: string | undefined
  sellingPlanGroups?: any[]
}) {
  const [isPending, startTransition] = useTransition()
  const [purchaseType, setPurchaseType] = useState<'onetime' | 'subscription'>('onetime')
  const [selectedPlanId, setSelectedPlanId] = useState<string | undefined>(
    sellingPlanGroups?.[0]?.node?.sellingPlans?.edges?.[0]?.node?.id,
  )

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

  const hasSellingPlans = sellingPlanGroups && sellingPlanGroups.length > 0

  return (
    <div style={{ marginTop: '2rem' }}>
      {hasSellingPlans && (
        <div
          style={{
            marginBottom: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <label
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
          >
            <input
              type="radio"
              name="purchaseType"
              value="onetime"
              checked={purchaseType === 'onetime'}
              onChange={() => setPurchaseType('onetime')}
            />
            One-time purchase
          </label>

          <label
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
          >
            <input
              type="radio"
              name="purchaseType"
              value="subscription"
              checked={purchaseType === 'subscription'}
              onChange={() => setPurchaseType('subscription')}
            />
            Subscribe & Save
          </label>

          {purchaseType === 'subscription' && (
            <div style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                style={{ padding: '0.5rem', borderRadius: '4px', width: '100%', maxWidth: '300px' }}
              >
                {sellingPlanGroups.map((group: any) => (
                  <optgroup key={group.node.name} label={group.node.name}>
                    {group.node.sellingPlans.edges.map((planEdge: any) => (
                      <option key={planEdge.node.id} value={planEdge.node.id}>
                        {planEdge.node.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => {
          startTransition(() => {
            const planToSubmit = purchaseType === 'subscription' ? selectedPlanId : undefined
            addItemToCart(variantId, planToSubmit).then(() => {
              alert(planToSubmit ? 'Subscription added to cart!' : 'Added to cart!')
            })
          })
        }}
        disabled={isPending || (purchaseType === 'subscription' && !selectedPlanId)}
        className="btn btn-primary"
        style={{
          width: '100%',
          maxWidth: '300px',
          cursor: isPending ? 'not-allowed' : 'pointer',
          textAlign: 'center',
          opacity: isPending ? 0.7 : 1,
        }}
      >
        {isPending ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  )
}

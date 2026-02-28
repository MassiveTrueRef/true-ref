import React from 'react'
import Link from 'next/link'
import { fetchCart } from './actions'
import { Header } from '../components/Header'
import '../styles.css'

export default async function CartPage() {
  const cart = await fetchCart()
  const hasItems = cart && cart.totalQuantity > 0

  return (
    <div className="post-container">
      <Header />
      <div className="post-content hero-content">
        <div className="hero-main" style={{ textAlign: 'left', padding: '2rem' }}>
          <h1 style={{ marginBottom: '2rem' }}>Your Cart</h1>

          {!hasItems ? (
            <div>
              <p>Your cart is empty.</p>
              <Link
                href="/products"
                className="btn btn-primary"
                style={{ display: 'inline-block', marginTop: '1rem' }}
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {cart.lines.edges.map((edge: any) => {
                  const line = edge.node
                  const product = line.merchandise.product
                  const image = product.images.edges[0]?.node
                  return (
                    <div
                      key={line.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        paddingBottom: '1rem',
                        borderBottom: '1px solid #eee',
                      }}
                    >
                      {image && (
                        <img
                          src={image.url}
                          alt={image.altText || product.title}
                          style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                          }}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{product.title}</h3>
                        <p style={{ margin: '0.25rem 0', color: '#666' }}>Qty: {line.quantity}</p>
                      </div>
                      <div style={{ fontWeight: 'bold' }}>
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: line.cost.totalAmount.currencyCode,
                        }).format(line.cost.totalAmount.amount)}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '1rem',
                  borderTop: '2px solid #ddd',
                }}
              >
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Total:</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: cart.cost.totalAmount.currencyCode,
                  }).format(cart.cost.totalAmount.amount)}
                </div>
              </div>

              <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                <a
                  href={cart.checkoutUrl}
                  className="btn btn-primary"
                  style={{ display: 'inline-block', padding: '1rem 2rem' }}
                >
                  Proceed to Checkout
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

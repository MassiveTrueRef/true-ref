import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import './styles.css'
import { Header } from './components/Header'
import { getProducts } from '@/lib/shopify'

import config from '@/payload.config'

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const recentProducts = await getProducts(8)

  return (
    <div className="hero">
      <Header />

      <div className="hero-content">
        <div className="hero-main">
          <h1>Real references for real artists</h1>
          <p className="subtitle">
            TrueRef is here to serve up monthly figure references for illustrators and photo
            editors—always free from retouching and never AI-generated.
          </p>
          <div className="cta-buttons">
            <Link href="/products" className="btn btn-primary">
              Shop Kits
            </Link>
            <a
              href={payloadConfig.routes.admin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              Editor Access
            </a>
          </div>
        </div>
      </div>

      <div className="features-section" id="features">
        <h2>Latest from the Shop</h2>
        <div className="features-grid">
          {recentProducts && recentProducts.length > 0 ? (
            recentProducts.map((product: any) => {
              const price = product.priceRange?.minVariantPrice
              const image = product.images?.edges?.[0]?.node

              return (
                <div key={product.id} className="feature-card">
                  {image && (
                    <Link
                      href={`/products/${product.handle}`}
                      style={{ display: 'block', marginBottom: '1rem' }}
                    >
                      <img
                        src={image.url}
                        alt={image.altText || product.title}
                        style={{
                          width: '100%',
                          height: 'auto',
                          aspectRatio: '1/1',
                          objectFit: 'cover',
                          borderRadius: '4px',
                        }}
                      />
                    </Link>
                  )}
                  <h3>
                    <Link href={`/products/${product.handle}`} style={{ textDecoration: 'none' }}>
                      {product.title}
                    </Link>
                  </h3>
                  {price && (
                    <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: price.currencyCode || 'USD',
                      }).format(price.amount)}
                    </p>
                  )}
                </div>
              )
            })
          ) : (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.6 }}>
              Stay tuned - kits are currently being photographed.
            </p>
          )}
        </div>

        {recentProducts && recentProducts.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/products" className="btn btn-secondary">
              View All Kits
            </Link>
          </div>
        )}
      </div>

      <div className="features-section" style={{ background: '#f9f9f9' }}>
        <h2>Why TrueRef</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Authentic</h3>
            <p>
              Real photographs with zero retouching. What you see is what you get—genuine,
              unpolished reference material.
            </p>
          </div>
          <div className="feature-card">
            <h3>Human-Created</h3>
            <p>
              Every reference pack is photographed with real people. Never AI-generated, always
              authentic human poses and expressions.
            </p>
          </div>
          <div className="feature-card">
            <h3>Regular Updates</h3>
            <p>
              New reference packs added every month. Stay inspired with fresh content for
              illustrators, concept artists, and photo editors.
            </p>
          </div>
        </div>
      </div>
      <div className="footer">
        <p>&copy; 2026 TrueRef. All rights reserved.</p>
      </div>
    </div>
  )
}

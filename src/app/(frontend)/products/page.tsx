import React from 'react'
import Link from 'next/link'
import { Header } from '../components/Header'
import { getProducts } from '@/lib/shopify'
import '../styles.css'

export default async function ProductsList() {
  const products = await getProducts()

  // Safely check environment vars
  const isShopifyConfigured =
    process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

  return (
    <div className="posts-container">
      <Header />
      <div className="hero-content">
        <div className="hero-main" style={{ textAlign: 'left', padding: '2rem' }}>
          <h1>Shop Reference Materials</h1>
          <p className="subtitle">High-quality references direct from the shop.</p>

          {!isShopifyConfigured && (
            <div
              style={{
                background: '#f8d7da',
                color: '#721c24',
                padding: '1rem',
                borderRadius: '4px',
                marginBottom: '2rem',
                border: '1px solid #f5c6cb',
              }}
            >
              <h4 style={{ margin: '0 0 0.5rem 0' }}>Missing Shopify Configuration</h4>
              <p style={{ margin: 0 }}>
                Please add <code>SHOPIFY_STORE_DOMAIN</code> and{' '}
                <code>SHOPIFY_STOREFRONT_ACCESS_TOKEN</code> to your <b>.env</b> file.
              </p>
            </div>
          )}

          <div className="features-grid" style={{ marginTop: '2rem' }}>
            {isShopifyConfigured && products.length === 0 ? (
              <p>No products found in your Shopify store.</p>
            ) : (
              products.map((product: any) => {
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
                    <p style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.5rem' }}>
                      {product.description?.length > 100
                        ? `${product.description.substring(0, 100)}...`
                        : product.description}
                    </p>
                    {price && (
                      <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: price.currencyCode || 'USD',
                        }).format(price.amount)}
                      </p>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      <div className="footer">
        <p>&copy; 2026 TrueRef. All rights reserved.</p>
      </div>
    </div>
  )
}

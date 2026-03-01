import { notFound } from 'next/navigation'
import React from 'react'
import Link from 'next/link'
import { Header } from '../../components/Header'
import { getProduct } from '@/lib/shopify'
import { AddToCartButton } from '../../components/AddToCartButton'
import { CommentsSection } from '../../components/CommentsSection'
import '../../styles.css'

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const product = await getProduct(handle)

  const isShopifyConfigured =
    process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

  if (!product && isShopifyConfigured) {
    return notFound()
  }

  const price = product?.priceRange?.minVariantPrice
  const image = product?.images?.edges?.[0]?.node
  const variantId = product?.variants?.edges?.[0]?.node?.id

  return (
    <div className="post-container">
      <Header />
      <div className="post-content hero-content">
        <div className="hero-main" style={{ textAlign: 'left', padding: '2rem' }}>
          <Link
            href="/products"
            style={{
              display: 'inline-block',
              marginBottom: '1rem',
              color: '#888',
              textDecoration: 'none',
            }}
          >
            &larr; Back to Shop
          </Link>

          {!product ? (
            <div
              style={{
                background: '#f8d7da',
                color: '#721c24',
                padding: '1rem',
                borderRadius: '4px',
                border: '1px solid #f5c6cb',
              }}
            >
              {!isShopifyConfigured
                ? 'Shopify environment variables missing.'
                : 'Product could not be loaded.'}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <div style={{ flex: '1 1 300px' }}>
                {image ? (
                  <img
                    src={image.url}
                    alt={image.altText || product.title}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '8px',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '1/1',
                      background: '#ccc',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ color: '#666' }}>No Image</span>
                  </div>
                )}
              </div>
              <div style={{ flex: '2 1 400px' }}>
                <h1 style={{ marginBottom: '0.5rem' }}>{product.title}</h1>
                {price && (
                  <p
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      margin: '1rem 0',
                      color: '#111',
                    }}
                  >
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: price.currencyCode || 'USD',
                    }).format(price.amount)}
                  </p>
                )}

                <div
                  className="rich-text"
                  style={{ lineHeight: 1.6, opacity: 0.9, marginTop: '2rem' }}
                  // dangerouslySetInnerHTML={{
                  //   __html: product.descriptionHtml || product.description,
                  // }}
                />

                <AddToCartButton variantId={variantId} />

                <p style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.6 }}>
                  Store checkout depends on active Shopify Cart API integration.
                </p>

                <CommentsSection
                  referenceType="products"
                  referenceId={handle}
                  path={`/products/${handle}`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

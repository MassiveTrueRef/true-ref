import { getPayload } from 'payload'
import React from 'react'
import configPromise from '@/payload.config'
import Link from 'next/link'
import { Header } from '../components/Header'
import '../styles.css'

export default async function PostsList() {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    limit: 100,
    draft: false,
    sort: '-publishedAt',
  })

  const posts = result.docs || []

  return (
    <div className="posts-container">
      <Header />

      <div className="hero-content">
        <div className="hero-main" style={{ textAlign: 'left', padding: '2rem' }}>
          <h1>The Blog</h1>
          <p className="subtitle">Latest updates and posts from TrueRef.</p>

          <div className="features-grid" style={{ marginTop: '2rem' }}>
            {posts.length === 0 ? (
              <p>No posts found. Please check back later.</p>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="feature-card">
                  <h3>
                    <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                  </h3>
                  {post.publishedAt && (
                    <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </p>
                  )}
                  {post.categories && post.categories.length > 0 && (
                    <div
                      style={{
                        marginTop: '0.5rem',
                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      {post.categories.map(
                        (cat: { id: string | number; title?: string } | string | number) => (
                          <span
                            key={typeof cat === 'object' ? cat.id : cat}
                            style={{
                              fontSize: '0.8rem',
                              background: '#333',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '4px',
                            }}
                          >
                            {typeof cat === 'object' ? cat.title : cat}
                          </span>
                        ),
                      )}
                    </div>
                  )}
                </div>
              ))
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

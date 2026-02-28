import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'
import configPromise from '@/payload.config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'
import { Header } from '../../components/Header'
import '../../styles.css'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
  })

  return posts.docs?.map(({ slug }) => ({ slug })) || []
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const post = result.docs?.[0] || null

  if (!post) {
    return notFound()
  }

  return (
    <div className="post-container">
      <Header />
      <div className="post-content hero-content">
        <div className="hero-main" style={{ textAlign: 'left', padding: '2rem' }}>
          <Link
            href="/posts"
            style={{
              display: 'inline-block',
              marginBottom: '1rem',
              color: '#888',
              textDecoration: 'none',
            }}
          >
            &larr; Back to Posts
          </Link>
          <h1>{post.title}</h1>
          <div
            style={{
              marginBottom: '2rem',
              opacity: 0.8,
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString()}</span>}
            {post.categories && post.categories.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
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

          <div className="rich-text">{post.content && <RichText data={post.content} />}</div>
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { createComment } from '../actions/comments'

type CommentsSectionProps = {
  referenceType: 'posts' | 'products'
  referenceId: string | number
  path: string
}

export async function CommentsSection({ referenceType, referenceId, path }: CommentsSectionProps) {
  const payload = await getPayload({ config: configPromise })

  const whereConstraint =
    referenceType === 'posts'
      ? { post: { equals: referenceId }, referenceType: { equals: 'posts' } }
      : { product: { equals: referenceId as string }, referenceType: { equals: 'products' } }

  const commentsRes = await payload.find({
    collection: 'comments',
    where: whereConstraint,
    sort: '-createdAt',
  })

  return (
    <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #eee' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Comments</h2>

      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}
      >
        {commentsRes.docs.length > 0 ? (
          commentsRes.docs.map((comment) => (
            <div
              key={comment.id}
              style={{
                background: '#f9f9f9',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #eaeaea',
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{comment.name}</div>
              <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.75rem' }}>
                {new Date(comment.createdAt).toLocaleDateString()}
              </div>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{comment.content}</div>
            </div>
          ))
        ) : (
          <p style={{ color: '#888' }}>No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>

      <div style={{ background: '#f5f5f5', padding: '1.5rem', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '1rem' }}>Leave a comment</h3>
        <form
          action={async (formData) => {
            'use server'
            await createComment(formData)
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <input type="hidden" name="referenceType" value={referenceType} />
          {referenceType === 'posts' && <input type="hidden" name="postId" value={referenceId} />}
          {referenceType === 'products' && (
            <input type="hidden" name="productHandle" value={referenceId} />
          )}
          <input type="hidden" name="path" value={path} />

          <div>
            <label
              htmlFor="name"
              style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="content"
              style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}
            >
              Comment
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={4}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              alignSelf: 'flex-start',
              padding: '0.75rem 1.5rem',
              background: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Submit Comment
          </button>
        </form>
      </div>
    </div>
  )
}

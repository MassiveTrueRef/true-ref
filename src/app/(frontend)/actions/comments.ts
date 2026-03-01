'use server'

import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { revalidatePath } from 'next/cache'

export async function createComment(formData: FormData) {
  const name = formData.get('name') as string
  const content = formData.get('content') as string
  const referenceType = formData.get('referenceType') as 'posts' | 'products'
  const postId = formData.get('postId') as string | null
  const productHandle = formData.get('productHandle') as string | null
  const path = formData.get('path') as string

  if (!name || !content || !referenceType) {
    throw new Error('Name, content, and referenceType are required.')
  }

  const payload = await getPayload({ config: configPromise })

  await payload.create({
    collection: 'comments',
    data: {
      name,
      content,
      referenceType,
      ...(referenceType === 'posts' && postId ? { post: postId } : {}),
      ...(referenceType === 'products' && productHandle ? { product: productHandle } : {}),
    },
  })

  revalidatePath(path)
}

'use server'

import { cookies } from 'next/headers'
import { createCart, addToCart, getCart } from '@/lib/shopify'
import { revalidatePath } from 'next/cache'

export async function addItemToCart(variantId: string) {
  if (!variantId) {
    throw new Error('Missing variantId')
  }

  const cookieStore = await cookies()
  const cartIdValue = cookieStore.get('cartId')?.value

  let cartId = cartIdValue

  if (!cartId) {
    const cart = await createCart()
    cartId = cart.id

    cookieStore.set('cartId', cartId!, {
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })
  }

  await addToCart(cartId!, [{ merchandiseId: variantId, quantity: 1 }])

  // Revalidate everything since the header's cart badge shows up everywhere
  revalidatePath('/', 'layout')
}

export async function fetchCart() {
  const cookieStore = await cookies()
  const cartId = cookieStore.get('cartId')?.value

  if (!cartId) return null

  return getCart(cartId)
}

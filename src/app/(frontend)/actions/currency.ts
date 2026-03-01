'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function setShopCountry(countryCode: string) {
  const cookieStore = await cookies()
  cookieStore.set('shop_country', countryCode, { path: '/', maxAge: 60 * 60 * 24 * 365 })
  // Clear the existing cart so they get a fresh session in the new currency
  cookieStore.delete('cartId')

  revalidatePath('/', 'layout')
}

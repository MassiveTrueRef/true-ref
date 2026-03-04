import { cookies } from 'next/headers'
import { getCustomer } from './shopify'

export async function verifyMembership() {
  const cookieStore = await cookies()
  const token = cookieStore.get('customerAccessToken')?.value

  if (!token) return { isMember: false, customer: null, isAuthenticated: false }

  const customer = await getCustomer(token)

  if (!customer) return { isMember: false, customer: null, isAuthenticated: false }

  const isMember = customer.tags?.some(
    (tag: string) =>
      tag.toLowerCase().includes('member') || tag.toLowerCase().includes('subscriber'),
  )

  return { isMember: !!isMember, customer, isAuthenticated: true }
}

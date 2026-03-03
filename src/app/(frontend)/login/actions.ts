'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createCustomerAccessToken } from '@/lib/shopify'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) return

  const token = await createCustomerAccessToken(email, password)

  if (token) {
    const cookieStore = await cookies()
    cookieStore.set('customerAccessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
    redirect('/')
  } else {
    // Return error state if implemented, else throw
    throw new Error('Invalid credentials')
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('customerAccessToken')
  redirect('/login')
}

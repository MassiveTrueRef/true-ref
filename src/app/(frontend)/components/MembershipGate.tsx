import Link from 'next/link'
import { verifyMembership } from '@/lib/membership'
import React from 'react'

interface MembershipGateProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default async function MembershipGate({ children, fallback }: MembershipGateProps) {
  const { isMember, isAuthenticated } = await verifyMembership()

  if (!isMember) {
    if (fallback) return fallback

    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 border border-gray-200 rounded-lg text-center my-8">
        <svg
          className="w-12 h-12 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <h3 className="text-xl font-bold mb-2">Members Only Content</h3>
        <p className="mb-6 text-gray-600 max-w-sm">
          You need an active subscription to view this content. Sign in to your account, or
          subscribe today.
        </p>
        <div className="flex gap-4">
          {!isAuthenticated ? (
            <Link
              href="/login"
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
            >
              Sign In
            </Link>
          ) : null}
          <Link
            href="/products"
            className="border border-black text-black px-6 py-2 rounded-md hover:bg-gray-100 transition"
          >
            Browse Memberships
          </Link>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

import MembershipGate from '@/app/(frontend)/components/MembershipGate'
import React from 'react'

export const metadata = {
  title: 'VIP Hub | TrueRef',
}

export default function VIPPage() {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">VIP Member Resource Hub</h1>
        <p className="text-gray-600">
          Welcome to the exclusive VIP hub. This page is technically accessible to everyone, but the
          premium content below is strictly gated for active members!
        </p>
      </div>

      {/* 
        This component natively checks the user's Shopify Token + Tags. 
        If they aren't tagged 'member' or 'subscriber', they'll see a fallback UI. 
      */}
      <MembershipGate>
        <div className="bg-gradient-to-r from-yellow-50 to-amber-100 border border-yellow-200 rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">You&apos;re In! 🏆</h2>
          <p className="text-amber-800 mb-6">
            Thank you for being an active TrueRef subscriber. Here are your exclusive resources:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded border border-yellow-200">
              <h3 className="font-semibold mb-2">📚 2026 Strategy Guide</h3>
              <p className="text-sm text-gray-500 mb-4">
                Download our comprehensive guide to reference tracking.
              </p>
              <button className="text-sm bg-black text-white px-3 py-1 rounded">
                Download PDF
              </button>
            </div>

            <div className="bg-white p-4 rounded border border-yellow-200">
              <h3 className="font-semibold mb-2">🎥 Developer Video Series</h3>
              <p className="text-sm text-gray-500 mb-4">
                Advanced tutorials on custom Payload CMS schemas.
              </p>
              <button className="text-sm bg-black text-white px-3 py-1 rounded">Watch Now</button>
            </div>

            <div className="bg-white p-4 rounded border border-yellow-200">
              <h3 className="font-semibold mb-2">🎁 Member Only Merch</h3>
              <p className="text-sm text-gray-500 mb-4">
                Use code TRUEREF20 at checkout for 20% off all physical items.
              </p>
              <button className="text-sm border border-black px-3 py-1 rounded">Shop Merch</button>
            </div>

            <div className="bg-white p-4 rounded border border-yellow-200">
              <h3 className="font-semibold mb-2">💬 Private Community</h3>
              <p className="text-sm text-gray-500 mb-4">
                Join the Discord server and chat directly with authors.
              </p>
              <button className="text-sm border border-black px-3 py-1 rounded">
                Join Discord
              </button>
            </div>
          </div>
        </div>
      </MembershipGate>
    </div>
  )
}

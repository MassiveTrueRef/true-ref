import { login } from './actions'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md border">
      <h1 className="text-2xl font-bold mb-6 text-center">Login to your account</h1>
      <form action={login} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-3 py-2 border rounded-md"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full px-3 py-2 border rounded-md"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
        >
          Sign In
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between">
        <span className="w-1/5 border-b lg:w-1/4"></span>
        <a href="#" className="text-xs text-center text-gray-500 uppercase">
          or login seamlessly
        </a>
        <span className="w-1/5 border-b lg:w-1/4"></span>
      </div>

      <div className="mt-6">
        <Link
          href="/api/auth/shopify"
          className="w-full flex items-center justify-center gap-2 bg-[#95BF47] text-white py-2 px-4 rounded-md hover:bg-[#85ab3f] transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.2 5.8c-.3-.4-.8-.6-1.3-.6H16V3.8c0-1-.8-1.8-1.8-1.8H9.8c-1 0-1.8.8-1.8 1.8v1.4H4.1c-.5 0-1 .2-1.3.6C2.4 6.2 2.3 6.7 2.4 7.2l2.6 12.3c.1.6.6 1.1 1.2 1.1h11.6c.6 0 1.1-.4 1.2-1l2.6-12.4c0-.6-.1-1.1-.4-1.4zM9.6 3.8c0-.1.1-.2.2-.2h4.4c.1 0 .2.1.2.2v1.4H9.6V3.8zm8.6 15.2H5.8L3.5 7.6h4.5v1.8c0 .4.3.8.8.8s.8-.4.8-.8V7.6h4.8v1.8c0 .4.3.8.8.8s.8-.3.8-.8V7.6h4.5l-2.3 11.4z" />
          </svg>
          Shopify Customer Account
        </Link>
      </div>
    </div>
  )
}

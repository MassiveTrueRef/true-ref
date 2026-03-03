import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getCustomer } from '@/lib/shopify'
import { logout } from '@/app/(frontend)/login/actions'

export default async function AccountPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('customerAccessToken')?.value

  if (!token) {
    redirect('/login')
  }

  const customer = await getCustomer(token)

  if (!customer) {
    // Token might be invalid or expired
    redirect('/login')
  }

  // Check if they have a 'Member' or similar tag indicating an active membership
  const isMember = customer.tags?.some(
    (tag: string) =>
      tag.toLowerCase().includes('member') || tag.toLowerCase().includes('subscriber'),
  )

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Account</h1>
        <form action={logout}>
          <button type="submit" className="text-gray-500 hover:text-black hover:underline">
            Logout
          </button>
        </form>
      </div>

      <div className="bg-white border rounded-lg p-6 shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Profile</h2>
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p>
              {customer.firstName} {customer.lastName}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p>{customer.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Membership Status</p>
            <p className="flex items-center gap-2">
              {isMember ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="font-semibold text-green-700">Active Member</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                  <span>Not an active member</span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        {customer.orders?.edges?.length > 0 ? (
          <div className="space-y-4">
            {customer.orders.edges.map(({ node: order }: any) => (
              <div key={order.id} className="border rounded-md p-4 bg-gray-50">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Order #{order.orderNumber}</span>
                  <span>{new Date(order.processedAt).toLocaleDateString()}</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Total: {order.totalPrice.amount} {order.totalPrice.currencyCode}
                </div>
                <ul className="text-sm text-gray-500 list-disc list-inside">
                  {order.lineItems?.edges?.map(({ node: item }: any, idx: number) => (
                    <li key={idx}>
                      {item.quantity}x {item.title}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No orders found.</p>
        )}
      </div>
    </div>
  )
}

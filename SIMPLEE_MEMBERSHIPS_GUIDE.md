# Headless Shopify Memberships (Simplee App) Integration Guide

This application has been upgraded to support Shopify robust subscriptions natively via the Storefront API (`Selling Plans`) alongside Headless Customer Authentication and tagging.

Here is a breakdown of how the integration functions and how to utilize it to gate content locally on your Next.js application based on the user's active membership status.

## Core Concepts

In Headless Shopify, "Subscriptions" are managed via **Selling Plans**. The Simplee Memberships app relies on Shopify's native Selling Plans to process recurring checkouts. When a customer purchases a membership, the app attaches a "Tag" to the customer inside your Shopify Admin dashboard (e.g., `member` or `subscriber`).

We've bridged these concepts into our Next.js frontend through 3 steps:

1. **Purchasing Subscriptions:** Product pages dynamically fetch `sellingPlanGroups`. If a group is found, the user can toggle a "Subscribe" radio button which passes the `sellingPlanId` to the `addToCart` mutation.
2. **Customer Login:** We've bypassed typical Shopify checkout bounds to allow users to authenticate natively via our `/login` portal. We issue a GraphQL `customerAccessTokenCreate` mutation and store the returning token locally in an HTTP-only HTTP Cookie.
3. **Checking Status:** We query the customer's Shopify tags dynamically from the server every time a gated component is rendered. If they have a tag `Member`, they see the component. If not, they see a "Sign in / Browse Memberships" lock screen!

---

## 1. How to Sell Memberships Let Content

Our application is already fitted with `ProductPurchaseForm.tsx`.

When you hook up a Shopify product to the "Simplee Memberships" app in the Shopify Admin, returning API queries to Headless Shopify will natively begin returning `sellingPlanGroups` inside the standard `getProduct()` helper.

The purchase form will automatically render a Subscription toggle UI if the product contains selling plans. No code changes required!

## 2. Gating Pages and Components (Quick Usage)

To lock content down to members-only, you simply need to wrap it inside the newly created `<MembershipGate />` server component.

### A. Protecting Specific UI Sections

In any asynchronous Next.js Server Component page (such as `src/app/(frontend)/vip/page.tsx`):

```tsx
import MembershipGate from '@/app/(frontend)/components/MembershipGate'

export default function VIPPage() {
  return (
    <main>
      <h1>Public Content</h1>
      <p>Everyone can see this paragraph!</p>

      {/* The magic happens below */}
      <MembershipGate>
        <div className="members-only-styles">
          <h2>Secret Content!</h2>
          <p>
            Only people who bought a subscription through Simplee and are tagged 'member' can see
            this.
          </p>
        </div>
      </MembershipGate>
    </main>
  )
}
```

### B. Defining a Custom Fallback

If you want to render something else rather than the default "Lock" screen when a user isn't subscribed, pass a `fallback` component:

```tsx
<MembershipGate fallback={<p>Pay up buddy!</p>}>
  <p>Secret file download</p>
</MembershipGate>
```

---

## 3. Advanced Usage: `verifyMembership()`

If you need to verify if someone is a member inside of a native Next.js API Route (`app/api/route.ts`) or a Next.js Server Action (`actions.ts`) to prevent them from doing things in the backend (like leaving Comments if they aren't subscribed), you can import our unified validation function:

```typescript
import { verifyMembership } from '@/lib/membership'
import { redirect } from 'next/navigation'

export async function submitVIPForm(formData: FormData) {
  'use server'

  const { isMember, customer, isAuthenticated } = await verifyMembership()

  // 1. Kick them out if not authenticated
  if (!isAuthenticated) return redirect('/login')

  // 2. Reject their submission if they aren't a paying member
  if (!isMember) {
    throw new Error('You must be an active subscriber to submit this form.')
  }

  // 3. You can even read their Shopify Customer data
  console.log('Saving form for:', customer.firstName, customer.email)

  // ... Proceed to database logic here
}
```

## How to Customize The Required Tags

If you switch from the Simplee App to another Membership app (or the app changes the tag it issues to users), you'll need to update the logic that checks the tag names.

Go to `/src/lib/membership.ts` and modify the string lookup array matchers below:

```typescript
// Currently looking for any tag containing the word 'member' or 'subscriber'
const isMember = customer.tags?.some(
  (tag: string) => tag.toLowerCase().includes('member') || tag.toLowerCase().includes('subscriber'),
)
```

And that's it! Full end-to-end headless Shopify memberships cleanly scoped in Typescript.

import { cookies } from 'next/headers'

const domain = process.env.SHOPIFY_STORE_DOMAIN || ''
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || ''

async function getContextDirective() {
  const cookieStore = await cookies()
  const country = cookieStore.get('shop_country')?.value || 'US'
  return `@inContext(country: ${country})`
}

export async function shopifyFetch<T>({
  cache = 'force-cache',
  headers,
  query,
  tags,
  variables,
}: {
  cache?: RequestCache
  headers?: HeadersInit
  query: string
  tags?: string[]
  variables?: any
}): Promise<{ status: number; body: { data: T } | any }> {
  try {
    const result = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
        ...headers,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
      cache,
      ...(tags && { next: { tags } }),
    })

    const body = (await result.json()) as any

    if (body.errors && body.errors.length > 0) {
      throw body.errors[0]
    }

    return {
      status: result.status,
      body,
    }
  } catch (e) {
    console.error('Shopify fetch error:', e)
    throw {
      error: e,
      query,
    }
  }
}

export async function getProducts(limit = 20) {
  if (!domain || !storefrontAccessToken) return []
  const context = await getContextDirective()

  const query = `
    query getProducts($first: Int!) ${context} {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
        }
      }
    }
  `

  try {
    const res = await shopifyFetch<any>({ query, variables: { first: limit } })
    return res.body?.data?.products?.edges?.map((e: any) => e.node) || []
  } catch (err) {
    return []
  }
}

export async function getProduct(handle: string) {
  if (!domain || !storefrontAccessToken) return null
  const context = await getContextDirective()

  const query = `
    query getProduct($handle: String!) ${context} {
      product(handle: $handle) {
        id
        title
        handle
        descriptionHtml
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 5) {
          edges {
            node {
              url
              altText
              width
              height
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              id
              availableForSale
            }
          }
        }
        sellingPlanGroups(first: 10) {
          edges {
            node {
              name
              options {
                name
                values
              }
              sellingPlans(first: 10) {
                edges {
                  node {
                    id
                    name
                    description
                    priceAdjustments {
                      adjustmentValue {
                        ... on SellingPlanFixedAmountPriceAdjustment {
                          adjustmentAmount {
                            amount
                            currencyCode
                          }
                        }
                        ... on SellingPlanFixedPriceAdjustment {
                          price {
                            amount
                            currencyCode
                          }
                        }
                        ... on SellingPlanPercentagePriceAdjustment {
                          adjustmentPercentage
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `

  try {
    const res = await shopifyFetch<any>({ query, variables: { handle } })
    return res.body?.data?.product || null
  } catch (err) {
    return null
  }
}

export async function createCart() {
  const context = await getContextDirective()
  const query = `
    mutation cartCreate ${context} {
      cartCreate {
        cart {
          id
          checkoutUrl
        }
      }
    }
  `
  const res = await shopifyFetch<any>({ query, cache: 'no-store' })
  return res.body?.data?.cartCreate?.cart
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number; sellingPlanId?: string }[],
) {
  const context = await getContextDirective()
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) ${context} {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
        }
      }
    }
  `
  const res = await shopifyFetch<any>({
    query,
    variables: { cartId, lines },
    cache: 'no-store',
  })
  return res.body?.data?.cartLinesAdd?.cart
}

export async function updateCartItem(cartId: string, lines: { id: string; quantity: number }[]) {
  const context = await getContextDirective()
  const query = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) ${context} {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          totalQuantity
        }
      }
    }
  `
  const res = await shopifyFetch<any>({
    query,
    variables: { cartId, lines },
    cache: 'no-store',
  })
  return res.body?.data?.cartLinesUpdate?.cart
}

export async function removeCartItem(cartId: string, lineIds: string[]) {
  const context = await getContextDirective()
  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) ${context} {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          totalQuantity
        }
      }
    }
  `
  const res = await shopifyFetch<any>({
    query,
    variables: { cartId, lineIds },
    cache: 'no-store',
  })
  return res.body?.data?.cartLinesRemove?.cart
}

export async function getCart(cartId: string) {
  const context = await getContextDirective()
  const query = `
    query getCart($cartId: ID!) ${context} {
      cart(id: $cartId) {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
              sellingPlanAllocation {
                sellingPlan {
                  name
                  description
                }
              }
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `
  const res = await shopifyFetch<any>({
    query,
    variables: { cartId },
    cache: 'no-store',
  })
  return res.body?.data?.cart || null
}

export async function createCustomerAccessToken(email: string, password: string) {
  const query = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `

  const variables = {
    input: {
      email,
      password,
    },
  }

  const res = await shopifyFetch<any>({
    query,
    variables,
    cache: 'no-store',
  })

  return res.body?.data?.customerAccessTokenCreate?.customerAccessToken?.accessToken || null
}

export async function getCustomer(accessToken: string) {
  const query = `
    query customer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        firstName
        lastName
        email
        phone
        tags
        orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
          edges {
            node {
              id
              orderNumber
              processedAt
              totalPrice {
                amount
                currencyCode
              }
              financialStatus
              fulfillmentStatus
              lineItems(first: 10) {
                edges {
                  node {
                    title
                    quantity
                  }
                }
              }
            }
          }
        }
      }
    }
  `

  try {
    const res = await shopifyFetch<any>({
      query,
      variables: { customerAccessToken: accessToken },
      cache: 'no-store',
    })
    return res.body?.data?.customer || null
  } catch (err) {
    return null
  }
}

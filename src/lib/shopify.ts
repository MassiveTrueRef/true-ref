const domain = process.env.SHOPIFY_STORE_DOMAIN || ''
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || ''

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

  const query = `
    query getProducts($first: Int!) {
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

  const query = `
    query getProduct($handle: String!) {
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
  const query = `
    mutation cartCreate {
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
  lines: { merchandiseId: string; quantity: number }[],
) {
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
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

export async function getCart(cartId: string) {
  const query = `
    query getCart($cartId: ID!) {
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

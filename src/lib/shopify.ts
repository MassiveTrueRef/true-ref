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

    if (body.errors) {
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

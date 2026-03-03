import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'handle',
    description: 'Proxy collection for Shopify products to attach comments.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'handle',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'comments',
      type: 'join',
      collection: 'comments',
      on: 'product',
    },
  ],
}

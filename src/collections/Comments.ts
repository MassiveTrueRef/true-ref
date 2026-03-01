import type { CollectionConfig } from 'payload'

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'referenceType', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
    {
      name: 'referenceType',
      type: 'select',
      options: [
        { label: 'Post', value: 'posts' },
        { label: 'Product', value: 'products' },
      ],
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      admin: {
        condition: (_, siblingData) => siblingData.referenceType === 'posts',
        position: 'sidebar',
      },
    },
    {
      name: 'product',
      label: 'Product ID or Handle',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData.referenceType === 'products',
        position: 'sidebar',
      },
    },
  ],
}

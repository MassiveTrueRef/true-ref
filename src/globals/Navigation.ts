import type { GlobalConfig } from 'payload'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'links',
      type: 'array',
      admin: {
        isSortable: true,
        initCollapsed: true,
        components: {
          RowLabel: '@/globals/components/RowLabel#RowLabel',
        },
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'type',
          type: 'radio',
          options: [
            { label: 'Page Reference', value: 'reference' },
            { label: 'Custom URL', value: 'custom' },
          ],
          defaultValue: 'reference',
        },
        {
          name: 'reference',
          type: 'relationship',
          relationTo: 'pages',
          admin: {
            condition: (_, siblingData) => siblingData.type === 'reference',
          },
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData.type === 'custom',
          },
        },
      ],
    },
  ],
}

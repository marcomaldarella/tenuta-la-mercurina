import { defineField, defineType } from 'sanity'

export const marketDate = defineType({
  name: 'marketDate',
  title: 'Data mercato',
  type: 'document',
  fields: [
    defineField({
      name: 'date',
      title: 'Data',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'text', title: 'Testo', type: 'localeText' }),
    defineField({
      name: 'images',
      title: 'Immagini',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'bookable',
      title: 'Prenotabile',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Data, recente prima',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'date' },
  },
})

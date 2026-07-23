import { defineField, defineType } from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Pagina',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Titolo', type: 'localeString' }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title.it' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        defineField({
          name: 'images',
          title: 'Immagini (carosello)',
          type: 'array',
          of: [{ type: 'image', options: { hotspot: true } }],
        }),
        defineField({ name: 'text', title: 'Testo in overlay', type: 'localeText' }),
      ],
    }),
    defineField({
      name: 'sections',
      title: 'Sezioni',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'section',
          fields: [
            defineField({ name: 'title', title: 'Titolo', type: 'localeString' }),
            defineField({ name: 'text', title: 'Testo', type: 'localeText' }),
            defineField({
              name: 'images',
              title: 'Immagini (carosello se più di una)',
              type: 'array',
              of: [{ type: 'image', options: { hotspot: true } }],
            }),
            defineField({
              name: 'cta',
              title: 'Link',
              type: 'string',
              options: {
                list: [
                  { title: 'Nessuno', value: 'none' },
                  { title: 'Contattaci', value: 'contatti' },
                  { title: 'Prenota ora', value: 'prenota' },
                  { title: 'Link a pagina', value: 'page' },
                ],
              },
              initialValue: 'none',
            }),
            defineField({
              name: 'page',
              title: 'Pagina collegata',
              type: 'reference',
              to: [{ type: 'page' }],
              hidden: ({ parent }) => parent?.cta !== 'page',
            }),
          ],
          preview: {
            select: { title: 'title.it', media: 'images.0' },
          },
        },
      ],
    }),
    defineField({
      name: 'details',
      title: 'Dettagli (testo esteso, es. prezzi e servizi)',
      type: 'localeBlock',
    }),
    defineField({
      name: 'endCta',
      title: 'Mostra "Contattaci" grande a fine pagina',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title.it', subtitle: 'slug.current' },
  },
})

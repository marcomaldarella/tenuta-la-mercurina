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
        defineField({ name: 'heading', title: 'Header (titolo)', type: 'localeString' }),
        defineField({
          name: 'subheading',
          title: 'Pre-header (sottotitolo)',
          type: 'localeText',
        }),
        defineField({
          name: 'text',
          title: 'Testo in overlay (legacy, usato se manca l’header)',
          type: 'localeText',
        }),
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
            defineField({
              name: 'subtitle',
              title: 'Pre-header (sottotitolo)',
              type: 'localeText',
            }),
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
          /* in lista ogni blocco deve dirsi da solo: come si chiama e quante
             foto ha (il titolo ora è il lead in grassetto, può essere lungo) */
          preview: {
            select: {
              title: 'title.it',
              subtitle: 'subtitle.it',
              text: 'text.it',
              media: 'images.0',
              images: 'images',
            },
            prepare: ({ title, subtitle, text, media, images }) => {
              const n = Array.isArray(images) ? images.length : 0
              const foto = n === 0 ? 'nessuna foto' : n === 1 ? '1 foto' : `${n} foto`
              const nome = title || subtitle || text?.slice(0, 60)
              return {
                title: nome || 'Blocco senza titolo',
                subtitle: nome && text ? `${foto} · ${text.slice(0, 70)}` : foto,
                media,
              }
            },
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
    defineField({
      name: 'bookCta',
      title: 'Mostra "Prenota ora" grande a fine pagina',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'price',
      title: 'Prezzo mostrato nel form di prenotazione',
      type: 'string',
      hidden: ({ document }) =>
        (document?.slug as { current?: string } | undefined)?.current !== 'prenota',
    }),
  ],
  preview: {
    select: { title: 'title.it', subtitle: 'slug.current' },
  },
})

import { defineField, defineType } from 'sanity'
import { locales } from '../../lib/i18n'

const localeFields = (type: 'string' | 'text' | 'blockContent') =>
  locales.map((locale) =>
    defineField({
      name: locale,
      title: locale.toUpperCase(),
      type: type === 'blockContent' ? 'blockContent' : type,
      ...(type === 'text' ? { rows: 4 } : {}),
    })
  )

export const localeString = defineType({
  name: 'localeString',
  title: 'Testo (multilingua)',
  type: 'object',
  fields: localeFields('string'),
})

export const localeText = defineType({
  name: 'localeText',
  title: 'Testo lungo (multilingua)',
  type: 'object',
  fields: localeFields('text'),
})

export const localeBlock = defineType({
  name: 'localeBlock',
  title: 'Contenuto (multilingua)',
  type: 'object',
  fields: localeFields('blockContent'),
})

export const blockContent = defineType({
  name: 'blockContent',
  title: 'Contenuto',
  type: 'array',
  of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
})

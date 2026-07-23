import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Impostazioni sito',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Nome sito', type: 'string' }),
    defineField({ name: 'description', title: 'Descrizione', type: 'localeText' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'phone', title: 'Telefono', type: 'string' }),
    defineField({ name: 'address', title: 'Indirizzo', type: 'localeText' }),
    defineField({ name: 'instagram', title: 'Instagram', type: 'url' }),
    defineField({ name: 'ogImage', title: 'Immagine OG', type: 'image' }),
  ],
})

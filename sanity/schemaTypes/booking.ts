import { defineField, defineType } from 'sanity'

export const booking = defineType({
  name: 'booking',
  title: 'Prenotazione',
  type: 'document',
  readOnly: true,
  fields: [
    defineField({ name: 'name', title: 'Nome e cognome', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'phone', title: 'Telefono', type: 'string' }),
    defineField({ name: 'adults', title: 'Partecipanti sopra i 12 anni', type: 'number' }),
    defineField({ name: 'children', title: 'Partecipanti sotto i 12 anni', type: 'number' }),
    defineField({ name: 'newsletter', title: 'Iscrizione newsletter', type: 'boolean' }),
    defineField({ name: 'createdAt', title: 'Inviata il', type: 'datetime' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'createdAt' },
  },
})

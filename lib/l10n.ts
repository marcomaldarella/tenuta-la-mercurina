import type { Locale } from './i18n'

export function pick<T>(
  value: Partial<Record<Locale, T>> | null | undefined,
  locale: Locale
): T | undefined {
  if (!value) return undefined
  return value[locale] ?? value.it
}

export const ui = {
  menu: { it: 'menu', en: 'menu' },
  close: { it: 'close', en: 'close' },
  contact: { it: 'contattaci', en: 'contact us' },
  book: { it: 'prenota ora', en: 'book now' },
  send: { it: 'invia', en: 'send' },
  sending: { it: 'invio…', en: 'sending…' },
  sent: { it: 'richiesta inviata, grazie!', en: 'request sent, thank you!' },
  error: { it: 'qualcosa è andato storto, riprova.', en: 'something went wrong, retry.' },
  formName: { it: 'Nome Cognome', en: 'Full name' },
  formEmail: { it: 'Email', en: 'Email' },
  formPhone: { it: 'Telefono', en: 'Phone' },
  formAdults: {
    it: 'Numero partecipanti sopra i 12 anni',
    en: 'Participants over 12 years old',
  },
  formChildren: {
    it: 'Numero partecipanti sotto i 12 anni',
    en: 'Participants under 12 years old',
  },
  formNewsletter: {
    it: 'Voglio iscrivermi alla newsletter',
    en: 'I want to subscribe to the newsletter',
  },
  formPrivacy: {
    it: 'Accetto la privacy policy',
    en: 'I accept the privacy policy',
  },
  bookingTitle: { it: 'Prenota visita', en: 'Book your visit' },
  buyNow: { it: 'buy now', en: 'buy now' },
  privacy: { it: 'privacy e policy', en: 'privacy & policy' },
  instagram: { it: 'instagram', en: 'instagram' },
} as const

export type UiKey = keyof typeof ui

export function t(key: UiKey, locale: Locale): string {
  return ui[key][locale] ?? ui[key].it
}

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
  /* spezzata in due: la seconda parte è il link alla pagina */
  formPrivacy: {
    it: 'Accetto la',
    en: 'I accept the',
  },
  formPrivacyLink: {
    it: 'privacy policy',
    en: 'privacy policy',
  },
  bookingTitle: { it: 'Prenota visita', en: 'Book your visit' },
  buyNow: { it: 'buy now', en: 'buy now' },
  privacy: { it: 'privacy e policy', en: 'privacy & policy' },
  cookieNotice: { it: 'questo sito usa cookie', en: 'this website uses cookies' },
  cookieOk: { it: 'ok', en: 'ok' },
  instagram: { it: 'instagram', en: 'instagram' },
  discover: { it: 'scopri', en: 'discover' },
  backToEvents: { it: 'torna agli eventi', en: 'back to events' },
  /* blocco mercato su /eventi: al posto dell'elenco date (fine tuning 17/11) */
  marketGallery: { it: 'Scopri la gallery', en: 'Discover the gallery' },
  /* footer: riga sopra il logo Darefrutto (doc CT ULTIMO 10/11) */
  partOf: { it: 'tenuta lamercurina è parte di', en: 'tenuta lamercurina is part of' },
} as const

export type UiKey = keyof typeof ui

export function t(key: UiKey, locale: Locale): string {
  return ui[key][locale] ?? ui[key].it
}

/* mail CORREZIONI SITO 23/11: le date del mercato scritte per esteso
   ("11 ottobre 2026"), non più in cifre */
const MONTHS = {
  it: [
    'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
    'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre',
  ],
  en: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ],
} as const

export function formatDateLong(date: string, locale: Locale): string {
  const [year, month, day] = date.split('-').map(Number)
  const name = MONTHS[locale][month - 1]
  return locale === 'en'
    ? `${name} ${day}, ${year}`
    : `${day} ${name} ${year}`
}

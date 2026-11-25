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
  /* etichette CTA con l'iniziale maiuscola (Marco 23/11) */
  contact: { it: 'Contattaci', en: 'Contact us' },
  book: { it: 'Prenota ora', en: 'Book now' },
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
  discover: { it: 'Scopri', en: 'Discover' },
  backToEvents: { it: 'Torna agli eventi', en: 'Back to events' },
  /* blocco mercato su /eventi: al posto dell'elenco date (fine tuning 17/11) */
  marketGallery: { it: 'Scopri la gallery', en: 'Discover the gallery' },
  /* footer: riga sopra il logo Darefrutto (doc CT ULTIMO 10/11) */
  partOf: { it: 'tenuta lamercurina è parte di', en: 'tenuta lamercurina is part of' },
  /* /mercato (mail Chiara 24/11): un titolo di pagina unico in testa */
  marketPageTitle: {
    it: 'tenuta il mercato della domenica',
    en: 'tenuta the sunday market',
  },
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

/* mail Chiara 24/11: le edizioni del mercato numerate ("3ª edizione")
   al posto del nome ripetuto su ogni blocco */
export function formatEdition(n: number, locale: Locale): string {
  if (locale === 'en') {
    const suffix =
      n % 100 >= 11 && n % 100 <= 13
        ? 'th'
        : (['th', 'st', 'nd', 'rd'][n % 10] ?? 'th')
    return `${n}${suffix} edition`
  }
  return `${n}ª edizione`
}

export function formatDateLong(date: string, locale: Locale): string {
  const [year, month, day] = date.split('-').map(Number)
  const name = MONTHS[locale][month - 1]
  return locale === 'en'
    ? `${name} ${day}, ${year}`
    : `${day} ${name} ${year}`
}

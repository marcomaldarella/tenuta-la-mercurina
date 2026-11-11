export const locales = ['it', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'it'

/* prima release SOLO in italiano (richiesta cliente 11/11/2026): le
   pagine EN restano nel codice e nel CMS ma non sono raggiungibili.
   Per riaccendere l'inglese basta rimettere `locales` qui sotto */
export const onlineLocales: readonly Locale[] = ['it']

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

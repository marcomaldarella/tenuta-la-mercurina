import { createClient } from 'next-sanity'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'placeholder'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
export const apiVersion = '2026-07-01'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // niente CDN Sanity: ogni pagina è già force-dynamic (zero cache Next),
  // quindi la CDN non dava alcun vantaggio reale ma introduceva fino a ~60s
  // di ritardo tra una scrittura e il momento in cui appariva sul sito
  useCdn: false,
})

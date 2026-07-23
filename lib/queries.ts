import { groq } from 'next-sanity'
import { client } from './sanity/client'

const imageProjection = `{ "assetRef": asset._ref, hotspot, crop, "lqip": asset->metadata.lqip }`

export type SanityImage = {
  assetRef: string
  hotspot?: { x: number; y: number }
  crop?: { top: number; bottom: number; left: number; right: number }
  lqip?: string
}

export type L10n<T = string> = { it?: T; en?: T }

export type Section = {
  _key: string
  title?: L10n
  text?: L10n
  images?: SanityImage[]
  cta?: 'none' | 'contatti' | 'prenota' | 'page'
  pageSlug?: string
}

export type Page = {
  title?: L10n
  slug: string
  hero?: { images?: SanityImage[]; text?: L10n }
  sections?: Section[]
  details?: L10n<unknown[]>
  endCta?: boolean
}

export type MarketDate = {
  _id: string
  date: string
  text?: L10n
  images?: SanityImage[]
  bookable?: boolean
}

export type SiteSettings = {
  title?: string
  description?: L10n
  email?: string
  phone?: string
  address?: L10n
  instagram?: string
}

export async function getPage(slug: string): Promise<Page | null> {
  return client.fetch(
    groq`*[_type == "page" && slug.current == $slug][0]{
      title,
      "slug": slug.current,
      hero{ "images": images[]${imageProjection}, text },
      sections[]{
        _key, title, text, cta,
        "images": images[]${imageProjection},
        "pageSlug": page->slug.current
      },
      details,
      endCta
    }`,
    { slug }
  )
}

export async function getMarketDates(): Promise<MarketDate[]> {
  return client.fetch(
    groq`*[_type == "marketDate"] | order(date desc){
      _id, date, text, bookable,
      "images": images[]${imageProjection}
    }`
  )
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch(
    groq`*[_type == "siteSettings"][0]{ title, description, email, phone, address, instagram }`
  )
}

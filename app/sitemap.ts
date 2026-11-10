import type { MetadataRoute } from 'next'
import { locales } from '../lib/i18n'
import { topLevelSlugs } from '../lib/nav'
import { getMarketDates } from '../lib/queries'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tenutalamercurina.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /* le gallery del mercato esistono solo per le edizioni con foto */
  const marketDates = await getMarketDates()
  const paths = [
    '',
    ...topLevelSlugs.map((slug) => `/${slug}`),
    '/prenota',
    '/privacy-policy',
    ...marketDates
      .filter((entry) => entry.images?.length)
      .map((entry) => `/mercato/${entry.date}`),
  ]

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${siteUrl}/${l}${path}`])
        ),
      },
    }))
  )
}

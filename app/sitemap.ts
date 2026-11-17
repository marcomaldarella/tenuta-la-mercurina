import type { MetadataRoute } from 'next'
import { onlineLocales } from '../lib/i18n'
import { topLevelSlugs } from '../lib/nav'
import { getMarketDates } from '../lib/queries'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tenutalamercurina.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /* la gallery del mercato (pagina unica) esiste solo se almeno
     un'edizione ha foto */
  const marketDates = await getMarketDates()
  const paths = [
    '',
    ...topLevelSlugs.map((slug) => `/${slug}`),
    '/prenota',
    '/privacy-policy',
    ...(marketDates.some((entry) => entry.images?.length) ? ['/mercato'] : []),
  ]

  return paths.flatMap((path) =>
    onlineLocales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          onlineLocales.map((l) => [l, `${siteUrl}/${l}${path}`])
        ),
      },
    }))
  )
}

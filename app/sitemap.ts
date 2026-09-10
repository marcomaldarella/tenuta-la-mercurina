import type { MetadataRoute } from 'next'
import { locales } from '../lib/i18n'
import { topLevelSlugs } from '../lib/nav'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tenutalamercurina.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', ...topLevelSlugs.map((slug) => `/${slug}`), '/prenota']

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

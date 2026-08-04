import type { Metadata, Viewport } from 'next'
import { DM_Sans } from 'next/font/google'
import { notFound } from 'next/navigation'
import Footer from '../../../components/Footer'
import Header from '../../../components/Header'
import SmoothScroll from '../../../components/SmoothScroll'
import { isLocale, locales, type Locale } from '../../../lib/i18n'
import { pick } from '../../../lib/l10n'
import { getSiteSettings } from '../../../lib/queries'
import '../../globals.css'

const dmSans = DM_Sans({ subsets: ['latin'] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tenutalamercurina.com'

export const viewport: Viewport = {
  themeColor: '#faf1e6',
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const settings = await getSiteSettings()
  const description = isLocale(locale)
    ? pick(settings?.description, locale)
    : undefined

  return {
    title: {
      default: 'Tenuta Lamercurina',
      template: '%s — Tenuta Lamercurina',
    },
    description: description ?? 'Tenuta Lamercurina — Pieve del Cairo, Pavia',
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
    openGraph: {
      siteName: 'Tenuta Lamercurina',
      locale: locale === 'it' ? 'it_IT' : 'en_US',
      type: 'website',
      images: [
        { url: '/og-image.png', width: 1200, height: 630, alt: 'Tenuta Lamercurina' },
        { url: '/og-image-1920.png', width: 1920, height: 1080, alt: 'Tenuta Lamercurina' },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: ['/twitter-card.png'],
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const settings = await getSiteSettings()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Tenuta Lamercurina',
    url: siteUrl,
    email: settings?.email,
    telephone: settings?.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Via Cascina San Marzano, 5',
      addressLocality: 'Pieve del Cairo',
      addressRegion: 'Pavia',
      addressCountry: 'IT',
    },
    sameAs: settings?.instagram ? [settings.instagram] : undefined,
  }

  return (
    <html lang={locale}>
      <body className={dmSans.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll />
        <Header
          locale={locale as Locale}
          phone={settings?.phone}
          email={settings?.email}
          instagram={settings?.instagram}
        />
        {children}
        <Footer locale={locale as Locale} settings={settings} />
      </body>
    </html>
  )
}

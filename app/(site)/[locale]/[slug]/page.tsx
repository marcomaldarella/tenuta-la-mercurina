import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { PortableTextBlock } from 'next-sanity'
import Arrow from '../../../../components/Arrow'
import Hero from '../../../../components/Hero'
import RichText from '../../../../components/RichText'
import SectionRow from '../../../../components/SectionRow'
import type { Locale } from '../../../../lib/i18n'
import { pick, t } from '../../../../lib/l10n'
import { getMarketDates, getPage, type Section } from '../../../../lib/queries'
import { imageUrls } from '../../../../lib/sanity/image'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

// pagine con bottone "prenota ora" a fine pagina (colonna E dell'xls cliente)
const BOOK_PAGES = [
  'percorsi',
  'workshop-floreali',
  'visite-e-lezioni',
  'il-mercato',
  'pranzo-a-tema',
]

type Params = Promise<{ locale: Locale; slug: string }>

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const { locale, slug } = await params
  const page = await getPage(slug)
  const title = pick(page?.title, locale)
  return title ? { title } : {}
}

function formatDate(date: string): string {
  const [year, month, day] = date.split('-')
  return `${day}.${month}.${year}`
}

export default async function ContentPage({ params }: { params: Params }) {
  const { locale, slug } = await params
  if (slug === 'home') notFound()

  const page = await getPage(slug)
  if (!page) notFound()

  const isMarket = slug === 'il-mercato'
  const marketDates = isMarket ? await getMarketDates() : []
  const today = new Date().toISOString().slice(0, 10)

  const sections: Array<{
    key: string
    title?: string
    subtitle?: string
    text?: string
    urls: string[]
    cta?: { label: string; href: string }
  }> = isMarket
    ? marketDates.map((entry) => ({
        key: entry._id,
        title: formatDate(entry.date),
        text: pick(entry.text, locale),
        urls: imageUrls(entry.images, 1200),
        cta:
          entry.bookable && entry.date >= today
            ? { label: t('book', locale), href: `/${locale}/prenota` }
            : undefined,
      }))
    : (page.sections ?? []).map((section: Section) => ({
        key: section._key,
        title: pick(section.title, locale),
        subtitle: pick(section.subtitle, locale),
        text: pick(section.text, locale),
        urls: imageUrls(section.images, 1200),
        cta:
          section.cta === 'contatti'
            ? { label: t('contact', locale), href: `/${locale}/contatti` }
            : section.cta === 'prenota'
              ? { label: t('book', locale), href: `/${locale}/prenota` }
              : undefined,
      }))

  const details = pick(page.details, locale) as PortableTextBlock[] | undefined

  return (
    <main>
      <Hero
        urls={imageUrls(page.hero?.images)}
        heading={pick(page.hero?.heading, locale)}
        subheading={pick(page.hero?.subheading, locale)}
        text={pick(page.hero?.text, locale)}
      />
      {sections.map((section, index) => (
        <SectionRow
          key={section.key}
          title={section.title}
          subtitle={section.subtitle}
          text={section.text}
          urls={section.urls}
          reverse={index % 2 === 1}
          cta={section.cta}
        />
      ))}
      {details && details.length > 0 && <RichText value={details} />}
      {BOOK_PAGES.includes(slug) && (
        <Link href={`/${locale}/prenota`} className={styles.endCta}>
          {t('book', locale)} <Arrow />
        </Link>
      )}
      {page.endCta && (
        <Link href={`/${locale}/contatti`} className={styles.endCta}>
          {t('contact', locale)} <Arrow />
        </Link>
      )}
    </main>
  )
}

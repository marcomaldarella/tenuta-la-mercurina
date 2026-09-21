import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { PortableTextBlock } from 'next-sanity'
import Arrow from '../../../../components/Arrow'
import GroupSection from '../../../../components/GroupSection'
import Hero from '../../../../components/Hero'
import RichText from '../../../../components/RichText'
import SectionRow from '../../../../components/SectionRow'
import type { Locale } from '../../../../lib/i18n'
import { pick, t } from '../../../../lib/l10n'
import { anchorGroups } from '../../../../lib/nav'
import {
  getMarketDates,
  getPage,
  type Page,
  type Section,
} from '../../../../lib/queries'
import { imageUrls } from '../../../../lib/sanity/image'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

type Params = Promise<{ locale: Locale; slug: string }>

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const { locale, slug } = await params
  const group = anchorGroups[slug]
  if (group) return { title: group.label[locale] }
  const page = await getPage(slug)
  const title = pick(page?.title, locale)
  return title ? { title } : {}
}

function formatDate(date: string): string {
  const [year, month, day] = date.split('-')
  return `${day}.${month}.${year}`
}

type RowData = {
  key: string
  title?: string
  subtitle?: string
  text?: string
  urls: string[]
  cta?: { label: string; href: string }
}

function pageRows(page: Page, locale: Locale): RowData[] {
  return (page.sections ?? []).map((section: Section) => ({
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
}

function PageBlocks({
  page,
  locale,
  rows,
  headingTag,
}: {
  page: Page
  locale: Locale
  rows: RowData[]
  headingTag?: 'h1' | 'h2'
}) {
  const details = pick(page.details, locale) as PortableTextBlock[] | undefined

  return (
    <>
      <Hero
        urls={imageUrls(page.hero?.images)}
        heading={pick(page.hero?.heading, locale)}
        subheading={pick(page.hero?.subheading, locale)}
        text={pick(page.hero?.text, locale)}
        headingTag={headingTag}
      />
      {rows.map((section, index) => (
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
      {page.bookCta && (
        <Link href={`/${locale}/prenota`} className={styles.endCta}>
          {t('book', locale)}
          <Arrow />
        </Link>
      )}
      {page.endCta && (
        <Link href={`/${locale}/contatti`} className={styles.endCta}>
          {t('contact', locale)}
          <Arrow />
        </Link>
      )}
    </>
  )
}

export default async function ContentPage({ params }: { params: Params }) {
  const { locale, slug } = await params
  if (slug === 'home') notFound()

  // pagina unica (tenuta / foresteria), dal figma 01_Homepage01: un solo
  // hero, poi le sotto-pagine come blocchi editoriali alternati, ognuno
  // ancorato al proprio slug per lo scroll dalle voci di menu
  const group = anchorGroups[slug]
  if (group) {
    /* le voci CTA (href, es. "crea la tua esperienza") non sono sotto-pagine:
       non hanno un doc Sanity da interrogare né un blocco da renderizzare,
       sono link secchi già gestiti dall'header */
    const anchorItems = group.items.filter((item) => !item.href)
    const hasMarket = anchorItems.some((item) => item.slug === 'il-mercato')
    const [pages, fondazione, groupPage, marketDatesInGroup] = await Promise.all([
      Promise.all(anchorItems.map((item) => getPage(item.slug))),
      slug === 'tenuta' ? getPage('fondazione') : Promise.resolve(null),
      group.heroFrom ? getPage(group.heroFrom) : Promise.resolve(null),
      hasMarket ? getMarketDates() : Promise.resolve([]),
    ])
    const todayInGroup = new Date().toISOString().slice(0, 10)

    const blocks = anchorItems.flatMap((item, index) => {
      const page = pages[index]
      if (!page) return []
      /* il mercato non ha sezioni: il suo contenuto sono le date */
      const dateParts =
        item.slug === 'il-mercato'
          ? marketDatesInGroup.map((entry) => ({
              key: entry._id,
              title: formatDate(entry.date),
              text: pick(entry.text, locale),
            }))
          : []
      return [
        {
          id: item.slug,
          title: item.label[locale],
          parts: [
            ...(page.sections ?? []).map((section: Section) => ({
              key: section._key,
              title: pick(section.title, locale),
              text: pick(section.text, locale),
            })),
            ...dateParts,
          ],
          /* se la sotto-pagina non ha sezioni con foto (il mercato) la
             gallery del blocco resta vuota: si usa il suo hero */
          urls: (() => {
            const fromSections = (page.sections ?? []).flatMap((section: Section) =>
              imageUrls(section.images, 1200)
            )
            return fromSections.length
              ? fromSections
              : imageUrls(page.hero?.images, 1200)
          })(),
          /* le pagine con bookCta portavano "prenota ora" in fondo: da blocco
             il bottone resta, ancorato alla sua sezione */
          cta: (
            page.bookCta ||
            (item.slug === 'il-mercato' &&
              marketDatesInGroup.some(
                (entry) => entry.bookable && entry.date >= todayInGroup
              ))
              ? { label: t('book', locale), href: `/${locale}/prenota` }
              : undefined
          ) as { label: string; href: string } | undefined,
        },
      ]
    })
    if (blocks.length === 0) notFound()

    // sezione rigenerazione dopo "la storia": pesca dalla pagina fondazione
    // (fuori nav) e rimanda lì, come nel figma
    const rigenerazione = fondazione?.sections?.find((section) =>
      pick(section.title, locale)?.toLowerCase().includes('rigenerazione')
    )
    if (rigenerazione) {
      const at = blocks.findIndex((block) => block.id === 'la-storia') + 1
      blocks.splice(at > 0 ? at : blocks.length, 0, {
        id: 'rigenerazione',
        title: locale === 'en' ? 'regeneration' : 'rigenerazione',
        parts: [
          { key: 'rigenerazione', title: undefined, text: pick(rigenerazione.text, locale) },
        ],
        /* l'hero della fondazione solo come tappabuchi: se la sezione ha
           già le sue foto, la gallery resta quella */
        urls: rigenerazione.images?.length
          ? imageUrls(rigenerazione.images, 1200)
          : imageUrls(fondazione?.hero?.images, 1200),
        cta: {
          label: locale === 'en' ? 'Discover the Foundation' : 'Scopri la Fondazione',
          href: `/${locale}/fondazione`,
        },
      })
    }

    const heroPage =
      groupPage ?? pages.find((page): page is Page => Boolean(page))

    return (
      <main>
        <Hero
          urls={imageUrls(heroPage?.hero?.images)}
          heading={pick(heroPage?.hero?.heading, locale)}
          subheading={pick(heroPage?.hero?.subheading, locale)}
          text={pick(heroPage?.hero?.text, locale)}
        />
        {blocks.map((block, index) => (
          <GroupSection
            key={block.id}
            id={block.id}
            title={block.title}
            parts={block.parts}
            urls={block.urls}
            reverse={index % 2 === 1}
            cta={block.cta}
          />
        ))}
      </main>
    )
  }

  const page = await getPage(slug)
  if (!page) notFound()

  const isMarket = slug === 'il-mercato'
  const marketDates = isMarket ? await getMarketDates() : []
  const today = new Date().toISOString().slice(0, 10)

  const rows: RowData[] = isMarket
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
    : pageRows(page, locale)

  return (
    <main>
      <PageBlocks page={page} locale={locale} rows={rows} />
    </main>
  )
}

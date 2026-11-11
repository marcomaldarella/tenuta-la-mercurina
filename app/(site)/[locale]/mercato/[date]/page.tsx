import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import GroupSection from '../../../../../components/GroupSection'
import type { Locale } from '../../../../../lib/i18n'
import { t } from '../../../../../lib/l10n'
import { anchorGroups } from '../../../../../lib/nav'
import { getMarketDates } from '../../../../../lib/queries'
import { imageUrls } from '../../../../../lib/sanity/image'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

/* galleria di un'edizione del mercato: stessa resa dei blocchi delle pagine
   unite (titolo grande + carousel con frecce), raggiunta dalla data su /eventi */

function formatDate(date: string): string {
  const [year, month, day] = date.split('-')
  return `${day}.${month}.${year}`
}

const marketLabel = anchorGroups.eventi.items.find(
  (item) => item.slug === 'il-mercato'
)?.label

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; date: string }>
}): Promise<Metadata> {
  const { locale, date } = await params
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return {}
  return { title: `${marketLabel?.[locale] ?? 'il mercato della domenica'} — ${formatDate(date)}` }
}

export default async function MercatoGalleryPage({
  params,
}: {
  params: Promise<{ locale: Locale; date: string }>
}) {
  const { locale, date } = await params
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound()

  const entry = (await getMarketDates()).find((item) => item.date === date)
  if (!entry || !entry.images?.length) notFound()

  return (
    <main className={styles.main}>
      {/* titolo grande = il nome del mercato, la data fa da titoletto
          (richiesta Marco 11/11: prima erano invertiti) */}
      <GroupSection
        id="gallery"
        title={marketLabel?.[locale] ?? formatDate(date)}
        parts={[{ key: 'label', title: formatDate(date) }]}
        urls={imageUrls(entry.images, 1200)}
        cta={{ label: t('backToEvents', locale), href: `/${locale}/eventi#il-mercato` }}
      />
    </main>
  )
}

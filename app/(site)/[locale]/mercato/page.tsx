import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import GroupSection from '../../../../components/GroupSection'
import type { Locale } from '../../../../lib/i18n'
import { pick, t } from '../../../../lib/l10n'
import { anchorGroups } from '../../../../lib/nav'
import { getMarketDates } from '../../../../lib/queries'
import { imageUrls } from '../../../../lib/sanity/image'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

/* gallery unica del mercato (fine tuning 17/11, prima una pagina per data):
   un blocco per edizione, allineamenti alternati — prima data testo a
   sinistra e foto a destra, seconda il contrario */

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
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  return { title: marketLabel?.[locale] ?? 'il mercato della domenica' }
}

export default async function MercatoGalleryPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params

  const entries = (await getMarketDates()).filter(
    (entry) => entry.images?.length
  )
  if (entries.length === 0) notFound()

  return (
    <main className={styles.main}>
      {entries.map((entry, index) => (
        <GroupSection
          key={entry._id}
          id={entry.date}
          /* la data è il titolo grande della sua sezione, il nome del
             mercato fa da titoletto */
          title={formatDate(entry.date)}
          parts={[
            {
              key: 'label',
              title: marketLabel?.[locale],
              text: pick(entry.text, locale),
            },
          ]}
          urls={imageUrls(entry.images, 1200)}
          reverse={index % 2 === 1}
          cta={
            index === entries.length - 1
              ? {
                  label: t('backToEvents', locale),
                  href: `/${locale}/eventi#il-mercato`,
                }
              : undefined
          }
        />
      ))}
    </main>
  )
}

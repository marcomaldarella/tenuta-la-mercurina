import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import GroupSection from '../../../../components/GroupSection'
import type { Locale } from '../../../../lib/i18n'
import { formatDateLong, formatEdition, pick, t } from '../../../../lib/l10n'
import { getMarketDates } from '../../../../lib/queries'
import { imageUrls } from '../../../../lib/sanity/image'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

/* gallery unica del mercato (fine tuning 17/11, prima una pagina per data):
   un blocco per edizione, allineamenti alternati — prima data testo a
   sinistra e foto a destra, seconda il contrario */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  return { title: t('marketPageTitle', locale) }
}

export default async function MercatoGalleryPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params

  /* mail CORREZIONI SITO 23/11: entrano anche le edizioni raccontate solo
     a parole (le tre del 2025 non hanno foto) */
  const entries = (await getMarketDates()).filter(
    (entry) => entry.images?.length || entry.text?.it
  )
  if (entries.length === 0) notFound()

  /* mail Chiara 24/11: i blocchi restano dal più recente, ma la numerazione
     delle edizioni è cronologica (la più vecchia è la 1ª) */
  const byDate = [...entries].sort((a, b) => a.date.localeCompare(b.date))
  const editionOf = new Map(byDate.map((entry, i) => [entry._id, i + 1]))

  return (
    <main className={styles.main}>
      {/* 25/11: il titolo in pagina è stato tolto — "tenuta il mercato della
          domenica" resta solo su /eventi. Qui regge la gerarchia dei titoli
          senza farsi vedere */}
      <h1 className={styles.pageTitle}>{t('marketPageTitle', locale)}</h1>
      {entries.map((entry, index) => (
        <GroupSection
          key={entry._id}
          id={entry.date}
          /* la data è il titolo grande della sua sezione, il numero di
             edizione fa da titoletto (mail 24/11, prima il nome ripetuto) */
          title={formatDateLong(entry.date, locale)}
          parts={[
            {
              key: 'label',
              title: formatEdition(editionOf.get(entry._id) ?? 1, locale),
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

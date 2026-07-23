import type { Metadata } from 'next'
import type { PortableTextBlock } from 'next-sanity'
import BookingForm from '../../../../components/BookingForm'
import RichText from '../../../../components/RichText'
import type { Locale } from '../../../../lib/i18n'
import { pick } from '../../../../lib/l10n'
import { getPage } from '../../../../lib/queries'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  return { title: locale === 'en' ? 'Book your visit' : 'Prenota la tua visita' }
}

export default async function BookingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const page = await getPage('prenota')
  const intro = pick(page?.details, locale) as PortableTextBlock[] | undefined

  return (
    <main className={styles.main}>
      {intro && intro.length > 0 && <RichText value={intro} />}
      <BookingForm locale={locale} />
    </main>
  )
}

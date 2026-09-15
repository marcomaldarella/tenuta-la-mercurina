import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { PortableTextBlock } from 'next-sanity'
import RichText from '../../../../components/RichText'
import type { Locale } from '../../../../lib/i18n'
import { pick } from '../../../../lib/l10n'
import { getPage } from '../../../../lib/queries'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

const SLUG = 'privacy-policy'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const page = await getPage(SLUG)
  return { title: pick(page?.title, locale) ?? 'privacy policy' }
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const page = await getPage(SLUG)
  if (!page) notFound()

  const body = pick(page.details, locale) as PortableTextBlock[] | undefined

  return (
    /* testo legale: i titoli restano leggibili ma non alla scala display
       delle altre pagine (RichText usa --display per gli h2) */
    <main
      className={styles.main}
      style={{ '--display': 'clamp(22px, 2.4vw, 30px)' } as React.CSSProperties}
    >
      <h1 className={styles.title}>{pick(page.title, locale) ?? 'privacy policy'}</h1>
      {body && body.length > 0 && <RichText value={body} />}
    </main>
  )
}

import type { Metadata } from 'next'
import FixedPage from '../../../../components/FixedPage'
import type { Locale } from '../../../../lib/i18n'
import { pick } from '../../../../lib/l10n'
import { getSiteSettings } from '../../../../lib/queries'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  return { title: locale === 'en' ? 'Contacts' : 'Contatti' }
}

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const settings = await getSiteSettings()

  const address =
    pick(settings?.address, locale) ??
    'Tenuta Lamercurina\nVia Cascina San Marzano, 5\nPieve del Cairo, Pavia'

  const emailLink = settings?.email ? `mailto:${settings.email}` : '#'
  const instagramLink = settings?.instagram ?? '#'

  return (
    <main className={styles.main}>
      <FixedPage />
      <h1 className={styles.block}>
        {address.split('\n').map((line) => (
          <span key={line} className={styles.line}>
            {line}
          </span>
        ))}
      </h1>
      <p className={styles.block}>
        {locale === 'en' ? (
          <>
            <span className={styles.line}>
              Write us an <a href={emailLink}>email</a>,
            </span>
            <span className={styles.line}>
              follow us on{' '}
              <a href={instagramLink} target="_blank" rel="noreferrer">
                Instagram
              </a>
              .
            </span>
          </>
        ) : (
          <>
            <span className={styles.line}>
              Scrivici una <a href={emailLink}>email</a>,
            </span>
            <span className={styles.line}>
              seguici su{' '}
              <a href={instagramLink} target="_blank" rel="noreferrer">
                Instagram
              </a>
              .
            </span>
          </>
        )}
      </p>
    </main>
  )
}

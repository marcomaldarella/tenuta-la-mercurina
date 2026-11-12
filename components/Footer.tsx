import Link from 'next/link'
import type { Locale } from '../lib/i18n'
import { t } from '../lib/l10n'
import type { SiteSettings } from '../lib/queries'
import styles from './Footer.module.css'

export default function Footer({
  locale,
  settings,
}: {
  locale: Locale
  settings: SiteSettings | null
}) {
  return (
    <footer className={styles.footer}>
      <div className={styles.col}>
        {settings?.instagram && (
          <a href={settings.instagram} target="_blank" rel="noreferrer">
            {t('instagram', locale)}
          </a>
        )}
        {settings?.phone &&
          (settings.whatsapp ? (
            /* il numero apre la chat WhatsApp della Tenuta */
            <a href={settings.whatsapp} target="_blank" rel="noreferrer">
              {settings.phone}
            </a>
          ) : (
            <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a>
          ))}
        {settings?.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
        <Link href={`/${locale}/privacy-policy`}>{t('privacy', locale)}</Link>
      </div>
      <a
        href="https://www.fondazionedarefrutto.it/"
        target="_blank"
        rel="noreferrer"
        className={styles.foundationLink}
        aria-label="Fondazione Darefrutto"
      >
        {/* doc CT ULTIMO 10/11: riga di appartenenza prima del logo */}
        <span className={styles.foundationText}>{t('partOf', locale)}</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logos/darefrutto-trim.png"
          alt="Fondazione Darefrutto"
          className={styles.foundationLogo}
        />
      </a>
    </footer>
  )
}

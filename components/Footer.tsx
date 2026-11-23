import Link from 'next/link'
import ContactIcon from './ContactIcon'
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
      {/* mail CORREZIONI SITO 23/11: nel piede restano solo il simbolo
          instagram e la privacy — telefono e mail vivono su /contatti */}
      <div className={styles.col}>
        {settings?.instagram && (
          <a
            href={settings.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className={styles.iconLink}
          >
            <ContactIcon name="instagram" size="1.15em" />
          </a>
        )}
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

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
      <div className={styles.left}>
        {settings?.instagram && (
          <a href={settings.instagram} target="_blank" rel="noreferrer">
            {t('instagram', locale)}
          </a>
        )}
        {settings?.phone && (
          <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a>
        )}
        {settings?.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
      </div>
      <span>{t('privacy', locale)}</span>
    </footer>
  )
}

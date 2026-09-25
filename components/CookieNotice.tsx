'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { Locale } from '../lib/i18n'
import { t } from '../lib/l10n'
import styles from './CookieNotice.module.css'

const KEY = 'cookie-ok'

export default function CookieNotice({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setVisible(true)
  }, [])

  if (!visible) return null

  return (
    <div className={styles.notice}>
      <span>
        {t('cookieNotice', locale)}{' '}
        <Link href={`/${locale}/privacy-policy`}>{t('privacy', locale)}</Link>
      </span>
      <button
        type="button"
        className={styles.ok}
        onClick={() => {
          localStorage.setItem(KEY, '1')
          setVisible(false)
        }}
      >
        {t('cookieOk', locale)}
      </button>
    </div>
  )
}

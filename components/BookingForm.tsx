'use client'

import { useActionState } from 'react'
import { createBooking, type BookingState } from '../lib/actions'
import type { Locale } from '../lib/i18n'
import { t } from '../lib/l10n'
import styles from './BookingForm.module.css'

const initialState: BookingState = { status: 'idle' }

export default function BookingForm({
  locale,
  price,
}: {
  locale: Locale
  price?: string
}) {
  const [state, formAction, pending] = useActionState(createBooking, initialState)

  if (state.status === 'ok') {
    return <p className={styles.confirmation}>{t('sent', locale)}</p>
  }

  return (
    <form action={formAction} className={styles.form}>
      <input
        className={styles.field}
        name="name"
        placeholder={t('formName', locale)}
        required
      />
      <input
        className={styles.field}
        name="email"
        type="email"
        placeholder={t('formEmail', locale)}
        required
      />
      <input
        className={styles.field}
        name="phone"
        type="tel"
        placeholder={t('formPhone', locale)}
      />
      <input
        className={styles.field}
        name="adults"
        type="number"
        min="0"
        placeholder={t('formAdults', locale)}
      />
      <input
        className={styles.field}
        name="children"
        type="number"
        min="0"
        placeholder={t('formChildren', locale)}
      />

      <div className={styles.footer}>
        <div className={styles.checks}>
          <label className={styles.newsletter}>
            <input type="checkbox" name="newsletter" />
            {t('formNewsletter', locale)}
          </label>
          <label className={styles.newsletter}>
            <input type="checkbox" name="privacy" required />
            {t('formPrivacy', locale)}
          </label>
        </div>

        <div className={styles.actions}>
          {price && <span className={styles.price}>{price}</span>}
          <button className={styles.submit} type="submit" disabled={pending}>
            {pending ? t('sending', locale) : t('buyNow', locale)}
          </button>
        </div>
      </div>

      {state.status === 'error' && <p className={styles.error}>{t('error', locale)}</p>}
    </form>
  )
}

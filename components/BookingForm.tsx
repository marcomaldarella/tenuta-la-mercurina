'use client'

import { useActionState } from 'react'
import { createBooking, type BookingState } from '../lib/actions'
import Arrow from './Arrow'
import type { Locale } from '../lib/i18n'
import { t } from '../lib/l10n'
import styles from './BookingForm.module.css'

const initialState: BookingState = { status: 'idle' }

export default function BookingForm({ locale }: { locale: Locale }) {
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

      <label className={styles.newsletter}>
        <input type="checkbox" name="newsletter" />
        {t('formNewsletter', locale)}
      </label>

      <button className={styles.submit} type="submit" disabled={pending}>
        {pending ? t('sending', locale) : t('send', locale)} <Arrow />
      </button>

      {state.status === 'error' && <p className={styles.error}>{t('error', locale)}</p>}
    </form>
  )
}

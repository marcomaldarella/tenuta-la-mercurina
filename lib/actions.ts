'use server'

import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from './sanity/client'

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

export type BookingState = { status: 'idle' | 'ok' | 'error' }

// notifica via Resend; si attiva da sola quando su Vercel esistono
// RESEND_API_KEY, BOOKING_EMAIL_FROM (mittente sul dominio verificato)
// e BOOKING_EMAIL_TO (chi riceve le richieste in tenuta)
async function notifyBooking(fields: Record<string, string>) {
  const key = process.env.RESEND_API_KEY
  const from = process.env.BOOKING_EMAIL_FROM
  const to = process.env.BOOKING_EMAIL_TO
  if (!key || !from || !to) return
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: fields.email,
        subject: `Nuova prenotazione — ${fields.name}`,
        text: Object.entries(fields)
          .map(([k, v]) => `${k}: ${v}`)
          .join('\n'),
      }),
    })
  } catch {
    // la prenotazione è già salvata in Sanity: la mail non deve mai bloccarla
  }
}

export async function createBooking(
  _prev: BookingState,
  formData: FormData
): Promise<BookingState> {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  if (!name || !email) return { status: 'error' }

  const phone = String(formData.get('phone') ?? '').trim()
  const adults = Number(formData.get('adults') ?? 0) || 0
  const children = Number(formData.get('children') ?? 0) || 0
  const newsletter = formData.get('newsletter') === 'on'

  try {
    await writeClient.create({
      _type: 'booking',
      name,
      email,
      phone,
      adults,
      children,
      newsletter,
      createdAt: new Date().toISOString(),
    })
    await notifyBooking({
      name,
      email,
      phone,
      adulti: String(adults),
      bambini: String(children),
      newsletter: newsletter ? 'sì' : 'no',
    })
    return { status: 'ok' }
  } catch {
    return { status: 'error' }
  }
}

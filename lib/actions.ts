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

export async function createBooking(
  _prev: BookingState,
  formData: FormData
): Promise<BookingState> {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  if (!name || !email) return { status: 'error' }

  try {
    await writeClient.create({
      _type: 'booking',
      name,
      email,
      phone: String(formData.get('phone') ?? '').trim(),
      adults: Number(formData.get('adults') ?? 0) || 0,
      children: Number(formData.get('children') ?? 0) || 0,
      newsletter: formData.get('newsletter') === 'on',
      createdAt: new Date().toISOString(),
    })
    return { status: 'ok' }
  } catch {
    return { status: 'error' }
  }
}

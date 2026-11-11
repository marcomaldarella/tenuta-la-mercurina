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

// mail via Resend; si attivano da sole quando su Vercel esistono
// RESEND_API_KEY, BOOKING_EMAIL_FROM (mittente sul dominio verificato)
// e BOOKING_EMAIL_TO (chi riceve le richieste in tenuta)

const CREMA = '#faf1e6'
const MARRONE = '#5c4632'
const FILO = '#e3d7c6'

/* guscio comune delle mail: crema, logo in alto, firma coi contatti.
   Tutto inline e a tabelle (i client di posta ignorano i fogli di stile);
   il logo è un png nel repo, servito dal sito */
function emailShell(contenuto: string) {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tenutalamercurina.it'
  return `<!doctype html><html><body style="margin:0;padding:0;background:${CREMA};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREMA};">
    <tr><td align="center" style="padding:40px 20px;">
      <table role="presentation" width="540" cellpadding="0" cellspacing="0" style="max-width:540px;width:100%;">
        <tr><td style="padding-bottom:32px;">
          <img src="${site}/logos/email-logo.png" width="150" alt="tenuta lamercurina" style="display:block;border:0;" />
        </td></tr>
        <tr><td style="font-family:Helvetica,Arial,sans-serif;color:${MARRONE};font-size:15px;line-height:1.55;">
          ${contenuto}
        </td></tr>
        <tr><td style="padding-top:36px;border-top:1px solid ${FILO};font-family:Helvetica,Arial,sans-serif;color:${MARRONE};font-size:12px;line-height:1.7;">
          <span style="margin-top:36px;display:block;">
          Tenuta Lamercurina<br/>
          Strada Provinciale Mede — Via Cascina San Marzano 5, 27037 Pieve del Cairo (PV)<br/>
          <a href="tel:+393666937053" style="color:${MARRONE};">+39 3666937053</a> ·
          <a href="mailto:info@tenutalamercurina.it" style="color:${MARRONE};">info@tenutalamercurina.it</a> ·
          <a href="${site}" style="color:${MARRONE};">${site.replace('https://', '')}</a>
          </span>
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`
}

function rigaDato(label: string, valore: string) {
  return `<tr>
    <td style="font-family:Helvetica,Arial,sans-serif;color:${MARRONE};font-size:14px;padding:7px 24px 7px 0;border-bottom:1px solid ${FILO};opacity:.65;">${label}</td>
    <td style="font-family:Helvetica,Arial,sans-serif;color:${MARRONE};font-size:14px;padding:7px 0;border-bottom:1px solid ${FILO};">${valore}</td>
  </tr>`
}

async function sendEmail(payload: Record<string, unknown>) {
  const key = process.env.RESEND_API_KEY
  if (!key) return
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  } catch {
    // la prenotazione è già salvata in Sanity: la mail non deve mai bloccarla
  }
}

async function notifyBooking(fields: Record<string, string>) {
  const from = process.env.BOOKING_EMAIL_FROM
  const to = process.env.BOOKING_EMAIL_TO
  if (!from || !to) return
  const righe =
    rigaDato('nome', fields.name) +
    rigaDato('email', fields.email) +
    rigaDato('telefono', fields.phone || '—') +
    rigaDato('adulti', fields.adulti) +
    rigaDato('bambini', fields.bambini) +
    rigaDato('newsletter', fields.newsletter)
  await sendEmail({
    from,
    to,
    reply_to: fields.email,
    subject: `Nuova prenotazione — ${fields.name}`,
    html: emailShell(`
      <h1 style="margin:0 0 6px;font-size:22px;font-weight:600;letter-spacing:-0.01em;">Nuova richiesta di prenotazione</h1>
      <p style="margin:0 0 22px;">È arrivata dal sito una richiesta per la visita guidata. Rispondendo a questa mail si scrive direttamente a ${fields.name}.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">${righe}</table>
    `),
  })
}

/* la ricevuta per chi ha prenotato: stessa veste, tono del sito */
async function receiptBooking(fields: Record<string, string>) {
  const from = process.env.BOOKING_EMAIL_FROM
  if (!from || !fields.email) return
  const righe =
    rigaDato('adulti', fields.adulti) +
    rigaDato('bambini', fields.bambini) +
    (fields.phone ? rigaDato('telefono', fields.phone) : '')
  await sendEmail({
    from,
    to: fields.email,
    reply_to: process.env.BOOKING_EMAIL_TO,
    subject: 'La tua richiesta di prenotazione — Tenuta Lamercurina',
    html: emailShell(`
      <h1 style="margin:0 0 6px;font-size:22px;font-weight:600;letter-spacing:-0.01em;">Ti aspettiamo in tenuta</h1>
      <p style="margin:0 0 22px;">Ciao ${fields.name}, abbiamo ricevuto la tua richiesta di prenotazione per la visita guidata. Ti ricontatteremo a breve per confermare data e dettagli.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">${righe}</table>
      <p style="margin:22px 0 0;">Per qualsiasi cosa puoi rispondere direttamente a questa mail.</p>
    `),
  })
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
    const fields = {
      name,
      email,
      phone,
      adulti: String(adults),
      bambini: String(children),
      newsletter: newsletter ? 'sì' : 'no',
    }
    await Promise.all([notifyBooking(fields), receiptBooking(fields)])
    return { status: 'ok' }
  } catch {
    return { status: 'error' }
  }
}

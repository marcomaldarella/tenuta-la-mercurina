import type { Metadata } from 'next'
import Link from 'next/link'
import ContactIcon from '../../../../components/ContactIcon'
import FixedPage from '../../../../components/FixedPage'
import Logo from '../../../../components/Logo'
import LogoWidthMatch from '../../../../components/LogoWidthMatch'
import type { Locale } from '../../../../lib/i18n'
import { pick } from '../../../../lib/l10n'
import { getPage, getSiteSettings } from '../../../../lib/queries'
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
  const [settings, page] = await Promise.all([getSiteSettings(), getPage('contatti')])

  const heading =
    pick(page?.hero?.heading, locale) ??
    (locale === 'en' ? 'we look forward to welcoming you' : 'ti aspettiamo in tenuta')
  const sub =
    pick(page?.hero?.subheading, locale) ??
    (locale === 'en'
      ? 'Contact us to organise a stay, a visit or your next event.'
      : 'Contattaci per organizzare un soggiorno, una visita o il tuo prossimo evento.')
  const address =
    pick(settings?.address, locale) ??
    'Tenuta Lamercurina\nVia Cascina San Marzano, 5\nPieve del Cairo, Pavia'

  const emailLink = settings?.email ? `mailto:${settings.email}` : '#'
  /* col link WhatsApp il numero apre la chat; senza, resta la chiamata */
  const phoneLink = settings?.whatsapp
    ? settings.whatsapp
    : settings?.phone
      ? `tel:${settings.phone.replace(/\s/g, '')}`
      : null
  const phoneBlank = settings?.whatsapp ? { target: '_blank', rel: 'noreferrer' } : {}
  const instagramLink = settings?.instagram ?? '#'
  /* account completo con la chiocciola (mail CORREZIONI SITO 23/11) */
  const instagramHandle = settings?.instagram
    ?.replace(/\/+$/, '')
    .split('/')
    .pop()

  /* mail CORREZIONI SITO 23/11 + revisione Marco: le voci di contatto
     stanno SOTTO il titolo, nel suo blocco; in fondo restano logo e
     indirizzo. Niente facebook */
  return (
    <main className={styles.main}>
      <FixedPage />
      <div className={styles.head}>
        <h1 className={styles.block}>{heading}</h1>
        <p className={styles.sub}>{sub}</p>
        <p className={`${styles.block} ${styles.body} ${styles.contact}`}>
          {settings?.email && (
            <span className={styles.line}>
              <a href={emailLink}>
                <ContactIcon name="email" size="0.8em" />
                {settings.email}
              </a>
            </span>
          )}
          {phoneLink && (
            <span className={styles.line}>
              <a href={phoneLink} {...phoneBlank}>
                <ContactIcon
                  name={settings?.whatsapp ? 'whatsapp' : 'phone'}
                  size="0.8em"
                />
                {settings?.whatsapp
                  ? locale === 'en'
                    ? 'write to us on whatsapp'
                    : 'scrivici su whatsapp'
                  : locale === 'en'
                    ? 'contact us'
                    : 'contattaci'}
              </a>
            </span>
          )}
          {instagramHandle && (
            <span className={styles.line}>
              <a href={instagramLink} target="_blank" rel="noreferrer">
                <ContactIcon name="instagram" size="0.8em" />
                @{instagramHandle}
              </a>
            </span>
          )}
        </p>
      </div>
      <div className={styles.identity}>
      <LogoWidthMatch>
      {/* il nome lo dice il logo: dall'indirizzo cade l'eventuale prima riga.
          Il logo è largo quanto la riga di indirizzo più lunga (misurata via
          LogoWidthMatch), non un clamp indipendente: così flexa sempre alla
          stessa larghezza del testo, in ogni lingua e viewport */}
      <Link
        href={`/${locale}`}
        className={styles.logoLink}
        aria-label="Home"
        data-match-target
      >
        <Logo className={styles.logo} />
      </Link>
      <p
        className={`${styles.block} ${styles.body} ${styles.address}`}
        data-match-source
      >
        {address
          .split('\n')
          .filter((line) => !/tenuta\s*lamercurina/i.test(line))
          .map((line) => (
            <span key={line} className={styles.line}>
              {line}
            </span>
          ))}
      </p>
      </LogoWidthMatch>
      </div>
    </main>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { Locale } from '../lib/i18n'
import { locales } from '../lib/i18n'
import { t } from '../lib/l10n'
import { navEntries } from '../lib/nav'
import styles from './Header.module.css'

const DARK_PAGES = ['contatti', 'prenota']
const THEME_CREAM = '#faf1e6'
const THEME_BROWN = '#4b3a2f'

export default function Header({
  locale,
  phone,
  email,
  instagram,
}: {
  locale: Locale
  phone?: string
  email?: string
  instagram?: string
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false) // overlay nel DOM
  const [shown, setShown] = useState(false) // overlay animato in posizione
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // apertura/chiusura animata: display none quando inattivo (regola iOS),
  // transizione via classe .shown applicata al frame successivo
  useEffect(() => {
    if (open) {
      setVisible(true)
      const raf = requestAnimationFrame(() =>
        requestAnimationFrame(() => setShown(true))
      )
      return () => cancelAnimationFrame(raf)
    }
    setShown(false)
    const timer = setTimeout(() => setVisible(false), 800)
    return () => clearTimeout(timer)
  }, [open])

  // scroll lock + theme-color Safari (barra e area sotto la url bar marroni a menu aperto)
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    document.documentElement.classList.toggle('menu-open', open)
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', open ? THEME_BROWN : THEME_CREAM)
    return () => {
      document.documentElement.style.overflow = ''
      document.documentElement.classList.remove('menu-open')
    }
  }, [open])

  const segment = pathname.split('/')[2] ?? ''
  const onDark = !DARK_PAGES.includes(segment)

  const switchLocale = (target: Locale) =>
    `/${target}${pathname.replace(/^\/(it|en)/, '') || ''}`

  return (
    <>
      <header
        className={`${styles.header} ${onDark && !scrolled ? styles.onImage : ''} ${
          scrolled ? styles.scrolled : ''
        }`}
      >
        <Link href={`/${locale}`} className={styles.logo} aria-label="Tenuta Lamercurina">
          tenuta
          <br />
          lamercurına
        </Link>

        <nav className={styles.nav}>
          {navEntries.map((entry) =>
            entry.items ? (
              <div key={entry.label.it} className={styles.group}>
                <span className={styles.groupLabel}>{entry.label[locale]}</span>
                <div className={styles.subList}>
                  <div className={styles.subListInner}>
                    {entry.items.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/${locale}/${item.slug}`}
                        className={styles.subItem}
                      >
                        {item.label[locale]}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={entry.slug}
                href={`/${locale}/${entry.slug}`}
                className={styles.groupLabel}
              >
                {entry.label[locale]}
              </Link>
            )
          )}
        </nav>

        <div className={styles.lang}>
          {locales.map((l, i) => (
            <span key={l}>
              {i > 0 && <span className={styles.langSep}>|</span>}
              <Link
                href={switchLocale(l)}
                className={l === locale ? styles.langActive : styles.langLink}
              >
                {l.toUpperCase()}
              </Link>
            </span>
          ))}
        </div>

        <button className={styles.menuButton} onClick={() => setOpen(true)}>
          {t('menu', locale)}
        </button>
      </header>

      {visible && (
        <div className={`${styles.overlay} ${shown ? styles.overlayShown : ''}`}>
          <div className={styles.overlayTop}>
            <span className={styles.overlayLogo}>
              tenuta
              <br />
              lamercurına
            </span>
            <button className={styles.closeButton} onClick={() => setOpen(false)}>
              {t('close', locale)}
            </button>
          </div>

          <nav className={styles.overlayNav}>
            {navEntries
              .flatMap((entry) =>
                entry.items ? entry.items : [{ slug: entry.slug!, label: entry.label }]
              )
              .map((item, i) => (
                <Link
                  key={item.slug}
                  href={`/${locale}/${item.slug}`}
                  className={styles.overlayItem}
                  style={{ '--i': i } as React.CSSProperties}
                  onClick={() => setOpen(false)}
                >
                  {item.label[locale]}
                </Link>
              ))}
            <div
              className={`${styles.overlayLang} ${styles.overlayItemAnim}`}
              style={{ '--i': 13 } as React.CSSProperties}
            >
              {locales.map((l) => (
                <Link
                  key={l}
                  href={switchLocale(l)}
                  className={l === locale ? styles.langActive : styles.langLink}
                  onClick={() => setOpen(false)}
                >
                  {l.toUpperCase()}
                </Link>
              ))}
            </div>
          </nav>

          <div
            className={`${styles.overlayFooter} ${styles.overlayItemAnim}`}
            style={{ '--i': 14 } as React.CSSProperties}
          >
            <div>
              {instagram && (
                <a href={instagram} target="_blank" rel="noreferrer">
                  {t('instagram', locale)}
                </a>
              )}
              {phone && <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>}
            </div>
            <div className={styles.overlayFooterRight}>
              <span>{t('privacy', locale)}</span>
              {email && <a href={`mailto:${email}`}>{email}</a>}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

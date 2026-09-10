'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import type { Locale } from '../lib/i18n'
import { locales } from '../lib/i18n'
import { t } from '../lib/l10n'
import { flatNavItems, navEntries } from '../lib/nav'
import Logo from './Logo'
import styles from './Header.module.css'

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
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // dinamico PER VOCE: ogni elemento del menu diventa crema se il suo punto
  // centrale sta sopra un blocco foto ([data-header-dark]), marrone altrove
  useEffect(() => {
    let raf = 0
    const check = () => {
      setScrolled(window.scrollY > 80)
      const zones = Array.from(document.querySelectorAll('[data-header-dark]'))
        .map((zone) => zone.getBoundingClientRect())
        .filter((rect) => rect.width > 0 && rect.bottom > 0 && rect.top < 200)
      const items =
        headerRef.current?.querySelectorAll<HTMLElement>('[data-nav-item]') ?? []
      for (const item of items) {
        const rect = item.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const over = zones.some(
          (z) => cx >= z.left && cx <= z.right && cy >= z.top && cy <= z.bottom
        )
        item.style.color = over ? 'var(--cream)' : ''
      }
    }
    const schedule = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(check)
    }
    check()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const observer = new MutationObserver(schedule)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      observer.disconnect()
    }
  }, [pathname])

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
    const timer = setTimeout(() => setVisible(false), 900)
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

  const switchLocale = (target: Locale) =>
    `/${target}${pathname.replace(/^\/(it|en)/, '') || ''}`

  return (
    <>
      <header
        ref={headerRef}
        className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
      >
        <Link
          href={`/${locale}`}
          className={styles.logo}
          aria-label="Tenuta Lamercurina"
          data-nav-item
        >
          <Logo className={styles.logoMark} />
        </Link>

        <nav className={styles.nav}>
          {navEntries.map((entry) =>
            entry.items ? (
              <div key={entry.label.it} className={styles.group}>
                {entry.anchors ? (
                  <Link
                    href={`/${locale}/${entry.slug}`}
                    className={styles.groupLabel}
                    data-nav-item
                  >
                    {entry.label[locale]}
                  </Link>
                ) : (
                  <span className={styles.groupLabel} data-nav-item>
                    {entry.label[locale]}
                  </span>
                )}
                <div className={styles.subList}>
                  <div className={styles.subListInner}>
                    {entry.items.map((item, i) => (
                      <Link
                        key={item.slug}
                        href={`/${locale}/${
                          entry.anchors ? `${entry.slug}#${item.slug}` : item.slug
                        }`}
                        className={styles.subItem}
                        style={{ '--i': i } as React.CSSProperties}
                        data-nav-item
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
                data-nav-item
              >
                {entry.label[locale]}
              </Link>
            )
          )}
        </nav>

        <div className={styles.lang} data-nav-item>
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

        <button
          className={styles.menuButton}
          onClick={() => setOpen(true)}
          data-nav-item
        >
          {t('menu', locale)}
        </button>
      </header>

      {visible && (
        <div
          className={`${styles.overlay} ${shown ? styles.overlayShown : ''}`}
          style={{ '--n': flatNavItems.length + 1 } as React.CSSProperties}
          data-lenis-prevent
        >
          <div className={styles.overlayTop}>
            <span className={styles.overlayLogo}>
              <Logo className={styles.logoMark} />
            </span>
            <button className={styles.closeButton} onClick={() => setOpen(false)}>
              {t('close', locale)}
            </button>
          </div>

          <nav className={styles.overlayNav}>
            {flatNavItems.map((item, i) => (
              <Link
                key={item.path}
                href={`/${locale}/${item.path}`}
                className={styles.overlayItem}
                style={{ '--i': i } as React.CSSProperties}
                onClick={() => setOpen(false)}
              >
                {item.label[locale]}
              </Link>
            ))}
            <div
              className={`${styles.overlayLang} ${styles.overlayItemAnim}`}
              style={{ '--i': flatNavItems.length } as React.CSSProperties}
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
            style={{ '--i': flatNavItems.length + 1 } as React.CSSProperties}
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

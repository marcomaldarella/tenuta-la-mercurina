'use client'

import Lenis from 'lenis'
import { usePathname } from 'next/navigation'
import { useEffect, useLayoutEffect, useRef } from 'react'

export default function SmoothScroll() {
  const pathname = usePathname()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // anchors: i link #ancora (sottovoci tenuta/foresteria) scrollano smooth
    const lenis = new Lenis({ lerp: 0.12, anchors: true })
    lenisRef.current = lenis
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    // a menu aperto lo scroll è bloccato (html overflow hidden): fermiamo
    // anche lenis, così non trattiene la rotella dentro l'overlay
    const observer = new MutationObserver(() => {
      document.documentElement.classList.contains('menu-open')
        ? lenis.stop()
        : lenis.start()
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // cambio pagina: Lenis non resetta da solo lo scroll (SPA), quindi la
  // hero della pagina nuova poteva restare a metà scroll della vecchia e
  // finire a filo sotto l'header fisso invece che partire dall'alto.
  // useLayoutEffect (non useEffect): il reset deve succedere PRIMA del
  // paint, altrimenti si vede un salto/flash di contenuto che scatta in
  // cima un frame dopo la transizione invece di essere già lì
  useLayoutEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

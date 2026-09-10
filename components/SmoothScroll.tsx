'use client'

import Lenis from 'lenis'
import { useEffect } from 'react'

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // anchors: i link #ancora (sottovoci tenuta/foresteria) scrollano smooth
    const lenis = new Lenis({ lerp: 0.12, anchors: true })
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
    }
  }, [])

  return null
}

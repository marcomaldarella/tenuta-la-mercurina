'use client'

import { createElement, useLayoutEffect, useRef } from 'react'

/* la frase dell'hero non deve mai andare a capo da web (Marco, 30 set):
   il CSS mette nowrap, qui si riduce il font quel tanto che basta a far
   stare la riga tra i gutter. Sotto i 701px (breakpoint mobile dell'hero)
   non si tocca niente e il testo torna a scorrere normale */
export default function FitLine({
  as = 'p',
  className,
  children,
}: {
  as?: 'h1' | 'h2' | 'p'
  className?: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const update = () => {
      /* si riparte sempre dalla misura del CSS: al resize il font può
         anche risalire, non solo scendere */
      el.style.fontSize = ''
      if (!window.matchMedia('(min-width: 701px)').matches) return
      const available = el.clientWidth
      const needed = el.scrollWidth
      if (needed > available && available > 0) {
        const base = parseFloat(getComputedStyle(el).fontSize)
        el.style.fontSize = `${Math.floor(base * (available / needed) * 100) / 100}px`
      }
    }
    update()

    /* il font custom può arrivare dopo il primo paint: rimisura */
    document.fonts?.ready.then(update)
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [children])

  return createElement(as, { ref, className }, children)
}

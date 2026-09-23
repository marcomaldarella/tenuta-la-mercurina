'use client'

import { useEffect, useRef } from 'react'

/* il logo deve essere sempre largo esattamente quanto la riga di
   indirizzo più lunga. La larghezza si misura sul TESTO delle singole
   righe (Range.getBoundingClientRect), non sul paragrafo: il blocco si
   allarga quanto il contenitore e il contenitore quanto il logo — la
   misura del testo è l'unica indipendente dal layout */
export default function LogoWidthMatch({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const source = wrap?.querySelector<HTMLElement>('[data-match-source]')
    const target = wrap?.querySelector<HTMLElement>('[data-match-target]')
    if (!source || !target) return

    const update = () => {
      let max = 0
      for (const line of source.children) {
        const range = document.createRange()
        range.selectNodeContents(line)
        max = Math.max(max, range.getBoundingClientRect().width)
      }
      if (max > 0) target.style.width = `${Math.round(max)}px`
    }
    update()

    /* il font custom può arrivare dopo il primo paint: rimisura */
    document.fonts?.ready.then(update)
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return <div ref={wrapRef}>{children}</div>
}

'use client'

import { useEffect } from 'react'

/* pagina a schermo pieno senza scroll: main + footer stanno dentro il viewport */
export default function FixedPage() {
  useEffect(() => {
    document.body.classList.add('fixedPage')
    return () => document.body.classList.remove('fixedPage')
  }, [])

  return null
}

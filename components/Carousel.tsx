'use client'

import { useState } from 'react'
import styles from './Carousel.module.css'

/* stessa freccia dei tasti (glifo ↘ di DM Sans, vedi Arrow.tsx), ruotata
   via CSS in → e ← — mai forme angolari diverse dal resto del sito */
function SliderArrow({ left = false }: { left?: boolean }) {
  return (
    <svg
      viewBox="40 66 549 550"
      width="22"
      height="22"
      aria-hidden="true"
      style={{ transform: left ? 'rotate(135deg)' : 'rotate(-45deg)' }}
    >
      <path
        d="M103 611 514 200V616H589V97L557 66H40V141H462L47 555Z"
        transform="matrix(1 0 0 -1 0 682)"
        fill="currentColor"
      />
    </svg>
  )
}

export default function Carousel({
  urls,
  alt = '',
  className = '',
  light = false,
  shaded = false,
}: {
  urls: string[]
  alt?: string
  className?: string
  light?: boolean
  shaded?: boolean
}) {
  const [index, setIndex] = useState(0)

  if (urls.length === 0) {
    return <div className={`${styles.frame} ${styles.empty} ${className}`} data-header-dark />
  }

  const step = (delta: number) =>
    setIndex((current) => (current + delta + urls.length) % urls.length)

  return (
    <div
      className={`${styles.frame} ${shaded ? styles.shaded : ''} ${className}`}
      data-header-dark
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={urls[index]} alt={alt} className={styles.image} />
      {urls.length > 1 && (
        <>
          <button
            className={`${styles.arrow} ${styles.prev} ${light ? styles.light : ''}`}
            onClick={() => step(-1)}
            aria-label="previous"
          >
            <SliderArrow left />
          </button>
          <button
            className={`${styles.arrow} ${styles.next} ${light ? styles.light : ''}`}
            onClick={() => step(1)}
            aria-label="next"
          >
            <SliderArrow />
          </button>
        </>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import styles from './Carousel.module.css'

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
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none">
              <path d="M15 4 7 12l8 8" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
          <button
            className={`${styles.arrow} ${styles.next} ${light ? styles.light : ''}`}
            onClick={() => step(1)}
            aria-label="next"
          >
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none">
              <path d="m9 4 8 8-8 8" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
        </>
      )}
    </div>
  )
}

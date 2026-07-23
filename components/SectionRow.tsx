import Link from 'next/link'
import Arrow from './Arrow'
import Carousel from './Carousel'
import styles from './SectionRow.module.css'

export default function SectionRow({
  title,
  text,
  urls,
  reverse = false,
  href,
  cta,
}: {
  title?: string
  text?: string
  urls: string[]
  reverse?: boolean
  href?: string
  cta?: { label: string; href: string }
}) {
  const heading = href ? (
    <Link href={href} className={styles.titleLink}>
      <h2 className={styles.title}>
        {title} <Arrow />
      </h2>
    </Link>
  ) : (
    <h2 className={styles.title}>{title}</h2>
  )

  return (
    <section className={`${styles.row} ${reverse ? styles.reverse : ''}`}>
      <div className={styles.copy}>
        {heading}
        <div className={styles.bottom}>
          {text && <p className={styles.text}>{text}</p>}
          {cta && (
            <Link href={cta.href} className={styles.cta}>
              {cta.label} <Arrow size="0.78em" />
            </Link>
          )}
        </div>
      </div>
      <Carousel urls={urls} className={styles.media} />
    </section>
  )
}

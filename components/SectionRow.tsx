import Link from 'next/link'
import Arrow from './Arrow'
import BodyText from './BodyText'
import Carousel from './Carousel'
import { noOrphans } from '../lib/typo'
import styles from './SectionRow.module.css'

export default function SectionRow({
  title,
  subtitle,
  text,
  urls,
  reverse = false,
  href,
  cta,
}: {
  title?: string
  subtitle?: string
  text?: string
  urls: string[]
  reverse?: boolean
  href?: string
  cta?: { label: string; href: string }
}) {
  const heading = href ? (
    <Link href={href} className={styles.titleLink}>
      <h2 className={styles.title}>{noOrphans(title)}</h2>
    </Link>
  ) : (
    <h2 className={styles.title}>{noOrphans(title)}</h2>
  )

  /* mail CORREZIONI SITO 23/11: la cta scorre a fine testo (mai una riga
     sua: il testo resta allineato alla foto), piccola e maiuscola */
  const ctaLink = cta && (
    <Link href={cta.href} className={styles.cta}>
      {cta.label}
      <Arrow size="0.58em" />
    </Link>
  )

  return (
    <section className={`${styles.row} ${reverse ? styles.reverse : ''}`}>
      <div className={styles.copy}>
        {heading}
        <div className={styles.bottom}>
          {/* il sottotitolo è il titoletto in grassetto del foglio: sta
              attaccato al suo paragrafo, non sotto il titolo grande */}
          {subtitle && <p className={styles.subtitle}>{noOrphans(subtitle)}</p>}
          {text && (
            <BodyText
              text={text}
              textClass={styles.text}
              titleClass={styles.innerTitle}
              className={styles.body}
              tail={ctaLink}
            />
          )}
          {!text && ctaLink}
        </div>
      </div>
      {/* frecce crema come nel figma: stanno sopra la foto, non sul crema */}
      <Carousel urls={urls} className={styles.media} light />
    </section>
  )
}

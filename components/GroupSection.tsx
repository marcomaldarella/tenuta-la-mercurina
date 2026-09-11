import Link from 'next/link'
import Arrow from './Arrow'
import Carousel from './Carousel'
import styles from './GroupSection.module.css'

/* blocco editoriale delle pagine unite (tenuta/foresteria): titolo grande,
   testi in colonna, gallery unica con frecce; l'id è l'ancora
   raggiunta dalle sottovoci di menu */
export default function GroupSection({
  id,
  title,
  parts,
  urls,
  reverse = false,
  cta,
}: {
  id: string
  title: string
  parts: { key: string; title?: string; text?: string }[]
  urls: string[]
  reverse?: boolean
  cta?: { label: string; href: string }
}) {
  return (
    <section id={id} className={`${styles.row} ${reverse ? styles.reverse : ''}`}>
      <div className={styles.copy}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.bottom}>
          {parts.map(
            (part) =>
              part.text && (
                <div key={part.key}>
                  {part.title && <h3 className={styles.partTitle}>{part.title}</h3>}
                  <p className={styles.text}>{part.text}</p>
                </div>
              )
          )}
          {cta && (
            <Link href={cta.href} className={styles.cta}>
              {cta.label}
              <Arrow size="0.78em" />
            </Link>
          )}
        </div>
      </div>
      <Carousel urls={urls} className={styles.media} light />
    </section>
  )
}

import Link from 'next/link'
import Arrow from './Arrow'
import BodyText from './BodyText'
import Carousel from './Carousel'
import { noOrphans } from '../lib/typo'
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
  parts: { key: string; title?: string; subtitle?: string; text?: string; href?: string }[]
  urls: string[]
  reverse?: boolean
  cta?: { label: string; href: string }
}) {
  return (
    <section id={id} className={`${styles.row} ${reverse ? styles.reverse : ''}`}>
      <div className={styles.copy}>
        <h2 className={styles.title}>{noOrphans(title)}</h2>
        <div className={styles.bottom}>
          {parts.map(
            (part) =>
              (part.title || part.subtitle || part.text) && (
                <div key={part.key}>
                  {part.title &&
                    (part.href ? (
                      /* titolo-link (es. data del mercato → gallery dell'edizione) */
                      <h3 className={styles.partTitle}>
                        {part.href.startsWith('/') ? (
                          <Link href={part.href} className={styles.partLink}>
                            {noOrphans(part.title)}
                            <Arrow size="0.58em" />
                          </Link>
                        ) : (
                          <a
                            href={part.href}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.partLink}
                          >
                            {noOrphans(part.title)}
                            <Arrow size="0.58em" />
                          </a>
                        )}
                      </h3>
                    ) : (
                      <h3 className={styles.partTitle}>{noOrphans(part.title)}</h3>
                    ))}
                  {/* in Studio capita che titolo e sottotitolo vengano
                      compilati con la stessa frase: il doppione non si rende */}
                  {part.subtitle && part.subtitle.trim() !== part.title?.trim() && (
                    <h3 className={styles.partTitle}>{noOrphans(part.subtitle)}</h3>
                  )}
                  {part.text && (
                    <BodyText
                      text={part.text}
                      textClass={styles.text}
                      titleClass={styles.innerTitle}
                    />
                  )}
                </div>
              )
          )}
          {cta && (
            <Link href={cta.href} className={styles.cta}>
              {cta.label}
              <Arrow size="0.58em" />
            </Link>
          )}
        </div>
      </div>
      <Carousel urls={urls} className={styles.media} light />
    </section>
  )
}

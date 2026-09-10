import Carousel from './Carousel'
import styles from './Hero.module.css'

export default function Hero({
  urls,
  heading,
  subheading,
  text,
  headingTag: Tag = 'h1',
}: {
  urls: string[]
  heading?: string
  subheading?: string
  text?: string
  /* h2 per i blocchi successivi delle pagine unite (un solo h1 a pagina) */
  headingTag?: 'h1' | 'h2'
}) {
  return (
    <section className={styles.hero}>
      <Carousel urls={urls} className={styles.carousel} light shaded />
      {heading ? (
        <div className={styles.block}>
          <Tag
            className={
              heading.includes('\n')
                ? `${styles.heading} ${styles.headingManual}`
                : styles.heading
            }
          >
            {heading}
          </Tag>
          {subheading && <p className={styles.subheading}>{subheading}</p>}
        </div>
      ) : (
        text && <Tag className={styles.text}>{text}</Tag>
      )}
    </section>
  )
}

import Carousel from './Carousel'
import styles from './Hero.module.css'

export default function Hero({
  urls,
  heading,
  subheading,
  text,
}: {
  urls: string[]
  heading?: string
  subheading?: string
  text?: string
}) {
  return (
    <section className={styles.hero}>
      <Carousel urls={urls} className={styles.carousel} light shaded />
      {heading ? (
        <div className={styles.block}>
          <h1
            className={
              heading.includes('\n')
                ? `${styles.heading} ${styles.headingManual}`
                : styles.heading
            }
          >
            {heading}
          </h1>
          {subheading && <p className={styles.subheading}>{subheading}</p>}
        </div>
      ) : (
        text && <h1 className={styles.text}>{text}</h1>
      )}
    </section>
  )
}

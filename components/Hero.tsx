import Carousel from './Carousel'
import styles from './Hero.module.css'

export default function Hero({ urls, text }: { urls: string[]; text?: string }) {
  return (
    <section className={styles.hero}>
      <Carousel urls={urls} className={styles.carousel} light />
      {text && <h1 className={styles.text}>{text}</h1>}
    </section>
  )
}

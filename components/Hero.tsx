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
  /* dal figma l'hero porta un solo testo: il pre-header, piccolo e largo in
     basso a sinistra. Niente display grande sopra la foto */
  const lead = subheading ?? text ?? heading

  return (
    <section className={styles.hero}>
      <Carousel urls={urls} className={styles.carousel} light shaded />
      {lead && <Tag className={styles.text}>{lead}</Tag>}
    </section>
  )
}

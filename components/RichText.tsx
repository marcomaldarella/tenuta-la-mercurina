import { PortableText, type PortableTextBlock } from 'next-sanity'
import styles from './RichText.module.css'

export default function RichText({ value }: { value: PortableTextBlock[] }) {
  return (
    <div className={styles.rich}>
      <PortableText
        value={value}
        components={{
          block: {
            h2: ({ children }) => <h2 className={styles.h2}>{children}</h2>,
            h3: ({ children }) => <h3 className={styles.h3}>{children}</h3>,
            normal: ({ children }) => <p className={styles.p}>{children}</p>,
          },
          list: {
            bullet: ({ children }) => <ul className={styles.ul}>{children}</ul>,
          },
        }}
      />
    </div>
  )
}

import styles from './Testimonials.module.css'
import { TESTIMONIALS } from '../data/content'

function Stars({ count }) {
  return (
    <div className={styles.stars} aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className={styles.star}>★</span>
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section id="testimonials" className={styles.testimonials}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className="section-label">{TESTIMONIALS.sectionLabel}</p>
          <h2 className="section-title">{TESTIMONIALS.heading}</h2>
          <p className={styles.subtitle}>{TESTIMONIALS.subtitle}</p>
        </div>
        <div className={styles.grid}>
          {TESTIMONIALS.items.map((t) => (
            <div key={t.handle} className={styles.card}>
              <Stars count={t.rating} />
              <blockquote className={styles.quote}>"{t.quote}"</blockquote>
              <div className={styles.attribution}>
                <span className={styles.name}>{t.name}</span>
                <span className={styles.handle}>{t.handle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import styles from './About.module.css'
import { ABOUT } from '../data/content'

const hero1 = '/photos/barton-springs/hero-1.webp'
const hero2 = '/photos/barton-springs/hero-2.webp'

export default function About({ onOpenPhoto }) {

  return (
    <section id="about" className={styles.about}>
      <div className={styles.inner}>
        <div className={styles.text}>
          <p className="section-label">{ABOUT.sectionLabel}</p>
          <h2 className="section-title">{ABOUT.heading}</h2>
          <p>{ABOUT.paragraph1}</p>
          <p>{ABOUT.paragraph2}</p>
          <div className={styles.stats}>
            {ABOUT.stats.map((s) => (
              <div key={s.label} className={styles.statCard}>
                <div className={styles.statNumber}>{s.number}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
          <a href="#contact" className={styles.bookCta}>Book Wrestle With Jimmy →</a>
        </div>

        <div className={styles.imageStack}>
          <img
            src={hero1}
            alt="Wrestle With Jimmy performing live in Austin, TX"
            width={600}
            height={900}
            loading="lazy"
            onClick={() => onOpenPhoto(hero1)}
          />
          <img
            src={hero2}
            alt="Wrestle With Jimmy on stage at a Weezer tribute show"
            width={1200}
            height={1800}
            loading="lazy"
            onClick={() => onOpenPhoto(hero2)}
          />
        </div>
      </div>
    </section>
  )
}

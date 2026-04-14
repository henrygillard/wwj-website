import styles from './Hero.module.css'
import { recapVideo } from '../data/assets'
import { HERO } from '../data/content'

export default function Hero() {
  return (
    <section className={styles.hero} id="home">
      <video
        className={styles.videoBg}
        src={recapVideo.src}
        poster="/photos/barton-springs/hero-1.jpg"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className={styles.content}>
        <p className={styles.eyebrow}>{HERO.eyebrow}</p>
        <h1 className={styles.title} aria-label={HERO.titleScreenReader}>
          {HERO.title.split('').map((char, i) =>
            i === 1 ? <span key={i} className={styles.accent} aria-hidden="true">{char}</span> : char
          )}
        </h1>
        <p className={styles.subtitle}>
          {HERO.subtitleLine1}
          <br />
          {HERO.subtitleLine2}
        </p>
        <div className={styles.cta}>
          <a href={HERO.cta1Link} className={`${styles.btn} ${styles.btnYellow}`}>
            {HERO.cta1Label}
          </a>
          <a href={HERO.cta2Link} className={`${styles.btn} ${styles.btnOutline}`}>
            {HERO.cta2Label}
          </a>
        </div>
      </div>
      <p className={styles.scrollHint}>{HERO.scrollHint}</p>
    </section>
  )
}

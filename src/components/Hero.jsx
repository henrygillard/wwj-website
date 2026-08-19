import styles from './Hero.module.css'
import { recapVideo } from '../data/assets'
import { HERO } from '../data/content'

// The visible H1 is the "WWJ" logotype, which carries no keywords. Search engines
// read heading text, not aria-label, so the real heading text is rendered in the
// DOM and visually hidden. Falls back to a default until/unless an `h1` column is
// added to the content sheet.
const H1_TEXT = HERO.h1 || "Wrestle With Jimmy — Austin's Weezer Cover Band"

export default function Hero() {
  return (
    <section className={styles.hero} id="home">
      <video
        className={styles.videoBg}
        src={recapVideo.src}
        poster="/photos/barton-springs/hero-1.webp"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      <div className={styles.content}>
        <p className={styles.eyebrow}>{HERO.eyebrow}</p>
        <h1 className={styles.title}>
          <span className={styles.srOnly}>{H1_TEXT}</span>
          <span className={styles.titleMark} aria-hidden="true">
            {HERO.title.split('').map((char, i) =>
              i === 1 ? <span key={i} className={styles.accent}>{char}</span> : char
            )}
          </span>
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

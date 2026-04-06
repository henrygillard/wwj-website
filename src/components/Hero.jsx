import styles from './Hero.module.css'
import { recapVideo } from '../data/assets'

export default function Hero() {
  return (
    <section className={styles.hero} id="home">
      <video
        className={styles.videoBg}
        src={recapVideo.src}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className={styles.content}>
        <p className={styles.eyebrow}>Austin, TX · Weezer Cover Band</p>
        <h1 className={styles.title}>
          W<span className={styles.accent}>W</span>J
        </h1>
        <p className={styles.subtitle}>
          Playing the songs that <strong>defined a generation</strong>
          <br />
          loud, proud, and slightly nerdy
        </p>
        <div className={styles.cta}>
          <a href="#gallery" className={`${styles.btn} ${styles.btnYellow}`}>
            See Photos
          </a>
          <a href="#contact" className={`${styles.btn} ${styles.btnOutline}`}>
            Book Us
          </a>
        </div>
      </div>
      <p className={styles.scrollHint}>scroll ↓</p>
    </section>
  )
}

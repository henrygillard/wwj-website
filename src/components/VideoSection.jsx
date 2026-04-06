import styles from './VideoSection.module.css'
import { recapVideo } from '../data/assets'

export default function VideoSection() {
  return (
    <section id="video" className={styles.section}>
      <div className={styles.inner}>
        <p className="section-label">Watch</p>
        <h2 className="section-title">Watch Us Live</h2>
        <div className={styles.embedWrapper}>
          <video
            src={recapVideo.src}
            poster="/photos/barton-springs/hero-1.jpg"
            title={recapVideo.title}
            controls
            className={styles.embed}
          />
        </div>
      </div>
    </section>
  )
}

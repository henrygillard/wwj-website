import { useState } from 'react'
import styles from './VideoSection.module.css'
import { promoVideo } from '../data/assets'

// Click-to-play facade. A bare YouTube iframe pulls ~1 MB of third-party JS on
// every page load even when nobody presses play; rendering the poster first and
// swapping in the iframe on demand keeps that cost off the critical path.
// SEO is unaffected — Google reads the VideoObject schema, not the iframe.
export default function VideoSection() {
  const [playing, setPlaying] = useState(false)

  return (
    <section id="video" className={styles.section}>
      <div className={styles.inner}>
        <p className="section-label">Watch</p>
        <h2 className="section-title">Watch Us Live</h2>
        <div className={styles.embedWrapper}>
          {playing ? (
            <iframe
              className={styles.embed}
              // Privacy-enhanced host — no cookies dropped until playback starts.
              src={`https://www.youtube-nocookie.com/embed/${promoVideo.id}?autoplay=1&rel=0`}
              title={promoVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              className={styles.facade}
              onClick={() => setPlaying(true)}
              aria-label={`Play video: ${promoVideo.title}`}
            >
              <img
                src={promoVideo.poster}
                alt=""
                width={promoVideo.posterWidth}
                height={promoVideo.posterHeight}
                loading="lazy"
                decoding="async"
                className={styles.poster}
              />
              <span className={styles.playButton} aria-hidden="true">
                <svg viewBox="0 0 68 48" width="68" height="48" focusable="false">
                  <path
                    className={styles.playBg}
                    d="M66.52 7.74a8.57 8.57 0 0 0-6-6C55.2 0 34 0 34 0S12.8 0 7.48 1.74a8.57 8.57 0 0 0-6 6A89.4 89.4 0 0 0 0 24a89.4 89.4 0 0 0 1.48 16.26 8.57 8.57 0 0 0 6 6C12.8 48 34 48 34 48s21.2 0 26.52-1.74a8.57 8.57 0 0 0 6-6A89.4 89.4 0 0 0 68 24a89.4 89.4 0 0 0-1.48-16.26z"
                  />
                  <path d="M45 24 27 14v20z" fill="#fff" />
                </svg>
              </span>
            </button>
          )}
        </div>
        <p className={styles.caption}>
          <a
            href={promoVideo.watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ytLink}
          >
            Watch on YouTube →
          </a>
        </p>
      </div>
    </section>
  )
}

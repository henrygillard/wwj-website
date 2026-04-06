import { useState, useMemo } from 'react'
import styles from './Gallery.module.css'
import { allPhotos } from '../data/photos'

const PAGE_SIZE = 10

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Gallery({ onOpenPhoto }) {
  const photos = useMemo(() => shuffle(allPhotos), [])
  const [visible, setVisible] = useState(PAGE_SIZE)

  return (
    <section id="gallery" className={styles.gallery}>
      <div className={styles.header}>
        <p className="section-label">Photos</p>
        <h2 className="section-title">Live Photos</h2>
      </div>

      <div className={styles.grid}>
        {photos.slice(0, visible).map((photo) => (
          <div
            key={photo.src}
            className={styles.item}
            onClick={() => onOpenPhoto(photo.src)}
          >
            <img src={photo.src} alt={photo.alt} loading="lazy" />
            <div className={styles.overlay} />
          </div>
        ))}
      </div>

      {visible < photos.length && (
        <div className={styles.showMore}>
          <button onClick={() => setVisible((v) => v + PAGE_SIZE)}>
            Show More
          </button>
        </div>
      )}
    </section>
  )
}

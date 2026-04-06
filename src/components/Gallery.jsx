import styles from './Gallery.module.css'
import { allPhotos } from '../data/photos'

export default function Gallery({ onOpenPhoto }) {
  return (
    <section id="gallery" className={styles.gallery}>
      <div className={styles.header}>
        <p className="section-label">Photos</p>
        <h2 className="section-title">The Shots</h2>
      </div>

      <div className={styles.grid}>
        {allPhotos.map((photo) => (
          <div
            key={photo.src}
            className={styles.item}
            onClick={() => onOpenPhoto(photo.src)}
          >
            <img src={photo.src} alt={`WWJ — ${photo.label}`} loading="lazy" />
            <div className={styles.overlay} />
          </div>
        ))}
      </div>
    </section>
  )
}

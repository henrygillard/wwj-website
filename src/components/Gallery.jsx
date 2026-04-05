import { useState } from 'react'
import styles from './Gallery.module.css'
import { allPhotos } from '../data/photos'

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'promo', label: 'Promo' },
  { key: 'live', label: 'Independence Brewing' },
  { key: 'cmw', label: 'Central Machine Works' },
]

export default function Gallery({ onOpenPhoto }) {
  const [activeTab, setActiveTab] = useState('all')

  const visible =
    activeTab === 'all' ? allPhotos : allPhotos.filter((p) => p.group === activeTab)

  return (
    <section id="gallery" className={styles.gallery}>
      <div className={styles.header}>
        <p className="section-label">Photos</p>
        <h2 className="section-title">The Shots</h2>
        <div className={styles.tabs}>
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`${styles.tab} ${activeTab === t.key ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {visible.map((photo) => (
          <div
            key={photo.id}
            className={styles.item}
            onClick={() => onOpenPhoto(photo.fullSrc)}
          >
            <img src={photo.src} alt={`WWJ — ${photo.label}`} loading="lazy" />
            <div className={styles.overlay} />
          </div>
        ))}
      </div>
    </section>
  )
}

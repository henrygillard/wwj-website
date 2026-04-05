import { useEffect } from 'react'
import styles from './Lightbox.module.css'

export default function Lightbox({ src, onClose }) {
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className={styles.lightbox} onClick={onClose}>
      <button className={styles.close} onClick={onClose}>✕</button>
      <img
        src={src}
        alt="Full size photo"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}

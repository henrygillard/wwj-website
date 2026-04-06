import { useState } from 'react'
import styles from './Nav.module.css'
import { logos } from '../data/assets'

export default function Nav() {
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  return (
    <nav className={styles.nav}>
      <a href="#home" className={styles.logo} onClick={close}>
        <img src={logos.whiteTransparent} alt="WWJ" className={styles.logoImg} />
      </a>
      <ul className={`${styles.links} ${open ? styles.linksOpen : ''}`}>
        <li><a href="#about" onClick={close}>About</a></li>
        <li><a href="#gallery" onClick={close}>Gallery</a></li>
        <li><a href="#video" onClick={close}>Videos</a></li>
        <li><a href="#events" onClick={close}>Shows</a></li>
        <li><a href="#testimonials" onClick={close}>Reviews</a></li>
        <li><a href="#contact" onClick={close}>Book Us</a></li>
      </ul>
      <button
        className={styles.hamburger}
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        <span className={`${styles.bar} ${open ? styles.barTop : ''}`} />
        <span className={`${styles.bar} ${open ? styles.barMid : ''}`} />
        <span className={`${styles.bar} ${open ? styles.barBot : ''}`} />
      </button>
    </nav>
  )
}

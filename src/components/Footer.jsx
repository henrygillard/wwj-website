import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>
        W<span>W</span>J
      </div>
      <p className={styles.tagline}>Austin, TX · Weezer Cover Band</p>
      <nav className={styles.links}>
        <a href="#about">About</a>
        <a href="#gallery">Gallery</a>
        <a href="#contact">Book Us</a>
      </nav>
      <p className={styles.copy}>© {new Date().getFullYear()} WWJ. All rights reserved.</p>
    </footer>
  )
}

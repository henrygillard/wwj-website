import styles from './Footer.module.css'
import { FOOTER } from '../data/content'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>
        W<span>W</span>J
      </div>
      <p className={styles.tagline}>{FOOTER.tagline}</p>
      <nav className={styles.links}>
        <a href="#about">About</a>
        <a href="#gallery">Gallery</a>
        <a href="#video">Videos</a>
        <a href="#events">Shows</a>
        <a href="#testimonials">Reviews</a>
        <a href="#contact">Book Us</a>
      </nav>
      <div className={styles.social}>
        <a
          href="https://www.instagram.com/wrestlewithjimmyatx/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Wrestle With Jimmy on Instagram"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
          </svg>
        </a>
      </div>
      <p className={styles.copy}>© {new Date().getFullYear()} WWJ. All rights reserved.</p>
    </footer>
  )
}

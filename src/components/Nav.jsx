import styles from './Nav.module.css'

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <a href="#home" className={styles.logo}>
        W<span>W</span>J
      </a>
      <ul className={styles.links}>
        <li><a href="#about">About</a></li>
        <li><a href="#gallery">Gallery</a></li>
        <li><a href="#contact">Book Us</a></li>
      </ul>
    </nav>
  )
}

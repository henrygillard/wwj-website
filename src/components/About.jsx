import styles from './About.module.css'


const STATS = [
  { number: '4+', label: 'Venues played' },
  { number: 'ATX', label: 'Based in Austin' },
  { number: '∞', label: 'Weezer songs known' },
  { number: '0', label: 'Undone sweaters' },
]

const hero1 = '/photos/barton-springs/hero-1.jpg'
const hero2 = '/photos/barton-springs/hero-2.jpg'

export default function About({ onOpenPhoto }) {

  return (
    <section id="about" className={styles.about}>
      <div className={styles.inner}>
        <div className={styles.text}>
          <p className="section-label">Who we are</p>
          <h2 className="section-title">We are Wrestle With Jimmy.</h2>
          <p>
            Westle With Jimmy is Austin's premier Weezer cover band, bringing the blue album
            energy to venues, festivals, and basements across the city. From
            Buddy Holly to Undone, we play the songs that made a generation of
            kids feel like it was okay to be a little weird.
          </p>
          <p>
            Whether you caught us at Central Machine Works, Brisketfest,
            Independence Brewing, or Radio East — you already know what it's
            about. Big riffs, bigger harmonies, and an unconditional love for
            Weezer.
          </p>
          <div className={styles.stats}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.statCard}>
                <div className={styles.statNumber}>{s.number}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.imageStack}>
          <img
            src={hero1}
            alt="WWJ live"
            loading="lazy"
            onClick={() => onOpenPhoto(hero1)}
          />
          <img
            src={hero2}
            alt="WWJ on stage"
            loading="lazy"
            onClick={() => onOpenPhoto(hero2)}
          />
        </div>
      </div>
    </section>
  )
}

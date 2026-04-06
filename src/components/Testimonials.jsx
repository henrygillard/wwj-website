import styles from './Testimonials.module.css'

const TESTIMONIALS = [
  {
    quote: "I drove 14 hours from Tulsa just to see Wrestle With Jimmy. I told my wife I was at a work conference. She found my WWJ shirt. Worth it.",
    name: "DaveFromTulsa",
    handle: "@weezerfan4life",
    rating: 5,
  },
  {
    quote: "They played Hash Pipe and I cried for 40 minutes. This was the best day of my life including my wedding.",
    name: "Carolyn M.",
    handle: "@sweaterweather96",
    rating: 5,
  },
  {
    quote: "I've seen Weezer 23 times. I've now seen Wrestle With Jimmy 24 times. Rivers Cuomo has not returned my calls.",
    name: "PinkertonPatrick",
    handle: "@onlybluealbum",
    rating: 5,
  },
  {
    quote: "Not to be dramatic but this cover band healed my inner child, fixed my posture, and got me a promotion at work.",
    name: "Angela T.",
    handle: "@undone_sweater",
    rating: 5,
  },
  {
    quote: "I made a sign that said 'WRESTLE WITH MY HEART' and they saw it. The guitarist pointed at me. I haven't washed that shirt.",
    name: "GregFromAustin",
    handle: "@hashpipe_greg",
    rating: 5,
  },
  {
    quote: "My therapist says I'm 'overly attached to a cover band.' She clearly hasn't heard them play In the Garage.",
    name: "Becca W.",
    handle: "@feelingsareweird",
    rating: 5,
  },
]

function Stars({ count }) {
  return (
    <div className={styles.stars} aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className={styles.star}>★</span>
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section id="testimonials" className={styles.testimonials}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className="section-label">Fan Reviews</p>
          <h2 className="section-title">What the Stans Are Saying</h2>
          <p className={styles.subtitle}>
            Totally real, completely unsponsored testimonials from actual Weezer fans.
          </p>
        </div>
        <div className={styles.grid}>
          {TESTIMONIALS.map((t) => (
            <div key={t.handle} className={styles.card}>
              <Stars count={t.rating} />
              <blockquote className={styles.quote}>"{t.quote}"</blockquote>
              <div className={styles.attribution}>
                <span className={styles.name}>{t.name}</span>
                <span className={styles.handle}>{t.handle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

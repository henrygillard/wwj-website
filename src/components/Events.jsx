import styles from './Events.module.css'
import { EVENTS } from '../data/events'

const FORMAT = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

function formatDate(dateStr) {
  return FORMAT.format(new Date(dateStr))
}

export default function Events() {
  const upcoming = EVENTS.filter((e) => e.upcoming).sort((a, b) => a.date.localeCompare(b.date))
  const past = EVENTS.filter((e) => !e.upcoming).sort((a, b) => b.date.localeCompare(a.date))

  return (
    <section id="events" className={styles.events}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className="section-label">Shows</p>
          <h2 className="section-title">Shows</h2>
        </div>

        {upcoming.length > 0 ? (
          <ul className={styles.list}>
            {upcoming.map((e) => (
              <li key={e.date + e.venue} className={`${styles.row} ${styles.upcomingRow}`}>
                <span className={styles.date}>{formatDate(e.date)}</span>
                <span className={styles.venue}>{e.venue}</span>
                <span className={styles.location}>{e.location}</span>
                <a href={e.url} target="_blank" rel="noopener noreferrer" className={styles.ticketLink}>
                  Get Tickets →
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.noShows}>
            <p>No upcoming shows scheduled — check back soon or follow us on social for announcements.</p>
          </div>
        )}

        {past.length > 0 && (
          <>
            <h3 className={styles.pastHeading}>Past Shows</h3>
            <ul className={styles.list}>
              {past.map((e) => (
                <li key={e.date + e.venue} className={`${styles.row} ${styles.pastRow}`}>
                  <span className={styles.date}>{formatDate(e.date)}</span>
                  <span className={styles.venue}>{e.venue}</span>
                  <span className={styles.location}>{e.location}</span>
                  <a href={e.url} target="_blank" rel="noopener noreferrer" className={styles.doLink}>
                    View on Do512 →
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  )
}

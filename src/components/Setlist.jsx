import styles from './Setlist.module.css'
import { SETLIST, SPOTIFY_PLAYLIST_ID } from '../data/setlist'

export default function Setlist() {
  return (
    <section id="setlist" className={styles.setlist}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className="section-label">{SETLIST.sectionLabel}</p>
          <h2 className="section-title">{SETLIST.heading}</h2>
          <p className={styles.subtitle}>{SETLIST.subtitle}</p>
        </div>

        {SPOTIFY_PLAYLIST_ID ? (
          <div className={styles.player}>
            <p className={styles.playerLabel}>{SETLIST.playlistLabel}</p>
            <iframe
              className={styles.playerFrame}
              // theme=0 renders neutral dark grey. Without it Spotify tints the
              // player with a colour extracted from the playlist artwork, which
              // currently comes out dark red against this off-white section.
              src={`https://open.spotify.com/embed/playlist/${SPOTIFY_PLAYLIST_ID}?utm_source=generator&theme=0`}
              title="Wrestle With Jimmy — live setlist playlist on Spotify"
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        ) : null}

        <div className={styles.grid}>
          {SETLIST.albums.map((a) => (
            <div key={a.album} className={styles.album}>
              <div className={styles.albumHead}>
                {a.cover ? (
                  <img
                    className={styles.cover}
                    src={a.cover}
                    alt={`Weezer — ${a.album} album cover`}
                    width={a.coverWidth}
                    height={a.coverHeight}
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
                <div className={styles.albumHeadText}>
                  <h3 className={styles.albumTitle}>{a.album}</h3>
                  <span className={styles.albumMeta}>
                    {a.year}
                    {a.note ? ` · ${a.note}` : ''}
                  </span>
                </div>
              </div>
              <ol className={styles.songs}>
                {a.songs.map((song) => (
                  <li key={song} className={styles.song}>
                    {song}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        <p className={styles.footnote}>{SETLIST.footnote}</p>
        <a href="#contact" className={styles.bookCta}>
          Book Wrestle With Jimmy →
        </a>
      </div>
    </section>
  )
}

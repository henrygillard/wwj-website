import { useState } from 'react'
import styles from './Contact.module.css'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.inner}>
        <p className={`section-label ${styles.label}`}>Get in touch</p>
        <h2 className={`section-title ${styles.title}`}>Book WWJ</h2>
        <p className={styles.subtitle}>
          Want us at your venue, festival, or backyard birthday party? We're in.
          Send us a message.
        </p>

        {submitted ? (
          <div className={styles.success}>
            <p className={styles.successIcon}>🎸</p>
            <p>
              <strong>Message sent!</strong> We'll get back to you soon.
            </p>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <div className={styles.group}>
                <label htmlFor="name">Your name</label>
                <input id="name" type="text" placeholder="Rivers Cuomo" required />
              </div>
              <div className={styles.group}>
                <label htmlFor="email">Email</label>
                <input id="email" type="email" placeholder="you@example.com" required />
              </div>
            </div>
            <div className={styles.group}>
              <label htmlFor="inquiry">Type of inquiry</label>
              <select id="inquiry">
                <option value="">Select one...</option>
                <option value="booking">Booking / Show</option>
                <option value="festival">Festival / Event</option>
                <option value="private">Private Party</option>
                <option value="press">Press / Media</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className={styles.group}>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                placeholder="Tell us about your event, venue, date..."
                required
              />
            </div>
            <button type="submit" className={styles.submit}>
              Send It →
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

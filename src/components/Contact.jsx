import { useState } from 'react'
import styles from './Contact.module.css'

export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')

    const form = e.target
    const body = {
      name: form.name.value,
      email: form.email.value,
      inquiry: form.inquiry.value,
      message: form.message.value,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error('Server error')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.inner}>
        <p className="section-label">Get in touch</p>
        <h2 className="section-title">Book WWJ</h2>
        <p className={styles.subtitle}>
          Want us at your venue, festival, or backyard birthday party? We're in.
          Send us a message.
        </p>

        {status === 'success' ? (
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
                <input id="name" name="name" type="text" placeholder="Rivers Cuomo" required />
              </div>
              <div className={styles.group}>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" placeholder="you@example.com" required />
              </div>
            </div>
            <div className={styles.group}>
              <label htmlFor="inquiry">Type of inquiry</label>
              <select id="inquiry" name="inquiry">
                <option value="">Select one...</option>
                <option value="Booking / Show">Booking / Show</option>
                <option value="Festival / Event">Festival / Event</option>
                <option value="Private Party">Private Party</option>
                <option value="Press / Media">Press / Media</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className={styles.group}>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Tell us about your event, venue, date..."
                required
              />
            </div>
            {status === 'error' && (
              <p className={styles.errorMsg}>
                Something went wrong — please try again or email us directly.
              </p>
            )}
            <button type="submit" className={styles.submit} disabled={status === 'loading'}>
              {status === 'loading' ? 'Sending...' : 'Send It →'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

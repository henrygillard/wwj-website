import { useState } from 'react'
import styles from './Contact.module.css'
import { CONTACT } from '../data/content'

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
        <p className="section-label">{CONTACT.sectionLabel}</p>
        <h2 className="section-title">{CONTACT.heading}</h2>
        <p className={styles.subtitle}>{CONTACT.subtitle}</p>

        {status === 'success' ? (
          <div className={styles.success}>
            <p className={styles.successIcon}>🎸</p>
            <p>{CONTACT.successMessage}</p>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <div className={styles.group}>
                <label htmlFor="name">{CONTACT.nameLabel}</label>
                <input id="name" name="name" type="text" placeholder={CONTACT.namePlaceholder} required />
              </div>
              <div className={styles.group}>
                <label htmlFor="email">{CONTACT.emailLabel}</label>
                <input id="email" name="email" type="email" placeholder={CONTACT.emailPlaceholder} required />
              </div>
            </div>
            <div className={styles.group}>
              <label htmlFor="inquiry">{CONTACT.inquiryLabel}</label>
              <select id="inquiry" name="inquiry">
                <option value="">{CONTACT.inquiryPlaceholder}</option>
                {CONTACT.inquiryOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className={styles.group}>
              <label htmlFor="message">{CONTACT.messageLabel}</label>
              <textarea
                id="message"
                name="message"
                placeholder={CONTACT.messagePlaceholder}
                required
              />
            </div>
            {status === 'error' && (
              <p className={styles.errorMsg}>{CONTACT.errorMessage}</p>
            )}
            <button type="submit" className={styles.submit} disabled={status === 'loading'}>
              {status === 'loading' ? CONTACT.loadingButton : CONTACT.submitButton}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

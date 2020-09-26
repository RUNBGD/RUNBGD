import React, { useState } from 'react'

import addToMailChimp from 'gatsby-plugin-mailchimp'

import { HTMLContent } from '../Content'

import styles from './newsletter-form.module.scss'

const NewsletterForm = ({ dark }) => {
  const [formStatus, setFormStatus] = useState(undefined)
  const [formMessage, setFormMessage] = useState(undefined)

  function submitUserMail(event) {
    event.preventDefault()
    setFormMessage(undefined)
    setFormStatus(undefined)
    let email = event.target.email.value
    addToMailChimp(email)
      .then((data) => {
        setFormStatus(data.result)
        setFormMessage(data.msg)
      })
      .catch((e) =>
        setFormMessage('There was some error subscribing. Try later!')
      )
  }

  return (
    <React.Fragment>
      {formStatus === 'success' ? (
        <p
          className={`${styles.successMessage} ${
            dark && styles.successMessageDark
          }`}
        >
          {formMessage}
        </p>
      ) : (
        <form
          className={`${styles.newsletterForm} ${
            dark && styles.newsletterFormDark
          }`}
          onSubmit={submitUserMail}
        >
          <label className={styles.newsletterText}>
            Sign up for the <span>RUN BGD Newsletter</span> for breaking news,
            events, and unique stories.
          </label>
          <input
            className={styles.newsletterInputEmail}
            type="email"
            name="email"
            placeholder="Email Address"
            required
          />
          <button className={styles.newsletterSubmitButton} type="submit">
            Subscribe
          </button>
          {formStatus === 'error' && (
            <p className={styles.errorMessage}>
              <HTMLContent content={formMessage} />
            </p>
          )}
        </form>
      )}
    </React.Fragment>
  )
}

export default NewsletterForm

import React from 'react'

import styles from './newsletter-form.module.scss'

const NewsletterForm = () => {
  return(
    <form className={styles.newsletterForm}>
      <label className={styles.newsletterText}>Sign up for the <span>RUN BGD Newsletter</span> for breaking news, events, and unique stories.</label>
      <input className={styles.newsletterInputEmail} type='email' placeholder='Email Address'/>
      <button className={styles.newsletterSubmitButton} type='submit'>Subscribe</button>
    </form>
  )
}

export default NewsletterForm
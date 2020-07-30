import React from 'react'

import styles from './newsletter-form.module.scss'

const NewsletterForm = ({dark}) => {
  return(
    <form className={`${styles.newsletterForm} ${dark && styles.newsletterFormDark}`}>
      <label className={styles.newsletterText}>Sign up for the <span>RUN BGD Newsletter</span> for breaking news, events, and unique stories.</label>
      <input className={styles.newsletterInputEmail} type='email' placeholder='Email Address'/>
      <button className={styles.newsletterSubmitButton} type='submit'>Subscribe</button>
    </form>
  )
}

export default NewsletterForm
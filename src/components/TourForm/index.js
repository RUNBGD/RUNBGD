import React, { useState } from 'react'

import styles from './tour-form.module.scss'

const TourForm = ({ packageName }) => {
  const [selectedPackage, setSelectedPackage] = useState(packageName)
  const [firstName, setFirstName] = useState(undefined)
  const [lastName, setLastName] = useState(undefined)
  const [email, setEmail] = useState(undefined)
  const [message, setMessage] = useState(undefined)
  const [errorMessage, setErrorMessage] = useState(undefined)
  const [successMessage, setSuccessMessage] = useState(undefined)
  const [fetching, setFetching] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    if (
      !selectedPackage ||
      !firstName ||
      !(
        email &&
        email.match(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
      )
    ) {
      setErrorMessage('Required fields not filled!')
    } else {
      setErrorMessage(undefined)
      setFetching(true)
      fetch(
        `/.netlify/functions/contactForm?package=${selectedPackage}&selectedPackage=${selectedPackage}&firstName=${firstName}&lastName=${lastName}&email=${email}&message=${message}`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setFetching(false)
          console.log(data)
          if (data.status == 'success') {
            return setSuccessMessage(data.message)
          } else if (data.status == 'error') {
            return setErrorMessage(data.message)
          }
        })
        .catch((error) => {
          console.log(error)
          setFetching(false)
          setErrorMessage(
            'There was some error while trying to send your email. Try later!'
          )
        })
    }
  }

  console.log(successMessage, errorMessage)

  return (
    <form className={styles.packagesContactForm}>
      <h4>Contact Us about {packageName}</h4>
      <div className={styles.fullNameInput}>
        <div onChange={(e) => setFirstName(e.target.value)}>
          <label>First Name*</label>
          <input type="text" name="firstName" />
        </div>
        <div onChange={(e) => setLastName(e.target.value)}>
          <label>Last Name</label>
          <input type="text" name="lastName" />
        </div>
      </div>
      <div
        className={styles.emailInput}
        onChange={(e) => setEmail(e.target.value)}
      >
        <label>Email*</label>
        <input type="email" name="email" />
      </div>
      <div
        className={styles.messageInput}
        onChange={(e) => setMessage(e.target.value)}
      >
        <label>Message</label>
        <textarea name="message"></textarea>
      </div>
      <div className={styles.actionButtonContainer}>
        <button
          className={styles.actionButton}
          onClick={(e) => handleSubmit(e)}
        >
          Send
        </button>
      </div>
      {successMessage && (
        <p className={styles.successMessage}>{successMessage}</p>
      )}
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
      {fetching && (
        <div className={styles.loadingIndicatorContainer}>
          <div className={styles.loadingIndicator}></div>
        </div>
      )}
    </form>
  )
}

export default TourForm

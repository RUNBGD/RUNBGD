import React, { useState, useEffect } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'
import updateSoldProducts from '../../utils/updateSoldProducts'

import styles from './pay-on-arrival-form.module.scss'

const PayOnArrivalForm = ({
  products,
  price,
  totalPrice,
  setTotalPrice,
  setShippingPriceToParent,
  onSuccess,
}) => {
  const data = useStaticQuery(graphql`
    query PayOnArrivalFormQuery {
      logo: markdownRemark(
        frontmatter: { templateKey: { eq: "logos" }, title: { eq: "RUNBGD" } }
      ) {
        frontmatter {
          logoImage {
            childImageSharp {
              fluid(maxWidth: 300, quality: 64) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
      locationsAndPrices: allMarkdownRemark(
        filter: { frontmatter: { templateKey: { eq: "shipping-locations-arrival" } } }
      ) {
        edges {
          node {
            frontmatter {
              location{
                name
                price
              }
            }
          }
        }
      }
    }
    `)
    
    // locationsAndPrices: prismicShippingPrices {
    //   data {
    //     locations_and_prices {
    //       location
    //       price
    //     }
    //   }
    // }
  const [firstName, setFirstName] = useState(undefined)
  const [lastName, setLastName] = useState(undefined)
  const [email, setEmail] = useState(undefined)
  const [address, setAddress] = useState(undefined)
  const [phoneNumber, setPhoneNumber] = useState(undefined)
  const [message, setMessage] = useState(undefined)
  const [country, setCountry] = useState(undefined)
  const [state, setState] = useState(undefined)
  const [city, setCity] = useState(undefined)
  const [zipCode, setZipCode] = useState(undefined)
  const [errorMessage, setErrorMessage] = useState(undefined)
  const [successMessage, setSuccessMessage] = useState(undefined)
  const [fetching, setFetching] = useState(false)
  const [shippingPrice, setShippingPrice] = useState(0)
  const [formOpened, setFormOpened] = useState(false)

  const maxLengthCheck = (event) => {
    if (event.target.value.length > event.target.maxLength) {
      event.target.value = event.target.value.slice(0, event.target.maxLength)
    }
  }

  useEffect(() => {
    setTotalPrice(Number(price) + Number(shippingPrice))
  }, [price, shippingPrice])

  useEffect(() => {
    setShippingPriceToParent(shippingPrice)
  }, [shippingPrice])


  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    if (
      !address ||
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !country ||
      !city ||
      !zipCode ||
      !(
        email &&
        email.match(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
      )
    ) {
      setErrorMessage('Required fields not filled!')
    } else {
      setFetching(true)
      setErrorMessage(undefined)
      fetch(
        `/.netlify/functions/pay-on-arrival-form?firstName=${firstName}&lastName=${lastName}&email=${email}&address=${address}&phoneNumber=${phoneNumber}&country=${country}&state=${state}&city=${city}&zipCode=${zipCode}&message=${message}&price=${totalPrice}&products=${JSON.stringify(
          products.map((product) => {
            return {
              quantity: product.quantity,
              title: product.product.frontmatter.title,
              size: product.size,
              uid: product.id,
            }
          })
        )}`,
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
          if (data.status == 'success') {
            setFetching(false)
            updateSoldProducts(products, onSuccess)
            return setSuccessMessage(data.message)
          } else if (data.status == 'error') {
            setFetching(false)
            return setErrorMessage(data.message)
          }
        })
        .catch((error) => {
          setFetching(false)
          setErrorMessage(
            'There was some error while trying to send your email. Try later!'
          )
        })
    }
  }

  const getAndSetShippingPrice = (optionIndex) => {
    let queryDataIndex = optionIndex - 1
    if (queryDataIndex >= 0) {
      let shippingPrice =
      data.locationsAndPrices.edges[0].node.frontmatter.location[queryDataIndex].price
      setShippingPrice(shippingPrice)
    } else {
      setShippingPrice(0)
    }
  }

  return (
    <form className={styles.contactForm}>
      <button 
        className={styles.primaryButton} 
        onClick={(e) => {e.preventDefault();setFormOpened((prevState) => !prevState)}}
      >
        Pay on arrival
      </button>
      {formOpened &&
        <>
        
          <h4>Pay on arrival</h4>
          <div className={styles.inputsGroup}>
            <h2 className={styles.groupHeading}>Contact Information</h2>
            <input
              type="text"
              name="firstName"
              placeholder="first name"
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              name="lastName"
              placeholder="last name"
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type="email"
              name="email"
              placeholder="your email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="number"
              name="phoneNumber"
              placeholder="phone number"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className={styles.inputsGroup}>
            <h2 className={styles.groupHeading}>Location information</h2>
            <select
              name="country"
              onChange={(e) => {
                setCountry(e.target.value)
                getAndSetShippingPrice(e.target.selectedIndex)
              }}
            >
              <option value="">country</option>
              {data.locationsAndPrices &&
              data.locationsAndPrices.edges.length > 0 &&
              data.locationsAndPrices.edges[0].node.frontmatter.location &&
              data.locationsAndPrices.edges[0].node.frontmatter.location.length > 0 &&
              data.locationsAndPrices.edges[0].node.frontmatter.location.map(
                  (node, index) => {
                    if (node.name && node.price) {
                      return (
                        <option
                          value={node.name}
                          price={node.price}
                          key={index}
                        >
                          {node.name}
                        </option>
                      )
                    }
                  }
                )}
            </select>
            <input
              type="text"
              name="state"
              placeholder="state"
              onChange={(e) => setState(e.target.value)}
            />
            <input
              type="text"
              name="city"
              placeholder="city"
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              type="text"
              name="address"
              placeholder="address"
              onChange={(e) => setAddress(e.target.value)}
            />
            <input
              type="number"
              name="zipCode"
              placeholder="zip code"
              onChange={(e) => setZipCode(e.target.value)}
            />
          </div>
          <div className={styles.inputsGroup}>
            <h2 className={styles.groupHeading}>Other information</h2>
            <textarea
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="message to seller"
            ></textarea>
          </div>
          {successMessage ||
            (errorMessage && (
              <p className={styles.statusText}>{successMessage || errorMessage}</p>
            ))}
          {fetching && (
            <div className={styles.loadingIndicatorContainer}>
              <div className={styles.loadingIndicator}>
                {data.logo &&
                data.logo.frontmatter &&
                data.logo.frontmatter.logoImage &&
                data.logo.frontmatter.logoImage.childImageSharp && 
                data.logo.frontmatter.logoImage.childImageSharp.fluid &&(
                    <Image
                      fluid={
                        data.logo.frontmatter.logoImage.childImageSharp.fluid
                      }
                      alt='loading indicator'
                    />
                  )}
              </div>
            </div>
          )}
          <div onClick={(e) => handleSubmit(e)}>
            <button className={styles.primaryButton}>
              Send
            </button>
          </div>
        </>
      }
    </form>
  )
}

export default PayOnArrivalForm

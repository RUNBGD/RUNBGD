import React, { useState, useEffect } from 'react'
import { useStaticQuery, graphql, navigate } from 'gatsby'
import Image from 'gatsby-image'
import { Helmet } from 'react-helmet'

import Layout from '../../components/Layout'
import styles from './find-places.module.scss'
import { useQueryParam, NumberParam } from 'use-query-params'
import { icon } from 'leaflet'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import FindPlacesMap from '../../components/FindPlacesMap'
import FindPlacesLocations from '../../components/FindPlacesLocations'

import expandButton from '../../img/down-arrow.svg'
import loadingIndicator from '../../img/loading-indicator.svg'
import videoBackground from '../../img/find-places.mp4'
import searchIcon from '../../img/search-icon-white.svg'

function distance(lat1, lon1, lat2, lon2, unit) {
  var radlat1 = (Math.PI * lat1) / 180
  var radlat2 = (Math.PI * lat2) / 180
  var theta = lon1 - lon2
  var radtheta = (Math.PI * theta) / 180
  var dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
  if (dist > 1) {
    dist = 1
  }
  dist = Math.acos(dist)
  dist = (dist * 180) / Math.PI
  dist = dist * 60 * 1.1515
  if (unit == 'K') {
    dist = dist * 1.609344
  }
  if (unit == 'N') {
    dist = dist * 0.8684
  }
  return dist.toFixed(2)
}

const FindPlaces = () => {
  const [xCoord, setXCoord] = useQueryParam('x', NumberParam)
  const [yCoord, setYCoord] = useQueryParam('y', NumberParam)

  const [filterCategory, setFilterCategory] = useState('Select Category')

  const [zoomLevel, setZoomLevel] = useState(undefined)
  const [zoomInterval, setZoomInterval] = useState(undefined)
  const [enteredLocation, setEnteredLocation] = useState('')

  useEffect(() => {
    if (zoomInterval && zoomLevel > 18) {
      clearInterval(zoomInterval)
    }
  }, [zoomLevel])

  function handleUserMapInteraction() {
    if (zoomInterval) {
      clearInterval(zoomInterval)
    }
  }
  const [fetchMessage, setFetchMessage] = useState(undefined)

  const [fetching, setFetching] = useState(false)

  function getLocation() {
    if (navigator.geolocation) {
      setFetching(true)
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setXCoord(coords.longitude)
          setYCoord(coords.latitude)
          navigate(
            `/find-places/location?x=${coords.longitude}&y=${coords.latitude}`
          )
          setFetching(false)
        },
        (e) => {
          console.log(e)
          setFetching(false)
          setFetchMessage('There was some error trying to obtain your location, try entering location below! If error persists please check if you enabled location access in popup window and if Location Services are enabled on your device for this browser, thanks!')
        },
        {
          enableHighAccuracy: true,
          maximumAge: Infinity,
        }
      )
    }else{
      setFetchMessage("There was some error trying to obtain your location, your browser probably doesn't support location services, try entering location below!")
    }
  }

  function findGeocodeFromAddress(event) {
    if (event.key === 'Enter' || event.button == 0) {
      setFetchMessage(undefined)
      setFetching(true)
      fetch(`/.netlify/functions/getGeolocation?location=${enteredLocation}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          setFetching(false)
          if (data.msg) {
            return setFetchMessage(data.msg)
          }
          const coords = data.data.results[0].locations[0].latLng
          setYCoord(coords.lat)
          setXCoord(coords.lng)
          navigate(`/find-places/location?x=${coords.lng}&y=${coords.lat}`)
        })
        .catch((error) => {
          setFetching(false)
          setFetchMessage(
            'There was some error while trying to find your location. Try later!'
          )
        })
    }
  }

  const data = useStaticQuery(graphql`
    query locationData {
      page:markdownRemark(frontmatter:{templateKey:{eq:"find-places-page"}}) {
        frontmatter {
          seo
          seoTitle
        }
      }
      locations: allMarkdownRemark(
        filter: { frontmatter: { templateKey: { eq: "location" } } }
      ) {
        edges {
          node {
            frontmatter {
              name
              coverImage {
                childImageSharp {
                  fluid(maxWidth: 1000) {
                    ...GatsbyImageSharpFluid
                  }
                }
              }
              pin {
                publicURL
              }
              category
              address
              latitude
              longitude
            }
          }
        }
      }
      categories: allMarkdownRemark(
        filter: { frontmatter: { templateKey: { eq: "location-category" } } }
      ) {
        edges {
          node {
            frontmatter {
              title
              categoryPin {
                publicURL
              }
            }
          }
        }
      }
      currentLocationCategory: allMarkdownRemark(
        filter: {
          frontmatter: {
            templateKey: { eq: "location-category" }
            title: { eq: "Current Location" }
          }
        }
      ) {
        edges {
          node {
            frontmatter {
              categoryPin {
                publicURL
              }
            }
          }
        }
      }
    }
  `)

  return (
    <Layout fullWidth={true}>
      <Helmet>
        <base target="_blank" href="/" />
        {
          data.page.frontmatter.seoTitle ?
          <title>{data.page.frontmatter.seoTitle}</title>
          :
          <title>Find Places | RUN BGD</title>
        }
        {
          data.page.frontmatter.seo ?
          <meta
            name="description"
            content={data.page.frontmatter.seo}
          />
          :
          <meta
            name="description"
            content="Find interesting places and see what is near you in Serbia with our web app at RUN BGD."
          />
        }
      </Helmet>
      <main style={{ width: '100%' }} className={styles.findPlacesWrapper}>
        <div className={styles.background}>
          <video className={styles.fullWidthImage} autoPlay muted loop={true}>
            <source src={videoBackground} type="video/mp4" />
          </video>
          <div className={styles.overlay}></div>
        </div>
        <div className={styles.locationItemsContainer}>
          <div className={styles.inputCard}>
            <p>Where are you looking to have fun?</p>
            <button
              className={styles.inputCardButton}
              onClick={() => getLocation()}
            >
              Search near me
            </button>
            <p>or</p>
            <div className={styles.row}>
              <input
                type="text"
                onKeyDown={findGeocodeFromAddress}
                onChange={e => setEnteredLocation(e.target.value)}
                placeholder="Enter location"
                className={styles.inputCardInput}
              />
              <button className={styles.searchByPlaceButton} onClick={e => findGeocodeFromAddress(e)}>
                <img src={searchIcon} alt=''/>
              </button>
            </div>
            {fetching && (
              <img
                src={loadingIndicator}
                className={styles.loadingIndicator}
                alt="Loading..."
              />
            )}
            {fetchMessage && (
              <p className={styles.fetchMessage}>{fetchMessage}</p>
            )}
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default FindPlaces

import React, { useState, useEffect } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'
import { Helmet } from 'react-helmet'

import Layout from '../../../components/Layout'
import styles from './find-places.module.scss'
import { useQueryParam, NumberParam } from 'use-query-params'
import { icon } from 'leaflet'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import FindPlacesMap from '../../../components/FindPlacesMap'
import FindPlacesLocations from '../../../components/FindPlacesLocations'

import expandButton from '../../../img/down-arrow.svg'
import loadingIndicator from '../../../img/loading-indicator.svg'
import videoBackground from '../../../img/find-places.mp4'

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
  const [currentX, setCurrentX] = useState(0)
  const [currentY, setCurrentY] = useState(0)

  const [zoomLevel, setZoomLevel] = useState(undefined)
  const [zoomInterval, setZoomInterval] = useState(undefined)

  const [clickedLocation, setClickedLocation] = useState(undefined)

  useEffect(() => {
    if (!clickedLocation) {
      if (zoomInterval) {
        clearInterval(zoomInterval)
      }
      setZoomLevel(undefined)
      setZoomInterval(undefined)
    }
  }, [clickedLocation])

  function onLocationClicked(location) {
    setZoomLevel(12)
    if(typeof window != 'undefined'){
      window.scrollTo(0, 0)
    }
    clearInterval(zoomInterval)

    setTimeout(() => {
      setZoomLevel((prevState) => prevState + 1)
      setZoomInterval(
        setInterval(() => {
          setZoomLevel((prevState) => prevState + 1)
        }, 1000)
      )
    }, 1000)
    setClickedLocation(location.frontmatter)
  }

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

  useEffect(() => {
    setCurrentX(xCoord)
    setCurrentY(yCoord)
  }, [xCoord, yCoord])

  const [mapExpanded, setMapExpanded] = useState(false)

  const data = useStaticQuery(graphql`
    query FindPlacesLocationQuery {
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
              website
              email
              description
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
        <title>Find Places | RUN BGD</title>
        <meta
          name="description"
          content="Find interesting places and see what is near you in Serbia with our web app at RUN BGD."
        />
      </Helmet>
      <main style={{ width: '100%' }} className={styles.findPlacesWrapper}>
        <div className={styles.background}>
          <video className={styles.fullWidthImage} autoPlay muted loop={true}>
            <source src={videoBackground} type="video/mp4" />
          </video>
          <div className={styles.overlay}></div>
        </div>
        <div className={styles.locationItemsContainer}>
          <div className={styles.mapAndLocations}>
            <div
              className={`${styles.map} ${mapExpanded && styles.isExpanded}`}
            >
              <FindPlacesMap
                locations={data.locations.edges}
                expanded={mapExpanded}
                zoom={zoomLevel ? zoomLevel : 12}
                currentY={currentY}
                currentX={currentX}
                setCurrentX={setCurrentX}
                setCurrentY={setCurrentY}
                xCoord={xCoord}
                yCoord={yCoord}
                handleUserInteraction={handleUserMapInteraction}
                onClick={onLocationClicked}
                clickedLocation={clickedLocation}
                setClickedLocation={setClickedLocation}
                filterCategory={filterCategory}
              />
            </div>
            <div className={`${styles.expandButtonContainer} ${
                  mapExpanded && styles.isActivated
                }`}>
              <button
                className={styles.expandButton}
                onClick={() => setMapExpanded((prevState) => !prevState)}
              >
                <img src={expandButton} alt="expand button" />
              </button>
            </div>
            <div className={styles.locations}>
              {
                !clickedLocation &&

                <select
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className={styles.categoryFilter}
                >
                  <option value="Select Category">Select Category</option>
                  {data.categories &&
                    data.categories.edges.length > 0 &&
                    data.categories.edges.map(({ node: category }) => {
                      if (category.frontmatter.title == 'Current Location') {
                        return
                      }
                      return (
                        <option value={category.frontmatter.title}>
                          {category.frontmatter.title}
                        </option>
                      )
                    })}
                </select>
              }
              {data.locations &&
                data.locations.edges &&
                data.locations.edges.length > 0 && (
                  <FindPlacesLocations
                    locations={data.locations.edges}
                    xCoord={xCoord}
                    yCoord={yCoord}
                    setCurrentX={setCurrentX}
                    setCurrentY={setCurrentY}
                    filterCategory={filterCategory}
                    onClick={onLocationClicked}
                    clickedLocation={clickedLocation}
                    setClickedLocation={setClickedLocation}
                  />
                )}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default FindPlaces

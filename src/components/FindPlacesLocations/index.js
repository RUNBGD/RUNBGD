import React from 'react'
import Image from 'gatsby-image'

import styles from './find-places-locations.module.scss'

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

const FindPlacesLocations = ({
  locations,
  xCoord,
  yCoord,
  setCurrentX,
  setCurrentY,
  filterCategory,
  horizontalOnMobile,
}) => {
  return (
    <div
      className={`${styles.locationCards} ${
        horizontalOnMobile && styles.horizontal
      }`}
    >
      {locations.map(({ node: location }, index) => {
        let distanceFromStart = undefined
        if (yCoord) {
          distanceFromStart = distance(
            xCoord,
            yCoord,
            location.frontmatter.longitude,
            location.frontmatter.latitude,
            'K'
          )
        } else {
          distanceFromStart = 0
        }

        if (
          distanceFromStart <= 105 &&
          (location.frontmatter.category === filterCategory ||
            filterCategory === 'Select Category')
        ) {
          return (
            <div
              className={styles.locationCard}
              style={{ order: Number(distanceFromStart).toFixed(0) }}
              key={index}
              onClick={() => {
                setCurrentX(0)
                setCurrentY(0)
                setTimeout(() => {
                  setCurrentX(location.frontmatter.longitude)
                  setCurrentY(location.frontmatter.latitude)
                }, 100)
              }}
            >
              <div className={styles.cardCover}>
                <Image
                  fluid={location.frontmatter.coverImage.childImageSharp.fluid}
                  alt=""
                />
              </div>
              <div className={styles.cardText}>
                <p className={styles.cardTitle}>{location.frontmatter.name}</p>
                <p className={styles.cardAddress}>
                  {location.frontmatter.address}
                </p>
                {yCoord && (
                  <p className={styles.distance}>{distanceFromStart} km</p>
                )}
              </div>
            </div>
          )
        }
      })}
    </div>
  )
}

export default FindPlacesLocations

import React from 'react'

import styles from './find-places-locations.module.scss'
import LocationInfoCard from '../LocationInfoCard'
import LocationCard from '../LocationCard'

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
  onClick,
  clickedLocation,
  setClickedLocation
}) => {

  return (
    <div
      className={`${styles.locationCards} ${
        horizontalOnMobile && styles.horizontal
      }`}
    >
      {clickedLocation ? (
        <LocationInfoCard
          location={clickedLocation}
          setLocation={setClickedLocation}
        />
      ) : (
        locations.map(({ node: location }, index) => {
          let distanceFromStart = undefined
          if (yCoord) {
            distanceFromStart = distance(
              xCoord,
              yCoord,
              location.frontmatter.longitude
                ? location.frontmatter.longitude
                : 0,
              location.frontmatter.latitude ? location.frontmatter.latitude : 0,
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
              <LocationCard
                setCurrentX={setCurrentX}
                setCurrentY={setCurrentY}
                location={location}
                onClick={onClick}
                distanceFromStart={distanceFromStart}
                index={index}
                yCoord={yCoord}
              />
            )
          }
        })
      )}
    </div>
  )
}

export default FindPlacesLocations

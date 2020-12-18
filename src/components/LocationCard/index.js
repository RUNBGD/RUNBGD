import React, {useState} from 'react'
import Image from 'gatsby-image'
import VisibilitySensor from 'react-visibility-sensor'
import styles from './location-card.module.scss'
import {useSpring, animated} from 'react-spring'

const LocationCard = ({
  setCurrentX,
  setCurrentY,
  location,
  onClick,
  distanceFromStart,
  index,
  yCoord
}) => {

  const [imageVisible, setImageVisible] = useState(false)

  const props = useSpring({
    from: { transform: imageVisible ? 'translateX(0px)' : 'translateX(-50px)', opacity: imageVisible ? 1 : 0 },
    to: { transform: imageVisible ? 'translateX(0px)' : 'translateX(-50px)', opacity: imageVisible ? 1 : 0}
  })
  
  function onVisibilityChange(isVisible) {
    setImageVisible(isVisible)
  }
  
  if (typeof window != 'undefined') {
    return(
      <VisibilitySensor onChange={onVisibilityChange} partialVisibility>
          <div
            style={{ order: Number(distanceFromStart).toFixed(0) }}
            key={index}
            onClick={() => {
              setCurrentX(0)
              setCurrentY(0)
              setTimeout(() => {
                setCurrentX(
                  location.frontmatter.longitude
                    ? location.frontmatter.longitude
                    : 0
                    )
                    setCurrentY(
                      location.frontmatter.latitude
                      ? location.frontmatter.latitude
                      : 0
                      )
              }, 100)
              onClick && onClick(location)
            }}
            >
            <animated.div
              style={props}
              className={styles.locationCard}
              >
              <div className={styles.cardCover}>
                {location.frontmatter.coverImage &&
                  location.frontmatter.coverImage.childImageSharp &&
                  location.frontmatter.coverImage.childImageSharp.fluid &&
                  imageVisible && (
                    <Image
                    fluid={
                      location.frontmatter.coverImage.childImageSharp.fluid
                    }
                    alt=""
                    />
                    )}
              </div>
              <div className={styles.cardText}>
                <p className={styles.cardTitle}>
                  {location.frontmatter.name}
                </p>
                <p className={styles.cardAddress}>
                  {location.frontmatter.address}
                </p>
                {yCoord && (
                  <p className={styles.distance}>{distanceFromStart} km</p>
                  )}
              </div>
            </animated.div>
          </div>
      </VisibilitySensor>
      )
    }else{
      return <></>
    }
  }
  
  export default LocationCard
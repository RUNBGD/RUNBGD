import React, { useState } from 'react'
import Image from 'gatsby-image'
import { useSpring, animated, interpolate, useSprings } from 'react-spring'
import VisibilitySensor from 'react-visibility-sensor'

import styles from './section-image.module.scss'

const SectionImage = ({ imageOnRight, image }) => {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  const { translateX, opacity } = useSpring({
    from: {
      translateX: visible ? (imageOnRight ? 50 : -50) : 0,
      opacity: visible ? 0 : 1,
    },
    to: {
      translateX: visible ? 0 : imageOnRight ? 50 : -50,
      opacity: visible ? 1 : 0,
    },
  })

  const { scale } = useSpring({
    from: {
      scale: hovered ? 1 : 1.1,
    },
    to: {
      scale: hovered ? 1.1 : 1,
    },
  })

  const handleVisibility = (isVisible) => {
    setVisible(isVisible)
  }

  return (
    <VisibilitySensor onChange={handleVisibility}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <animated.div
          style={{
            transform: translateX.interpolate(
              (translateX) => `scale(1.2) translateX(${translateX}%)`
            ),
            opacity: opacity,
          }}
          className={styles.sectionImage}
        >
          <animated.div
            style={{
              transform: scale.interpolate((scale) => `scale(${scale})`),
            }}
          >
            <Image fluid={image} alt="" />
          </animated.div>
        </animated.div>
      </div>
    </VisibilitySensor>
  )
}

export default SectionImage

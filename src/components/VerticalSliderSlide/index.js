import React from 'react'
import { useTransition, animated } from 'react-spring'

import styles from './vertical-slider-slide.module.scss'

const VerticalSliderSlide = ({ active, children, transition, key }) => {
  const transitionAnimation = useTransition(active, null, transition)

  return (
    <React.Fragment>
      <div className={styles.verticalSliderSlide} key={key}>
      {transitionAnimation.map(({ item, key, props }) => {
        return (
          item && (
              <animated.div key={key} style={props}>{children}</animated.div>
          )
        )
      })}
      </div>
    </React.Fragment>
  )
}

export default VerticalSliderSlide

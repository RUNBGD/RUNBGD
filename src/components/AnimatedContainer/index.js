import React from 'react'
import { animated, useTransition, useSpring } from 'react-spring'

import styles from './animated-container.module.scss'

const AnimatedContainer = ({ active, transition, children, className }) => {
  const props = useSpring({
    from: {...transition.from},
    to: active ? {...transition.enter} : {...transition.leave} 
  })

  console.log(active)

  return (
      <div className={className}>
        <animated.div style={props} >
          {children}
        </animated.div>
      </div>
  )
}

export default AnimatedContainer

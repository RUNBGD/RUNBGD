import React from 'react'
import { animated, useTransition } from 'react-spring'

import styles from './animated-container.module.scss'

const AnimatedContainer = ({active, transition, children, className}) => {
    
    const transitionAnimation = useTransition(active, null, transition)

    return(
        <React.Fragment>
            {transitionAnimation.map(({item, key, props}) => {
                return item &&  
                <animated.div style={props} key={key} className={className}>
                    {children}
                </animated.div>
            })}
        </React.Fragment>
    )
}

export default AnimatedContainer
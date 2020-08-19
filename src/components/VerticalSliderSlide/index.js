import React from 'react'
import {useTransition, animated} from 'react-spring'

import styles from './vertical-slider-slide.module.scss'


const VerticalSliderSlide = ({active, children, transition}) => {

    const transitionAnimation = useTransition(active, null, transition)

    return(
        <React.Fragment>
            {transitionAnimation.map(({item, key, props}) => {
                return item && 
                    <div key={key} className={styles.verticalSliderSlide}>
                        <animated.div style={props}>
                            {children}
                        </animated.div>
                    </div>
            })}
        </React.Fragment>
    )
}

export default VerticalSliderSlide
import React, {useState} from 'react'
import {useTransition, useSpring, animated} from 'react-spring'


import Layout from '../../components/Layout'
import styles from './about-page.module.scss'

const AboutPage = () => {

    
    const [currentSlide, setCurrentSlide] = useState(1)
    
    const appearTransition = useTransition(currentSlide == 1, null, {
        from:{opacity:0},
        enter:{opacity:1},
        leave:{opacity:0}
    })

    const slideDownTransition = useTransition(currentSlide == 2, null, {
        from:{transform:'translate(-50%, 100%)', opacity:0},
        enter:{transform:'translate(-50%, -50%)', opacity:1},
        leave:{transform:'translate(-50%, -100%)', opacity:0}
    })

    const slideUp = useSpring({
        from:{transform:currentSlide == 1 ? 'scale(0)' : 'scale(1)'},
        to:{transform:currentSlide == 1 ? 'scale(1)' : 'scale(0)'},
        delay:100
    })

    const nextSlide = () => {
        if(currentSlide < 2){
            setCurrentSlide(prevState => prevState + 1)
        }else{
            setCurrentSlide(1)
        }
    }

    const prevSlide = () => {
        if(currentSlide > 1){
            setCurrentSlide(prevState => prevState - 1)
        }else{
            setCurrentSlide(2)
        }
    }

    return(
        <Layout verticalSlider={true}>
            <div className={styles.verticalSliderContainer} onDoubleClick={prevSlide} onClick={nextSlide}>
                {appearTransition.map(({item, key, props}) => {
                    return item && 
                        <animated.div style={props} className={styles.verticalSliderSlide}>
                            <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                                <animated.h2 style={slideUp} className={styles.centeredText}>
                                    This is something about RUN BGD
                                </animated.h2>
                            </div>
                        </animated.div>
                })}
                {slideDownTransition.map(({item, key, props}) => {
                    return item && 
                        <animated.div style={props} className={styles.verticalSliderSlide}>
                            <div className={styles.slideBackground}>
                                <h2 className={styles.centeredText}>
                                    This is something more about RUN BGD
                                </h2>
                            </div>
                        </animated.div>
                })}
            </div>
        </Layout>
    )
}

export default AboutPage
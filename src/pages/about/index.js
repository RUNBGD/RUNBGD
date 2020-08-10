import React, {useState, useEffect} from 'react'
import {useTransition, useSpring, animated} from 'react-spring'


import Layout from '../../components/Layout'
import styles from './about-page.module.scss'

const AboutPage = () => {

    
    const [currentSlide, setCurrentSlide] = useState(1)
    const [changedSlideTime, setChangedSlideTime] = useState(0)
    const [touchMoves, setTouchMoves] = useState([])
    
    const appearTransition = useTransition(currentSlide == 1, null, {
        from:{opacity:0},
        enter:{opacity:1},
        leave:{opacity:0}
    })

    const slideDownTransition = useTransition(currentSlide == 2, null, {
        from:{transform:'translate(-50%, 100%)'},
        enter:{transform:'translate(-50%, -50%)'},
        leave:{transform:'translate(-50%, -100%)'}
    })

    const slideUp = useSpring({
        from:{transform:currentSlide == 1 ? 'scale(0)' : 'scale(1)'},
        to:{transform:currentSlide == 1 ? 'scale(1)' : 'scale(0)'},
        delay:100
    })

    const nextSlide = () => {
        let date = new Date()
        let currentTime = date.getTime()
        if(currentTime - changedSlideTime >= 1000){
            if(currentSlide < 2){
                setCurrentSlide(prevState => prevState + 1)
            }else{
                setCurrentSlide(1)
            }
            setChangedSlideTime(currentTime)
        }else{
            return
        }
    }

    const prevSlide = () => {
        let date = new Date()
        let currentTime = date.getTime()
        if(currentTime - changedSlideTime >= 1000){
            if(currentSlide > 1){
                setCurrentSlide(prevState => prevState - 1)
            }else{
                setCurrentSlide(2)
            }
            setChangedSlideTime(currentTime)
        }else{
            return
        }
    }

    useEffect(() => {
        if(touchMoves[0] && touchMoves[1]){

            if(touchMoves[0][0].screenY >= touchMoves[1][0].screenY){
                nextSlide()
            }else{
                prevSlide()
            }
        }
    }, [touchMoves])

    return(
        <Layout verticalSlider={true}>
            <div className={styles.verticalSliderContainer} onClick={nextSlide} onWheel={(e) => {return e.deltaY > 0 ? nextSlide() : prevSlide()}} onTouchMove={(e) => {e.persist(); setTouchMoves((prevState) => {return [...prevState, e.changedTouches]})}} onTouchEnd={() => setTouchMoves([])}>
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
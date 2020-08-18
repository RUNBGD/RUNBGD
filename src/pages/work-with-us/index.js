import React, {useState, useEffect} from 'react'
import {useTransition, useSpring, animated} from 'react-spring'
import {useStaticQuery, graphql} from 'gatsby'
import Image from 'gatsby-image'


import Layout from '../../components/Layout'
import logo from '../../img/logo.jpeg'
import nightlifeImage from '../../img/nightlife.jpg'
import styles from './work-with-us.module.scss'

const WorkWithUsPage = () => {

    const data = useStaticQuery(graphql`
        query WorkWithUsData{
            slidesData: markdownRemark(frontmatter:{templateKey: {eq: "work-with-us-page"}}){
                frontmatter{
                    coverImage{
                        childImageSharp{
                            fluid(maxWidth:1920, quality:64){
                                ...GatsbyImageSharpFluid
                            }
                        }
                    }
                    slides{
                        coverImage{
                            childImageSharp{
                                fluid(maxWidth:1920, quality:64){
                                    ...GatsbyImageSharpFluid
                                }
                            }
                        }
                        slideText
                    }
                }
            }
        }
    `)
    
    const [currentSlide, setCurrentSlide] = useState(1)
    const [changedSlideTime, setChangedSlideTime] = useState(0)
    const [touchMoves, setTouchMoves] = useState([])
    
    const appearTransition = useTransition(currentSlide == 1, null, {
        from:{opacity:0},
        enter:{opacity:1},
        leave:{opacity:0}
    })

    const slideDownTransition = useTransition(currentSlide == 2, null, {
        from:{transform:'translate(-50%, 120%)'},
        enter:{transform:'translate(-50%, -50%)'},
        leave:{transform:'translate(-50%, -120%)'}
    })

    const slideUpTransition = useTransition(currentSlide == 5, null, {
        from:{transform:'translate(-50%, -150%)'},
        enter:{transform:'translate(-50%, -50%)'},
        leave:{transform:'translate(-50%, 150%)'}
    })

    const slideLeftTransition = useTransition(currentSlide == 3, null, {
        from:{transform:'translate(-150%, -50%)'},
        enter:{transform:'translate(-50%, -50%)'},
        leave:{transform:'translate(150%, -50%)'}
    })

    const slideRightTransition = useTransition(currentSlide == 4, null, {
        from:{transform:'translate(150%, -50%)'},
        enter:{transform:'translate(-50%, -50%)'},
        leave:{transform:'translate(-150%, -50%)'}
    })

    const slideUp = useSpring({
        from:{transform:currentSlide == 1 ? 'scale(0)' : 'scale(1)'},
        to:{transform:currentSlide == 1 ? 'scale(1)' : 'scale(0)'},
        delay:100
    })

    const slideDown = useSpring({
        from:{transform:currentSlide == 5 ? 'translate(0%, -150%)' : 'translate(0%, 0%)'},
        to:{transform:currentSlide == 5 ? 'translate(0%, 0%)' : 'translate(0%, -150%)'},
        delay:100
    })

    const slideRight = useSpring({
        from:{transform:currentSlide == 3 ? 'translate(150%, 0%)' : 'translate(0%, 0%)'},
        to:{transform:currentSlide == 3 ? 'translate(0%, 0%)' : 'translate(150%, 0%)'},
        delay:100
    })

    const slideLeft = useSpring({
        from:{transform:currentSlide == 4 ? 'translate(-150%, 0%)' : 'translate(0%, 0%)'},
        to:{transform:currentSlide == 4 ? 'translate(0%, 0%)' : 'translate(-150%, 0%)'},
        delay:100
    })


    const nextSlide = () => {
        let date = new Date()
        let currentTime = date.getTime()
        if(currentTime - changedSlideTime >= 1000){
            if(currentSlide < 5){
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
                setCurrentSlide(5)
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


    console.log(data)
    return(
        <Layout verticalSlider={true}>
            <div className={styles.verticalSliderContainer} onClick={nextSlide} onWheel={(e) => {return e.deltaY > 0 ? nextSlide() : prevSlide()}} onTouchMove={(e) => {e.persist(); setTouchMoves((prevState) => {return [...prevState, e.changedTouches]})}} onTouchEnd={() => setTouchMoves([])}>
                {appearTransition.map(({item, key, props}) => {
                    return item && 
                        <animated.div style={props} className={styles.verticalSliderSlide}>
                            <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                                <animated.div  style={slideUp} className={styles.lStack}>
                                    <div className={styles.backgroundImage}>
                                        <Image fluid={data.slidesData.frontmatter.slides[0].coverImage.childImageSharp.fluid} alt=''/>
                                    </div>
                                    <img src={logo} className={styles.logo} alt=''/>
                                    <h2>
                                        {data.slidesData.frontmatter.slides[0].slideText}
                                    </h2>
                                </animated.div>
                            </div>
                        </animated.div>
                })}
                {slideDownTransition.map(({item, key, props}) => {
                    return item && 
                        <animated.div style={props} className={styles.verticalSliderSlide}>
                            <div className={styles.slideBackground}>
                                <h2 className={styles.centeredText}>
                                    {data.slidesData.frontmatter.slides[1].slideText}
                                </h2>
                            </div>
                        </animated.div>
                })}
                {slideLeftTransition.map(({item, key, props}) => {
                    return item && 
                        <animated.div style={props} className={styles.verticalSliderSlide}>
                            <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                                <animated.div  style={slideRight} className={styles.lStack}>
                                    <div className={styles.backgroundImage}>
                                        <Image fluid={data.slidesData.frontmatter.slides[2].coverImage.childImageSharp.fluid} alt=''/>
                                    </div>
                                    <h2>
                                        {data.slidesData.frontmatter.slides[2].slideText}
                                    </h2>
                                </animated.div>
                            </div>
                        </animated.div>
                })}
                {slideRightTransition.map(({item, key, props}) => {
                    return item && 
                        <animated.div style={props} className={styles.verticalSliderSlide}>
                            <div className={styles.slideBackground} style={{background:'#fff', color:'black'}}>
                                <animated.div  style={slideLeft} className={styles.lStack}>
                                    <h2>
                                        {data.slidesData.frontmatter.slides[3].slideText}
                                    </h2>
                                </animated.div>
                            </div>
                        </animated.div>
                })}
                {slideUpTransition.map(({item, key, props}) => {
                    return item && 
                        <animated.div style={props} className={styles.verticalSliderSlide}>
                            <div className={styles.slideBackground} style={{background:'#fff', color:'black'}}>
                                <animated.div  style={slideDown} className={styles.lStack}>
                                    <h2>
                                        {data.slidesData.frontmatter.slides[4].slideText}
                                    </h2>
                                </animated.div>
                            </div>
                        </animated.div>
                })}
            </div>
        </Layout>
    )
}

export default WorkWithUsPage
import React, {useState, useEffect} from 'react'
import {useTransition, useSpring, animated} from 'react-spring'
import {useStaticQuery, graphql} from 'gatsby'
import Image from 'gatsby-image'
import remark from 'remark'
import remarkHTML from 'remark-html'


import Layout from '../../components/Layout'
import logo from '../../img/logo.jpeg'
import nightlifeImage from '../../img/nightlife.jpg'
import styles from './about-page.module.scss'
import { HTMLContent } from '../../components/Content'
import VerticalSliderSlide from '../../components/VerticalSliderSlide'
import AnimatedContainer from '../../components/AnimatedContainer'
import logoNetworks from '../../img/logo-runbgd-networks.png'
import logoTours from '../../img/logo-runbgd-tours.png'
import logoShop from '../../img/logo-runbgd-shop.png'
import logoJam from '../../img/logo-runbgd-jam.png'
import logoMinus1 from '../../img/logo-runbgd-minus1.png'

const toHTML = value => remark().use(remarkHTML).processSync(value).toString()
const transitions ={
    appear:{
        from:{opacity:0},
        enter:{opacity:1},
        leave:{opacity:0},
        trail:0
    },
    slideDown:{
        from:{transform:'translate(0%, 120%)'},
        enter:{transform:'translate(0%, 0%)'},
        leave:{transform:'translate(0%, -120%)'},
        trail:0
    },
    slideUp:{
        from:{transform:'translate(0%, -150%)'},
        enter:{transform:'translate(0%, 0%)'},
        leave:{transform:'translate(0%, 150%)'},
        trail:0
    },
    slideLeft:{
        from:{transform:'translate(-150%, 0%)'},
        enter:{transform:'translate(0%, 0%)'},
        leave:{transform:'translate(150%, 0%)'},
        trail:0
    },
    slideRight:{
        from:{transform:'translate(150%, 0%)'},
        enter:{transform:'translate(0%, 0%)'},
        leave:{transform:'translate(-150%, 0%)'},
        trail:0
    },
    scale:{
        from:{transform:'scale(0)'},
        enter:{transform:'scale(1)'},
        leave:{transform:'scale(0)'},
        trail:0
    }
}

const AboutPage = () => {

    const data = useStaticQuery(graphql`
        query AboutData{
            slidesData: markdownRemark(frontmatter:{templateKey: {eq: "about-page"}}){
                frontmatter{
                    slides{
                        coverImage{
                            childImageSharp{
                                fluid(maxWidth:1920, quality:64){
                                    ...GatsbyImageSharpFluid
                                }
                            }
                        }
                        slideText
                        slideDuration
                        transition
                        textTransition
                    }
                }
            }
            logos: allMarkdownRemark(filter:{frontmatter:{templateKey:{eq: "logos"}}}){
                edges{
                    node{
                        frontmatter{
                            title
                            logoImage{
                                childImageSharp{
                                    fluid(maxWidth:200, quality:64){
                                        ...GatsbyImageSharpFluid
                                    }
                                }
                            }
                        }
                    }
                }
            }
            networksLogo: markdownRemark(frontmatter:{templateKey:{eq: "logos"}, title:{eq: "Networks"}}){
                frontmatter{
                    logoImage{
                        childImageSharp{
                            fluid(maxWidth:300, quality: 64){
                                ...GatsbyImageSharpFluid
                            }
                        }
                    }
                }
            }
        }
    `)
    
    const [currentSlide, setCurrentSlide] = useState(0)
    const [changedSlideTime, setChangedSlideTime] = useState(0)
    const [touchMoves, setTouchMoves] = useState([])
    const [autoplayDirection, setAutoplayDirection] = useState(undefined)
    const [forwardInterval, setForwardInterval] = useState(undefined)
    const [backwardInterval, setBackwardInterval] = useState(undefined)
    const [slideIntervalTime, setSlideIntervalTime] = useState(2500)


    const nextSlide = () => {
        
        let date = new Date()
        let currentTime = date.getTime()
        if(currentTime - changedSlideTime >= 1000){
            console.log(currentSlide, data.slidesData.frontmatter.slides.length)
            if((currentSlide + 1) < data.slidesData.frontmatter.slides.length){
                setCurrentSlide(prevState => {
                    if(prevState + 1 < data.slidesData.frontmatter.slides.length){
                        return prevState + 1
                    }else{
                        return 0
                    }
                })
            }else{
                setCurrentSlide(0)
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
            if(currentSlide > 0){
                setCurrentSlide(prevState => prevState - 1)
            }else{
                setCurrentSlide(data.slidesData.frontmatter.slides.length - 1)
            }
            setChangedSlideTime(currentTime)
        }else{
            return
        }
    }

    useEffect(() => {
        if(touchMoves[0] && touchMoves[1]){

            if(touchMoves[0][0].screenY >= touchMoves[1][0].screenY){
                nextSlide(); setAutoplayDirection(prevState => {
                    if(prevState === 'forward'){
                        return undefined
                    }
                    else if(prevState !== 'forward'){
                        return 'forward'
                    }
                })
            }else{
                prevSlide(); setAutoplayDirection(prevState => {
                    if(prevState === 'backward'){
                        return undefined
                    }
                    else if(prevState !== 'backward'){
                        return 'backward'
                    }
                })
            }
        }
    }, [touchMoves])

    useEffect(() => {
        if(autoplayDirection === 'forward'){
            clearInterval(forwardInterval)
            clearInterval(backwardInterval)
            setForwardInterval(setInterval(() => {
                nextSlide()
            }, slideIntervalTime))
        }else if(autoplayDirection === 'backward'){
            clearInterval(forwardInterval)
            clearInterval(backwardInterval)
            setBackwardInterval(setInterval(() => {
                prevSlide()
            }, slideIntervalTime))
        }
        else{
            clearInterval(forwardInterval)
            clearInterval(backwardInterval)
        }
        
    }, [autoplayDirection, slideIntervalTime])

    useEffect(() => {
        let currentSlideObject = data.slidesData.frontmatter.slides[currentSlide] 
        if(currentSlideObject){
            let slideInterval = currentSlideObject.slideDuration
            if(slideInterval){
                setSlideIntervalTime(slideInterval)
            }
        }
    }, [currentSlide])

    console.log(data.slidesData.frontmatter.slides)

    return(
        <Layout verticalSlider={true}>
            <div className={styles.verticalSliderContainer} 
            onClick={() => {if(autoplayDirection == undefined){nextSlide()}; setAutoplayDirection(prevState => {
                        if(prevState === 'forward'){
                            return undefined
                        }
                        else if(prevState !== 'forward'){
                            return 'forward'
                        }
                    })
                }} 
                onWheel={(e) => {
                if(e.deltaY > 0){
                    nextSlide(); setAutoplayDirection(prevState => {
                        if(prevState === 'forward'){
                            return undefined
                        }
                        else if(prevState !== 'forward'){
                            return 'forward'
                        }
                    })
                }else{
                    prevSlide(); setAutoplayDirection(prevState => {
                        if(prevState === 'backward'){
                            return undefined
                        }
                        else if(prevState !== 'backward'){
                            return 'backward'
                        }
                    })
                }
                }} onTouchMove={(e) => {e.persist(); setTouchMoves((prevState) => {return [...prevState, e.changedTouches]})}} onTouchEnd={() => setTouchMoves([])}>
                {/* <VerticalSliderSlide 
                    active={currentSlide == 1}
                    transition={transitions.appear}
                    >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                            <div className={styles.lStack}>
                                {data.slidesData.frontmatter.slides[0].coverImage &&
                                    <div className={styles.backgroundImage}>
                                        <Image fluid={data.slidesData.frontmatter.slides[0].coverImage.childImageSharp.fluid} alt=''/>
                                    </div>
                                }
                                <AnimatedContainer 
                                    active={currentSlide == 1} 
                                    className={styles.lStack} 
                                    transition={transitions.scale}
                                >
                                <Image fluid={data.networksLogo.frontmatter.logoImage.childImageSharp.fluid} alt='' className={styles.logo}/>
                                <h2>
                                    {data.slidesData.frontmatter.slides[0].slideText}
                                </h2>
                                </AnimatedContainer>
                                <AnimatedContainer 
                                    active={currentSlide == 1} 
                                    className={styles.lStack} 
                                    transition={transitions.slideDown}
                                >
                                    <div className={styles.allLogos}>
                                        {data.logos.edges.map(({node:logo}) => {
                                            if(logo.frontmatter.title !== 'Networks'){
                                                return <Image fluid={logo.frontmatter.logoImage.childImageSharp.fluid} alt={logo.frontmatter.title}/>
                                            }
                                          })}
                                          </div>
                                          </AnimatedContainer>
                                          </div>
                                          </div>
                                        </VerticalSliderSlide> */}
                {
                  data.slidesData.frontmatter.slides.map((slide, index) => {
                    return <VerticalSliderSlide
                            active={currentSlide == index}
                            key={index}
                            transition={
                                transitions[slide.transition]
                            }
                            >
                                <div className={styles.slideBackground}>
                                    {slide.coverImage && slide.coverImage.childImageSharp && slide.coverImage.childImageSharp.fluid &&
                                        <div className={styles.backgroundImage}>
                                            <Image fluid={slide.coverImage.childImageSharp.fluid} alt=''/>
                                        </div>
                                    }
                                    <AnimatedContainer 
                                    active={currentSlide == index}
                                    transition={
                                        transitions[slide.textTransition]
                                    }
                                    className={styles.lStack} 
                                    >
                                    <HTMLContent
                                        className={`${styles.slideBody} ${(slide.coverImage && slide.coverImage.childImageSharp && slide.coverImage.childImageSharp.fluid) && styles.darkBackgroundText}`}
                                        content={toHTML(slide.slideText)}
                                    />
                                </AnimatedContainer>
                                </div>
                            </VerticalSliderSlide>
                  })
                }
                {/* <VerticalSliderSlide
                    active={currentSlide == 2}
                    transition={
                        transitions.slideDown
                    }
                >
                    <div className={styles.lStack}>
                        <div className={styles.slideBackground}>
                            {data.slidesData.frontmatter.slides[1].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[1].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                            <h2>
                                {data.slidesData.frontmatter.slides[1].slideText}
                            </h2>
                        </div>
                    </div>
                </VerticalSliderSlide> */}
                {/* <VerticalSliderSlide 
                    transition={transitions.slideLeft}
                    active={currentSlide == 3}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[2].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[2].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            active={currentSlide == 3} 
                            className={styles.lStack} 
                            transition={transitions.slideRight}
                        >
                            <Image className={styles.logo} fluid={data.networksLogo.frontmatter.logoImage.childImageSharp.fluid} alt='' />
                            <h2>
                                {data.slidesData.frontmatter.slides[2].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide> */}
                {/* <VerticalSliderSlide
                    active={currentSlide == 4}
                    transition={transitions.slideRight}
                >
                    <div className={styles.slideBackground} style={{background:'#fff', color:'black'}}>
                        {data.slidesData.frontmatter.slides[3].coverImage &&
                            <div className={styles.backgroundImage}>
                                <Image fluid={data.slidesData.frontmatter.slides[3].coverImage.childImageSharp.fluid} alt=''/>
                            </div>
                        }
                        <AnimatedContainer 
                            transition={transitions.slideLeft} 
                            active={currentSlide == 4}
                            className={styles.lStack} 
                            >
                            <h2>
                                {data.slidesData.frontmatter.slides[3].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideUp}
                    active={currentSlide == 5}
                >
                    <div className={styles.slideBackground} style={{background:'#fff', color:'black'}}>
                        {data.slidesData.frontmatter.slides[4].coverImage &&
                            <div className={styles.backgroundImage}>
                                <Image fluid={data.slidesData.frontmatter.slides[4].coverImage.childImageSharp.fluid} alt=''/>
                            </div>
                        }
                        <AnimatedContainer 
                            transition={transitions.slideDown} 
                            active={currentSlide == 5}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[4].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.appear}
                    active={currentSlide == 6}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                            {data.slidesData.frontmatter.slides[5].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[5].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                            <AnimatedContainer 
                                transition={transitions.slideUp} 
                                active={currentSlide == 6}
                                className={styles.lStack} 
                            >
                                <h2>
                                    {data.slidesData.frontmatter.slides[5].slideText}
                                </h2>
                            </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 7}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                            {data.slidesData.frontmatter.slides[6].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[6].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 7}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[6].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideLeft}
                    active={currentSlide == 8}
                >
                    <div className={styles.slideBackground} style={{background:'#fff', color:'black'}}>
                            {data.slidesData.frontmatter.slides[7].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[7].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideRight} 
                            active={currentSlide == 8}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[7].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideRight}
                    active={currentSlide == 9}
                >
                    <div className={styles.slideBackground} style={{background:'#fff', color:'black'}}>
                            {data.slidesData.frontmatter.slides[8].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[8].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideLeft} 
                            active={currentSlide == 9}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[8].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideUp}
                    active={currentSlide == 10}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                            {data.slidesData.frontmatter.slides[9].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[9].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideDown} 
                            active={currentSlide == 10}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[9].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.appear}
                    active={currentSlide == 11}
                >
                    <div className={styles.slideBackground} style={{background:'#fff', color:'black'}}>
                            {data.slidesData.frontmatter.slides[10].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[10].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 11}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[10].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.scale}
                    active={currentSlide == 12}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                            {data.slidesData.frontmatter.slides[11].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[11].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.appear} 
                            active={currentSlide == 12}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[11].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideLeft}
                    active={currentSlide == 13}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                            {data.slidesData.frontmatter.slides[12].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[12].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideLeft} 
                            active={currentSlide == 13}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[12].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 14}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                            {data.slidesData.frontmatter.slides[13].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[13].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideDown} 
                            active={currentSlide == 14}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[13].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideUp}
                    active={currentSlide == 15}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                            {data.slidesData.frontmatter.slides[14].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[14].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideUp} 
                            active={currentSlide == 15}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[14].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideRight}
                    active={currentSlide == 16}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                            {data.slidesData.frontmatter.slides[15].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[15].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideRight} 
                            active={currentSlide == 16}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[15].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.appear}
                    active={currentSlide == 17}
                >
                    <div className={styles.slideBackground} style={{background:'#fff', color:'black'}}>
                            {data.slidesData.frontmatter.slides[16].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[16].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.appear} 
                            active={currentSlide == 17}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[16].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.scale}
                    active={currentSlide == 18}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                            {data.slidesData.frontmatter.slides[17].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[17].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 18}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[17].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.scale}
                    active={currentSlide == 19}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                            {data.slidesData.frontmatter.slides[18].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[18].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.appear} 
                            active={currentSlide == 19}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[18].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.appear}
                    active={currentSlide == 20}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                            {data.slidesData.frontmatter.slides[19].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[19].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 20}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[19].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideLeft}
                    active={currentSlide == 21}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                            {data.slidesData.frontmatter.slides[20].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[20].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideRight} 
                            active={currentSlide == 21}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[20].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 22}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                            {data.slidesData.frontmatter.slides[21].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[21].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideRight} 
                            active={currentSlide == 22}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[21].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 23}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                            {data.slidesData.frontmatter.slides[22].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[22].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 23}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[22].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.appear}
                    active={currentSlide == 24}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[23].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[23].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideUp} 
                            active={currentSlide == 24}
                            className={styles.lStack} 
                        >
                            <Image className={styles.logo} fluid={data.networksLogo.frontmatter.logoImage.childImageSharp.fluid} alt='' />
                            <h2>
                                {data.slidesData.frontmatter.slides[23].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.appear}
                    active={currentSlide == 25}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[24].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[24].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 25}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[24].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.appear}
                    active={currentSlide == 26}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[25].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[25].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideLeft} 
                            active={currentSlide == 26}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[25].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 27}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[26].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[26].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 27}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[26].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 28}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[27].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[27].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 28}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[27].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 29}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[28].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[28].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 29}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[28].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 30}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[29].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[29].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 30}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[29].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 31}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[30].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[30].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 31}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[30].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 32}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[31].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[31].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 32}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[31].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 33}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[32].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[32].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 33}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[32].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 34}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[33].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[33].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 34}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[33].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 35}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[34].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[34].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 35}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[34].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 36}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[35].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[35].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 36}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[35].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 37}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[36].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[36].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 37}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[36].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 38}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[37].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[37].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 38}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[37].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 39}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[38].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[38].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 39}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[38].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 40}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[39].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[39].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 40}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[39].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 41}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[40].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[40].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 41}
                            className={styles.lStack} 
                        >
                            <Image className={styles.logo} fluid={data.networksLogo.frontmatter.logoImage.childImageSharp.fluid} alt='' />
                            <h2>
                                {data.slidesData.frontmatter.slides[40].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 42}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[41].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[41].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 42}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[41].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 43}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[42].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[42].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 43}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[42].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 44}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[43].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[43].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 44}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[43].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 45}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[44].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[44].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 45}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[44].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 46}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[45].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[45].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 46}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[45].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 47}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[46].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[46].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 47}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[46].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 48}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[47].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[47].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 48}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[47].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 49}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[48].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[48].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 49}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[48].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 50}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[49].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[49].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 50}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[49].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 51}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[50].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[50].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 51}
                            className={styles.lStack} 
                        >
                            <Image className={styles.logo} fluid={data.networksLogo.frontmatter.logoImage.childImageSharp.fluid} alt='' />
                            <h2>
                                {data.slidesData.frontmatter.slides[50].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 52}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[51].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[51].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 52}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[51].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 53}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[52].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[52].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 53}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[52].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 54}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[53].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[53].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 54}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[53].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 55}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[54].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[54].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 55}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[54].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.appear}
                    active={currentSlide == 56}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[55].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[55].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideUp} 
                            active={currentSlide == 56}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[55].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.appear}
                    active={currentSlide == 57}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[56].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[56].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideUp} 
                            active={currentSlide == 57}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[56].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.appear}
                    active={currentSlide == 58}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[57].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[57].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideUp} 
                            active={currentSlide == 58}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[57].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.appear}
                    active={currentSlide == 59}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[58].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[58].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideUp} 
                            active={currentSlide == 59}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[58].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.appear}
                    active={currentSlide == 60}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[59].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[59].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideUp} 
                            active={currentSlide == 60}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[59].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.appear}
                    active={currentSlide == 61}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[60].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[60].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideUp} 
                            active={currentSlide == 61}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[60].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.appear}
                    active={currentSlide == 62}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[61].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[61].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideUp} 
                            active={currentSlide == 62}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[61].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.appear}
                    active={currentSlide == 63}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[62].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[62].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideUp} 
                            active={currentSlide == 63}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[62].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.appear}
                    active={currentSlide == 64}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[63].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[63].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideUp} 
                            active={currentSlide == 64}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[63].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.appear}
                    active={currentSlide == 65}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[64].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[64].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideUp} 
                            active={currentSlide == 65}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[64].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.appear}
                    active={currentSlide == 66}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[65].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[65].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideUp} 
                            active={currentSlide == 66}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[65].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.appear}
                    active={currentSlide == 67}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[66].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[66].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideUp} 
                            active={currentSlide == 67}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[66].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.appear}
                    active={currentSlide == 68}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[67].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[67].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideUp} 
                            active={currentSlide == 68}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[67].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.appear}
                    active={currentSlide == 69}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[68].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[68].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideUp} 
                            active={currentSlide == 69}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[68].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.appear}
                    active={currentSlide == 70}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[69].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[69].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideUp} 
                            active={currentSlide == 70}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[69].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.appear}
                    active={currentSlide == 71}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[70].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[70].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideUp} 
                            active={currentSlide == 71}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[70].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.appear}
                    active={currentSlide == 72}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[71].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[71].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideUp} 
                            active={currentSlide == 72}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[71].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.appear}
                    active={currentSlide == 73}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[72].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[72].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideUp} 
                            active={currentSlide == 73}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[72].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.appear}
                    active={currentSlide == 74}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[73].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[73].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideUp} 
                            active={currentSlide == 74}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[73].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.appear}
                    active={currentSlide == 75}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[74].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[74].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideUp} 
                            active={currentSlide == 75}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[74].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.appear}
                    active={currentSlide == 76}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[75].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[75].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideUp} 
                            active={currentSlide == 76}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[75].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.appear}
                    active={currentSlide == 77}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[76].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[76].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideUp} 
                            active={currentSlide == 77}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[76].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.appear}
                    active={currentSlide == 78}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[77].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[77].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideUp} 
                            active={currentSlide == 78}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[77].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    transition={transitions.appear}
                    active={currentSlide == 79}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        {data.slidesData.frontmatter.slides[78].coverImage &&
                                <div className={styles.backgroundImage}>
                                    <Image fluid={data.slidesData.frontmatter.slides[78].coverImage.childImageSharp.fluid} alt=''/>
                                </div>
                            }
                        <AnimatedContainer 
                            transition={transitions.slideUp} 
                            active={currentSlide == 79}
                            className={styles.lStack} 
                        >
                            <Image className={styles.logo} fluid={data.networksLogo.frontmatter.logoImage.childImageSharp.fluid} alt='' />
                            <h2>
                            <HTMLContent content={toHTML(data.slidesData.frontmatter.slides[78].slideText)}/>
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>*/}
            </div> 
        </Layout>
    )
}

export default AboutPage
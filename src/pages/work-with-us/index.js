import React, {useState, useEffect} from 'react'
import {useTransition, useSpring, animated} from 'react-spring'
import {useStaticQuery, graphql} from 'gatsby'
import Image from 'gatsby-image'


import Layout from '../../components/Layout'
import logo from '../../img/logo.jpeg'
import nightlifeImage from '../../img/nightlife.jpg'
import styles from './work-with-us.module.scss'
import VerticalSliderSlide from '../../components/VerticalSliderSlide'
import AnimatedContainer from '../../components/AnimatedContainer'

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

    const transitions ={
        appear:{
            from:{opacity:0},
            enter:{opacity:1},
            leave:{opacity:0},
            trail:100
        },
        slideDown:{
            from:{transform:'translate(0%, 120%)', opacity:0},
            enter:{transform:'translate(0%, 0%)', opacity:1},
            leave:{transform:'translate(0%, -120%)', opacity:0},
            trail:100
        },
        slideUp:{
            from:{transform:'translate(0%, -150%)', opacity:0},
            enter:{transform:'translate(0%, 0%)', opacity:1},
            leave:{transform:'translate(0%, 150%)', opacity:0},
            trail:100
        },
        slideLeft:{
            from:{transform:'translate(-150%, 0%)', opacity:0},
            enter:{transform:'translate(0%, 0%)', opacity:1},
            leave:{transform:'translate(150%, 0%)', opacity:0},
            trail:100
        },
        slideRight:{
            from:{transform:'translate(150%, 0%)', opacity:0},
            enter:{transform:'translate(0%, 0%)', opacity:1},
            leave:{transform:'translate(-150%, 0%)', opacity:0},
            trail:100
        },
        scale:{
            from:{transform:'scale(0)', opacity:0},
            enter:{transform:'scale(1)', opacity:1},
            leave:{transform:'scale(0)', opacity:0},
            trail:100
        }
    }

    const nextSlide = () => {
        let date = new Date()
        let currentTime = date.getTime()
        if(currentTime - changedSlideTime >= 1000){
            if(currentSlide < data.slidesData.frontmatter.slides.length){
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
                setCurrentSlide(data.slidesData.frontmatter.slides.length)
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
                <VerticalSliderSlide 
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
                                <img src={logo} className={styles.logo} alt=''/>
                                <h2>
                                    {data.slidesData.frontmatter.slides[0].slideText}
                                </h2>
                                </AnimatedContainer>
                            </div>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
                    active={currentSlide == 2}
                    transition={
                        transitions.slideDown
                    }
                >
                    <div className={styles.slideBackground}>
                        {data.slidesData.frontmatter.slides[1].coverImage &&
                            <div className={styles.backgroundImage}>
                                <Image fluid={data.slidesData.frontmatter.slides[1].coverImage.childImageSharp.fluid} alt=''/>
                            </div>
                        }
                        <h2 className={styles.centeredText}>
                            {data.slidesData.frontmatter.slides[1].slideText}
                        </h2>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide 
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
                            <h2>
                                {data.slidesData.frontmatter.slides[2].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide>
                <VerticalSliderSlide
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
                    <div className={styles.slideBackground} style={{background:'#fff', color:'black'}}>
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
                {/* <VerticalSliderSlide
                    transition={transitions.slideDown}
                    active={currentSlide == 24}
                >
                    <div className={styles.slideBackground} style={{background:'#000', color:'white'}}>
                        <AnimatedContainer 
                            transition={transitions.scale} 
                            active={currentSlide == 24}
                            className={styles.lStack} 
                        >
                            <h2>
                                {data.slidesData.frontmatter.slides[23].slideText}
                            </h2>
                        </AnimatedContainer>
                    </div>
                </VerticalSliderSlide> */}
            </div>
        </Layout>
    )
}

export default WorkWithUsPage
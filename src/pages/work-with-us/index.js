import React, { useState, useEffect } from 'react'
import { useTransition, useSpring, animated } from 'react-spring'
import { useStaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'
import {Helmet} from 'react-helmet'
import remark from 'remark'
import remarkHTML from 'remark-html'
import Typist from 'react-typist'
import { HTMLContent } from '../../components/Content'

import Layout from '../../components/Layout'
import styles from './work-with-us.module.scss'
import downArrow from '../../img/down-arrow.svg'

const toHTML = (value) => remark().use(remarkHTML).processSync(value).toString()

const WorkWithUsPage = () => {
  const data = useStaticQuery(graphql`
    query WorkWithUsData {
      page: markdownRemark(
        frontmatter: { templateKey: { eq: "work-with-us-page" } }
      ) {
        frontmatter {
          heroVideoCover {
            publicURL
          }
          heroHeading
          heroText
          heroQuote
          aboutImageCover {
            childImageSharp {
              fluid(maxWidth: 1920, quality: 64) {
                ...GatsbyImageSharpFluid
              }
            }
          }
          aboutText
          sections {
            coverImage {
              childImageSharp {
                fluid(maxWidth: 1920, quality: 64) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
            sectionHeading
            sectionText
          }
        }
      }
      logos: allMarkdownRemark(
        filter: { frontmatter: { templateKey: { eq: "logos" } } }
      ) {
        edges {
          node {
            frontmatter {
              title
              logoImage {
                childImageSharp {
                  fluid(maxWidth: 200, quality: 64) {
                    ...GatsbyImageSharpFluid
                  }
                }
              }
              coverImage {
                childImageSharp {
                  fluid(maxWidth: 1000, quality: 64) {
                    ...GatsbyImageSharpFluid
                  }
                }
              }
              description
            }
          }
        }
      }
      networksLogo: markdownRemark(
        frontmatter: { templateKey: { eq: "logos" }, title: { eq: "Networks" } }
      ) {
        frontmatter {
          logoImage {
            childImageSharp {
              fluid(maxWidth: 300, quality: 64) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  `)

  const [currentSlide, setCurrentSlide] = useState(1)
  const [changedSlideTime, setChangedSlideTime] = useState(0)
  const [touchMoves, setTouchMoves] = useState([])

  const transitions = {
    appear: {
      from: { opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0 },
      trail: 100,
    },
    slideDown: {
      from: { transform: 'translate(0%, 120%)', opacity: 0 },
      enter: { transform: 'translate(0%, 0%)', opacity: 1 },
      leave: { transform: 'translate(0%, -120%)', opacity: 0 },
      trail: 100,
    },
    slideUp: {
      from: { transform: 'translate(0%, -150%)', opacity: 0 },
      enter: { transform: 'translate(0%, 0%)', opacity: 1 },
      leave: { transform: 'translate(0%, 150%)', opacity: 0 },
      trail: 100,
    },
    slideLeft: {
      from: { transform: 'translate(-150%, 0%)', opacity: 0 },
      enter: { transform: 'translate(0%, 0%)', opacity: 1 },
      leave: { transform: 'translate(150%, 0%)', opacity: 0 },
      trail: 100,
    },
    slideRight: {
      from: { transform: 'translate(150%, 0%)', opacity: 0 },
      enter: { transform: 'translate(0%, 0%)', opacity: 1 },
      leave: { transform: 'translate(-150%, 0%)', opacity: 0 },
      trail: 100,
    },
    scale: {
      from: { transform: 'scale(0)', opacity: 0 },
      enter: { transform: 'scale(1)', opacity: 1 },
      leave: { transform: 'scale(0)', opacity: 0 },
      trail: 100,
    },
  }

  const nextSlide = () => {
    let date = new Date()
    let currentTime = date.getTime()
    if (currentTime - changedSlideTime >= 1000) {
      if (currentSlide < data.slidesData.frontmatter.slides.length) {
        setCurrentSlide((prevState) => prevState + 1)
      } else {
        setCurrentSlide(1)
      }
      setChangedSlideTime(currentTime)
    } else {
      return
    }
  }

  const prevSlide = () => {
    let date = new Date()
    let currentTime = date.getTime()
    if (currentTime - changedSlideTime >= 1000) {
      if (currentSlide > 1) {
        setCurrentSlide((prevState) => prevState - 1)
      } else {
        setCurrentSlide(data.slidesData.frontmatter.slides.length)
      }
      setChangedSlideTime(currentTime)
    } else {
      return
    }
  }

  useEffect(() => {
    if (touchMoves[0] && touchMoves[1]) {
      if (touchMoves[0][0].screenY >= touchMoves[1][0].screenY) {
        nextSlide()
      } else {
        prevSlide()
      }
    }
  }, [touchMoves])

  return (
    <Layout fullWidth={true}>
      <Helmet>
        <base target="_blank" href="/" />
        <title>Work With Us | RUN BGD</title>
        <meta
          name="description"
          content={`RUN BGD work with us page.`}
        />
      </Helmet>
      <section class={styles.videoSection}>
        <div className={styles.background}>
          {data.page &&
            data.page.frontmatter.heroVideoCover &&
            data.page.frontmatter.heroVideoCover.publicURL && (
              <video
                className={styles.fullWidthImage}
                autoPlay
                muted
                loop={true}
              >
                <source
                  src={data.page.frontmatter.heroVideoCover.publicURL}
                  type="video/mp4"
                />
              </video>
            )}
          <div className={styles.overlay}></div>
        </div>
        <div className={styles.lSpacedContent}>
          {data.networksLogo &&
            data.networksLogo.frontmatter.logoImage &&
            data.networksLogo.frontmatter.logoImage.childImageSharp &&
            data.networksLogo.frontmatter.logoImage.childImageSharp.fluid && (
              <Image
                fluid={
                  data.networksLogo.frontmatter.logoImage.childImageSharp.fluid
                }
                alt=""
                className={styles.mainLogo}
              />
            )}
          <HTMLContent
            className={styles.heroHeading}
            content={toHTML(data.page.frontmatter.heroHeading)}
          />
          <div className={styles.heroText}>
            <p>{data.page.frontmatter.heroText}</p>
            <q className={styles.heroQuote}>
              {data.page.frontmatter.heroQuote}
            </q>
          </div>
          <a href="#about" className={styles.scrollActionArrow}>
            <img src={downArrow} alt="" />
          </a>
          <div className={styles.allLogos}>
            {data.logos &&
              data.logos.edges &&
              data.logos.edges.length > 0 &&
              data.logos.edges.map(({ node: logo }) => {
                if (logo.frontmatter.title !== 'Networks') {
                  return (
                    logo.frontmatter.logoImage &&
                    logo.frontmatter.logoImage.childImageSharp &&
                    logo.frontmatter.logoImage.childImageSharp.fluid && (
                      <Image
                        fluid={logo.frontmatter.logoImage.childImageSharp.fluid}
                        alt={logo.frontmatter.title}
                      />
                    )
                  )
                }
              })}
          </div>
        </div>
      </section>
      <section className={styles.aboutSection} id="about">
        <div className={styles.background}>
          {data.page &&
            data.page.frontmatter.aboutImageCover &&
            data.page.frontmatter.aboutImageCover.childImageSharp &&
            data.page.frontmatter.aboutImageCover.childImageSharp.fluid && (
              <Image
                className={styles.fullWidthImage}
                fluid={
                  data.page.frontmatter.aboutImageCover.childImageSharp.fluid
                }
              />
            )}
          <div className={styles.overlay}></div>
        </div>
        <div className={styles.aboutText}>
          <HTMLContent content={toHTML(data.page.frontmatter.aboutText)} />
        </div>
        <div className={styles.allLogos}>
          {data.logos &&
            data.logos.edges.length > 0 &&
            data.logos.edges.map(({ node: logo }) => {
              if (logo.frontmatter.title !== 'Networks') {
                return (
                  logo.frontmatter.logoImage &&
                  logo.frontmatter.logoImage.childImageSharp &&
                  logo.frontmatter.logoImage.childImageSharp.fluid && (
                    <Image
                      fluid={logo.frontmatter.logoImage.childImageSharp.fluid}
                      alt={logo.frontmatter.title}
                    />
                  )
                )
              }
            })}
        </div>
      </section>
      <section className={styles.ourBrandsSection}>
        <h2>Our Brands</h2>
        <div className={styles.brandsContainer}>
          {data.logos &&
            data.logos.edges.length > 0 &&
            data.logos.edges.map(({ node: logo }) => {
              if (logo.frontmatter.title !== 'Networks') {
                return (
                  <div className={styles.brand}>
                    <div className={styles.background}>
                      {logo.frontmatter.coverImage &&
                        logo.frontmatter.coverImage.childImageSharp &&
                        logo.frontmatter.coverImage.childImageSharp.fluid && (
                          <Image
                            className={styles.fullHeightImage}
                            fluid={
                              logo.frontmatter.coverImage.childImageSharp.fluid
                            }
                          />
                        )}
                      <div className={styles.overlay}></div>
                    </div>
                    <div className={styles.brandLogo}>
                      {logo.frontmatter.logoImage &&
                        logo.frontmatter.logoImage.childImageSharp &&
                        logo.frontmatter.logoImage.childImageSharp.fluid && (
                          <Image
                            fluid={
                              logo.frontmatter.logoImage.childImageSharp.fluid
                            }
                            alt={logo.frontmatter.title}
                          />
                        )}
                    </div>
                    <div className={styles.brandText}>
                      <h3 className={styles.brandTitle}>
                        {logo.frontmatter.title}
                      </h3>
                      <p className={styles.brandDescription}>
                        {logo.frontmatter.description}
                      </p>
                    </div>
                  </div>
                )
              }
            })}
        </div>
      </section>
      {data.page &&
        data.page.frontmatter.sections &&
        data.page.frontmatter.sections.length > 0 &&
        data.page.frontmatter.sections.map((section, index) => {
          return (
            <section key={index} className={styles.longTextSection}>
              <div className={styles.background}>
                {section.coverImage &&
                  section.coverImage.childImageSharp &&
                  section.coverImage.childImageSharp.fluid && (
                    <Image
                      className={styles.fullWidthImage}
                      fluid={section.coverImage.childImageSharp.fluid}
                    />
                  )}
                <div className={styles.overlay}></div>
              </div>
              <div className={styles.longText}>
                <h2>{section.sectionHeading}</h2>
                <HTMLContent content={toHTML(section.sectionText)} />
              </div>
            </section>
          )
        })}
    </Layout>
  )
}

export default WorkWithUsPage

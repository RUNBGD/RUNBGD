import React from 'react'
import Image from 'gatsby-image'
import { useStaticQuery, graphql } from 'gatsby'
import {Helmet} from 'react-helmet'
import remark from 'remark'
import remarkHTML from 'remark-html'
import { useSpring, animated, config } from 'react-spring'
import { Link } from 'gatsby'
import SwiperCore, { EffectCoverflow } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/components/effect-coverflow/effect-coverflow.scss'
import 'swiper/swiper.scss'

import AgencyIllustration from '../../components/AgencyIllustration'
import Layout from '../../components/Layout'
import styles from './agency.module.scss'
import { HTMLContent } from '../../components/Content'
import SectionImage from '../../components/SectionImage'
SwiperCore.use([EffectCoverflow])

const toHTML = (value) => remark().use(remarkHTML).processSync(value).toString()

const AgencyPage = () => {
  const { scale } = useSpring({
    from: {
      scale: 1,
    },
    to: {
      scale: 1.2,
    },
    delay: 1000,
    config: {
      tension: 200,
      friction: 20,
      mass: 3,
    },
  })

  const data = useStaticQuery(graphql`
    query AgencyPage {
      page: markdownRemark(
        frontmatter: { templateKey: { eq: "agency-page" } }
      ) {
        frontmatter {
          seo
          seoTitle
          heroBannerImage {
            childImageSharp {
              fluid(maxWidth: 1800, quality: 64) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
          heroBannerHeading
          heroBannerAnimation{
            publicURL
          }
          references {
            image {
              childImageSharp {
                fluid(maxWidth: 250, quality: 64) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
            title
            quote
            client
            projectURL
          }
          sections {
            image {
              childImageSharp {
                fluid(maxWidth: 1800, quality: 64) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
            type
            backgroundColor
            imageOnRight
            heading
            body
          }
        }
      }
    }
  `)

  return (
    <Layout
      fullWidthContent={
        <div style={{ overflowX: 'hidden' }}>
          <Helmet>
            <base target="_blank" href="/" />
            {
              data.page.frontmatter.seoTitle ?
              <title>{data.page.frontmatter.seoTitle}</title>
              :
              <title>Agency | RUN BGD</title>
            }
            {
              data.page.frontmatter.seo ?
              <meta
                name="description"
                content={data.page.frontmatter.seo}
              />
              :
              <meta
                name="description"
                content={`RUN BGD agency page.`}
              />
            }
          </Helmet>
          <div className={styles.heroBanner}>
            {
              data.page.frontmatter.heroBannerAnimation && data.page.frontmatter.heroBannerAnimation.publicURL &&
              <img src={data.page.frontmatter.heroBannerAnimation.publicURL} className={styles.agencyAnimation} alt=''/>
            }
            {/* <AgencyIllustration />
            <animated.h1
              style={{
                transform: scale.interpolate((scale) => `scale(${scale})`),
              }}
            >
              {data.page.frontmatter.heroBannerHeading}
            </animated.h1> */}
            <div className={styles.backgroundImageFixed}>
              {data.page &&
                data.page.frontmatter &&
                data.page.frontmatter.heroBannerImage &&
                data.page.frontmatter.heroBannerImage.childImageSharp &&
                data.page.frontmatter.heroBannerImage.childImageSharp.fluid && (
                  <Image
                    fluid={
                      data.page.frontmatter.heroBannerImage.childImageSharp
                        .fluid
                    }
                    alt=""
                  />
                )}
            </div>
          </div>
          {data.page &&
            data.page.frontmatter.sections &&
            data.page.frontmatter.sections.length > 0 &&
            data.page.frontmatter.sections.map((section) => {
              if (section.type == 'heading') {
                return (
                  <div className={styles.headingContainer}>
                    <h2>{section.heading}</h2>
                    <div className={styles.backgroundImage}>
                      {section.image &&
                        section.image.childImageSharp &&
                        section.image.childImageSharp.fluid && (
                          <Image
                            fluid={section.image.childImageSharp.fluid}
                            alt=""
                          />
                        )}
                    </div>
                  </div>
                )
              } else if (section.type == 'section') {
                return (
                  <section
                    className={`${styles.contentSection} ${
                      section.imageOnRight && styles.reverseSection
                    }`}
                    style={{ backgroundColor: `#${section.backgroundColor}` }}
                  >
                    {
                      <SectionImage
                        image={section.image && section.image}
                        imageOnRight={section.imageOnRight}
                      />
                    }
                    <div className={styles.sectionContent}>
                      <h3>{section.heading}</h3>
                      <div className={styles.body}>
                        <HTMLContent content={toHTML(section.body)} />
                      </div>
                    </div>
                  </section>
                )
              }
            })}
        {
          data.page &&
          data.page.frontmatter.references &&
          data.page.frontmatter.references.length > 0 &&
          <section className={styles.referenceSection}>
              <>
                <h2>References</h2>
                <Swiper
                  slidesPerView="1"
                  initialSlide={0}
                  centeredSlides
                  effect="coverflow"
                  coverflowEffect={{
                    slideShadows: false,
                    depth: 150,
                  }}
                  breakpoints={{
                    1200: {
                      slidesPerView: '3',
                      initialSlide: 1,
                    },
                  }}
                >
                  {

                    data.page.frontmatter.references.map((reference, key) => {
                      return (
                        <SwiperSlide>
                          <article className={styles.reference}>
                            <div className={styles.referencePersonImage}>
                              {reference.image &&
                                reference.image.childImageSharp &&
                                reference.image.childImageSharp.fluid && (
                                  <Image
                                    fluid={reference.image.childImageSharp.fluid}
                                    alt=""
                                  />
                                )}
                            </div>
                            <h3>{reference.title}</h3>
                            <blockquote>{reference.quote}</blockquote>
                            <p>{reference.client}</p>
                            <button>
                              <a href={reference.projectURL} target="_blank">
                                See This Project
                              </a>
                            </button>
                          </article>
                        </SwiperSlide>
                        )
                  }
                      )
                    })
                </Swiper>
              </>
          </section>
          }
          <div className={styles.contactButton}>
            <Link to={'/contact-us'}>Contact Us</Link>
          </div>
        </div>
      }
    ></Layout>
  )
}

export default AgencyPage

import React from 'react'
import Image from 'gatsby-image'
import { useStaticQuery, graphql } from 'gatsby'
import remark from 'remark'
import remarkHTML from 'remark-html'
import { useSpring, animated, config } from 'react-spring'
import { Link } from 'gatsby'
import AgencyIllustration from '../../components/AgencyIllustration'

import Layout from '../../components/Layout'
import styles from './agency.module.scss'
import { HTMLContent } from '../../components/Content'
import SectionImage from '../../components/SectionImage'

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
          heroBannerImage {
            childImageSharp {
              fluid(maxWidth: 1800, quality: 64) {
                ...GatsbyImageSharpFluid
              }
            }
          }
          heroBannerHeading
          sections {
            image {
              childImageSharp {
                fluid(maxWidth: 1800, quality: 64) {
                  ...GatsbyImageSharpFluid
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
          <div className={styles.heroBanner}>
            <AgencyIllustration/>
            <animated.h1
              style={{
                transform: scale.interpolate((scale) => `scale(${scale})`),
              }}
            >
              {data.page.frontmatter.heroBannerHeading}
            </animated.h1>
            <div className={styles.backgroundImageFixed}>
              <Image
                fluid={
                  data.page.frontmatter.heroBannerImage.childImageSharp.fluid
                }
                alt=""
              />
            </div>
          </div>
          {data.page.frontmatter.sections.map((section) => {
            if (section.type == 'heading') {
              return (
                <div className={styles.headingContainer}>
                  <h2>{section.heading}</h2>
                  <div className={styles.backgroundImage}>
                    <Image fluid={section.image.childImageSharp.fluid} alt="" />
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
                  <SectionImage
                    image={section.image.childImageSharp.fluid}
                    imageOnRight={section.imageOnRight}
                  />
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
          <div className={styles.contactButton}>
            <Link to={'/contact-us'}>Contact Us</Link>
          </div>
        </div>
      }
    ></Layout>
  )
}

export default AgencyPage

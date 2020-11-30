import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'
import { SwiperSlide } from 'swiper/react'
import remark from 'remark'
import remarkHTML from 'remark-html'

import Layout from '../../components/Layout'
import FullWidthSlider from '../../components/FullWidthSlider'
import styles from './careers.module.scss'
import { HTMLContent } from '../../components/Content'
import PostCategoryTag from '../../components/PostCategoryTag'

const toHTML = (value) => remark().use(remarkHTML).processSync(value).toString()

const Careers = () => {
  const data = useStaticQuery(graphql`
    query CareersPage {
      page: markdownRemark(
        frontmatter: { templateKey: { eq: "careers-page" } }
      ) {
        frontmatter {
          heroImage {
            childImageSharp {
              fluid(maxWidth: 1920, quality: 64) {
                ...GatsbyImageSharpFluid
              }
            }
          }
          slides {
            image {
              childImageSharp {
                fluid(maxWidth: 1550, quality: 64) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
          benefits {
            image {
              childImageSharp {
                fluid(maxWidth: 150, quality: 64) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
            text
          }
          positions {
            title
            type
            place
            link
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
            }
          }
        }
      }
    }
  `)

  return (
    <Layout fullWidth={true}>
      <main className={styles.fullWidth}>
        <div className={styles.hero}>
          {data.page &&
            data.page.frontmatter.heroImage &&
            data.page.frontmatter.heroImage.childImageSharp &&
            data.page.frontmatter.heroImage.childImageSharp.fluid && (
              <Image
                className={styles.heroImage}
                fluid={data.page.frontmatter.heroImage.childImageSharp.fluid}
                alt=""
              />
            )}
        </div>
        <div className={styles.kickerText}>
          <h2>CULTURE. PERSONIFIED.</h2>
          <p>Working at RUNBGD Networks isn't just a job.</p>
          <p>
            <em>It's a way of life.</em>
          </p>
          <p>Come be a part of something bigger.</p>
        </div>
        <div className={styles.logos}>
          <div className={styles.mainLogo}>
            {data.logos &&
              data.logos.edges &&
              data.logos.edges.length > 0 &&
              data.logos.edges.map(({ node: logo }) => {
                if (logo.frontmatter.title === 'Networks') {
                  return (
                    logo.frontmatter.logoImage &&
                    logo.frontmatter.logoImage.childImageSharp &&
                    logo.frontmatter.logoImage.childImageSharp.fluid && (
                      <Image
                        fluid={logo.frontmatter.logoImage.childImageSharp.fluid}
                        alt=""
                      />
                    )
                  )
                }
              })}
          </div>
          <div className={styles.otherLogos}>
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
                        style={{
                          width: `${
                            100 /
                              (data.logos &&
                                data.logos.edges &&
                                data.logos.edges.length) -
                            2
                          }%`,
                        }}
                        className={styles.otherLogosItem}
                        fluid={logo.frontmatter.logoImage.childImageSharp.fluid}
                        alt=""
                      />
                    )
                  )
                }
              })}
          </div>
          <hr />
        </div>
        <div className={styles.kickerText}>
          <h2>Where the Next Begins</h2>
          <p>
            RUNBGD Networks champions the people, brands and new trends you need
            to know now and will obsess over next
          </p>
        </div>
        <div className={styles.sliderContainer}>
          <FullWidthSlider>
            {data.page &&
              data.page.frontmatter.slides &&
              data.page.frontmatter.slides.length > 0 &&
              data.page.frontmatter.slides.map((slide) => {
                return (
                  <SwiperSlide className={styles.sliderSlide}>
                    {slide.image &&
                      slide.image.childImageSharp &&
                      slide.image.childImageSharp.fluid && (
                        <Image
                          fluid={slide.image.childImageSharp.fluid}
                          alt=""
                        />
                      )}
                  </SwiperSlide>
                )
              })}
          </FullWidthSlider>
        </div>
        <div className={styles.benefitsSection}>
          <h2>BENEFITS & PERKS</h2>
          <div className={styles.lRow}>
            {data.page &&
              data.page.frontmatter.benefits &&
              data.page.frontmatter.benefits.map((benefit) => {
                return (
                  <div className={styles.benefit}>
                    {benefit.image &&
                      benefit.image.childImageSharp &&
                      benefit.image.childImageSharp.fluid && (
                        <Image
                          className={styles.benefitImage}
                          fluid={benefit.image.childImageSharp.fluid}
                          alt=""
                        />
                      )}
                    <HTMLContent content={toHTML(benefit.text)} />
                  </div>
                )
              })}
          </div>
          <hr />
        </div>
        <div className={styles.openingsSection}>
          <h2>RECENT OPENINGS</h2>
          <div>
            {data.page &&
              data.page.frontmatter.positions &&
              data.page.frontmatter.positions.length > 0 &&
              data.page.frontmatter.positions.map((position) => {
                return (
                  <div className={`${styles.position} ${styles.lRow}`}>
                    <div>
                      <p className={styles.positionTitle}>{position.title}</p>
                      <p className={styles.positionType}>{position.type}</p>
                      <p className={styles.positionPlace}>{position.place}</p>
                    </div>
                    <div>
                      <PostCategoryTag slug={position.link} text={'Apply'} />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Careers

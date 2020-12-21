import React, { useState, useEffect } from 'react'
import { graphql, Link } from 'gatsby'
import { Helmet } from 'react-helmet'
import remark from 'remark'
import remarkHTML from 'remark-html'
import Image from 'gatsby-image'

import Layout from '../../components/Layout'
import LatestPosts from '../../components/LatestPosts'
import BigPostsCarousel from '../../components/BigPostsCarousel'
import FindPlacesMainCard from '../../components/FindPlacesMainCard'
import FindPlacesLocations from '../../components/FindPlacesLocations'
import FindPlacesMap from '../../components/FindPlacesMap'
import { HTMLContent } from '../../components/Content'
import SecondaryPostsCarousel from '../../components/SecondaryPostsCarousel'
import styles from './subcategory-page.module.scss'

const toHTML = (value) => remark().use(remarkHTML).processSync(value).toString()

let SubcategoryPage = ({ data }) => {
  const [currentX, setCurrentX] = useState(
    data.locations &&
      data.locations.edges.length > 0 &&
      data.locations.edges[0].node.frontmatter.longitude
      ? data.locations.edges[0].node.frontmatter.longitude
      : 0
  )
  const [currentY, setCurrentY] = useState(
    data.locations &&
      data.locations.edges.length > 0 &&
      data.locations.edges[0].node.frontmatter.latitude
      ? data.locations.edges[0].node.frontmatter.latitude
      : 0
  )

  const [zoomLevel, setZoomLevel] = useState(undefined)
  const [zoomInterval, setZoomInterval] = useState(undefined)

  const [clickedLocation, setClickedLocation] = useState(undefined)

  useEffect(() => {
    if (!clickedLocation) {
      if (zoomInterval) {
        clearInterval(zoomInterval)
      }
      setZoomLevel(undefined)
      setZoomInterval(undefined)
    }
  }, [clickedLocation])

  function onLocationClicked(location) {
    setZoomLevel(12)
    clearInterval(zoomInterval)

    setTimeout(() => {
      setZoomLevel((prevState) => prevState + 1)
      setZoomInterval(
        setInterval(() => {
          setZoomLevel((prevState) => prevState + 1)
        }, 750)
      )
    }, 750)

    setClickedLocation(location.frontmatter)
  }

  useEffect(() => {
    if (zoomInterval && zoomLevel > 18) {
      clearInterval(zoomInterval)
    }
  }, [zoomLevel])

  function handleUserMapInteraction() {
    if (zoomInterval) {
      clearInterval(zoomInterval)
    }
  }

  return (
    <Layout
      fullWidthContent={
        <React.Fragment>
          <div className={styles.categoryCoverContainer}>
            <h1 className={styles.categoryCoverHeading}>
              {data.markdownRemark.frontmatter.title}
            </h1>
            <hr />
            <div className={styles.categoryCover}>
              {data.markdownRemark.frontmatter.coverImage &&
                data.markdownRemark.frontmatter.coverImage.childImageSharp &&
                data.markdownRemark.frontmatter.coverImage.childImageSharp
                  .fluid && (
                  <Image
                    fluid={
                      data.markdownRemark.frontmatter.coverImage.childImageSharp
                        .fluid
                    }
                    alt=""
                  />
                )}
            </div>
          </div>
        </React.Fragment>
      }
    >
      <Helmet>
        <base target="_blank" href="/" />
        {
          data.markdownRemark.frontmatter.seoTitle ?
          <title>{data.markdownRemark.frontmatter.seoTitle}</title>
          :
          <title>{data.markdownRemark.frontmatter.title} | RUN BGD</title>
        }
        {
          data.markdownRemark.frontmatter.seo ?
          <meta
            name="description"
            content={data.markdownRemark.frontmatter.seo}
          />
          :
          <meta
            name="description"
            content={`Find more interesting stories in subcategory ${data.markdownRemark.frontmatter.title} at RUN BGD`}
          />
        }
      </Helmet>
      <main>
        <HTMLContent
          content={toHTML(data.markdownRemark.frontmatter.description)}
        />
        <hr />
        <BigPostsCarousel posts={data.subcategoryFeaturedPosts} />
        {data.locations && data.locations.edges.length > 0 && (
          <React.Fragment>
            <h2>Find Places</h2>
            <div className={styles.mapAndLocations}>
              <div className={styles.map}>
                <FindPlacesMap
                  locations={
                    data.locations &&
                    data.locations.edges.length > 0 &&
                    data.locations.edges
                  }
                  zoom={zoomLevel ? zoomLevel : 12}
                  currentY={currentY}
                  currentX={currentX}
                  setCurrentX={setCurrentX}
                  setCurrentY={setCurrentY}
                  handleUserInteraction={handleUserMapInteraction}
                  onClick={onLocationClicked}
                  clickedLocation={clickedLocation}
                  setClickedLocation={setClickedLocation}
                />
              </div>
              <div className={styles.locations}>
                <FindPlacesLocations
                  locations={
                    data.locations &&
                    data.locations.edges.length > 0 &&
                    data.locations.edges
                  }
                  filterCategory={'Select Category'}
                  horizontalOnMobile={true}
                  setCurrentX={setCurrentX}
                  setCurrentY={setCurrentY}
                  onClick={onLocationClicked}
                  clickedLocation={clickedLocation}
                  setClickedLocation={setClickedLocation}
                />
              </div>
            </div>
            <hr />
          </React.Fragment>
        )}
        <h2>Latest In {data.markdownRemark.frontmatter.title}</h2>
        <LatestPosts posts={data.subcategoryLatestPosts} />
      </main>
    </Layout>
  )
}

export const pageQuery = graphql`
  query SubcategoryByID($id: String!, $title: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      frontmatter {
        seo
        seoTitle
        title
        description
        coverImage {
          childImageSharp {
            fluid(maxWidth: 1920, quality: 64) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
      }
    }
    subCategoryItems: allMarkdownRemark(
      filter: {
        frontmatter: {
          templateKey: { eq: "blog-post" }
          subcategory: { eq: $title }
        }
      }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            subcategory
            coverImage {
              childImageSharp {
                fluid(maxWidth: 1000) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
          }
        }
      }
    }
    subcategoryFeaturedPosts: allMarkdownRemark(
      filter: {
        frontmatter: {
          templateKey: { eq: "blog-post" }
          subcategory: { eq: $title }
          subcategoryFeatured: { eq: true }
        }
      }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            coverImage {
              childImageSharp {
                fluid(maxWidth: 1000, quality: 64) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
          }
        }
      }
    }
    subcategoryLatestPosts: allMarkdownRemark(
      filter: {
        frontmatter: {
          templateKey: { eq: "blog-post" }
          subcategory: { eq: $title }
        }
      }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            subcategory
            author
            coverImage {
              childImageSharp {
                fluid(maxWidth: 1000, quality: 64) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
          }
        }
      }
    }
    locations: allMarkdownRemark(
      filter: {
        frontmatter: {
          templateKey: { eq: "location" }
          subcategory: { eq: $title }
        }
      }
    ) {
      edges {
        node {
          frontmatter {
            name
            coverImage {
              childImageSharp {
                fluid(maxWidth: 1000) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
            pin {
              publicURL
            }
            category
            subcategory
            address
            email
            website
            description
            latitude
            longitude
          }
        }
      }
    }
    subCategories: allMarkdownRemark(
      filter: {
        frontmatter: {
          templateKey: { eq: "category-subcategory" }
          category: { eq: $title }
        }
      }
    ) {
      edges {
        node {
          frontmatter {
            title
            description
            coverImage {
              childImageSharp {
                fluid(maxWidth: 1000) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
          }
        }
      }
    }
  }
`
export default SubcategoryPage

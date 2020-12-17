import React, { useState, useEffect } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import {Helmet} from 'react-helmet'

import Layout from '../components/Layout'

import BigPostsCarousel from '../components/BigPostsCarousel'
import SecondaryPostsCarousel from '../components/SecondaryPostsCarousel'
import NewsletterForm from '../components/NewsletterForm'
import FindPlacesMainCard from '../components/FindPlacesMainCard'
import LatestPosts from '../components/LatestPosts'
import AsideContent from '../components/AsideContent'
import FindPlacesMap from '../components/FindPlacesMap'
import FindPlacesLocations from '../components/FindPlacesLocations'
import PostCategoryTag from '../components/PostCategoryTag'
import styles from './index-page.module.scss'

const IndexPage = () => {
  let carouselPosts = useStaticQuery(graphql`
    query MyQuery {
      allMarkdownRemark(
        filter: { frontmatter: { featuredPost: { eq: true } } }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              author
              category
              coverImage {
                publicURL
                childImageSharp {
                  fluid(maxWidth: 1280, quality: 64) {
                    ...GatsbyImageSharpFluid
                  }
                }
              }
            }
          }
        }
      }
      categoryFeaturedPosts: allMarkdownRemark(
        filter: { frontmatter: { categoryFeatured: { eq: true } } }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              category
              author
              coverImage {
                childImageSharp {
                  fluid(maxWidth: 1280, quality: 64) {
                    ...GatsbyImageSharpFluid
                  }
                }
              }
            }
          }
        }
      }

      categories: allMarkdownRemark(
        filter: { frontmatter: { templateKey: { eq: "category-page" } } }
        sort: { fields: [frontmatter___order] }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              order
            }
          }
        }
      }
      locationCategories: allMarkdownRemark(
        filter: { frontmatter: { templateKey: { eq: "location-category" } } }
      ) {
        edges {
          node {
            frontmatter {
              title
              categoryPin {
                publicURL
              }
            }
          }
        }
      }
      trending: allMarkdownRemark(
        filter: { frontmatter: { trending: { eq: true } } }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              author
              category
              coverImage {
                childImageSharp {
                  fluid(maxWidth: 1000, quality: 64) {
                    ...GatsbyImageSharpFluid
                  }
                }
              }
            }
          }
        }
      }
      latestPosts: allMarkdownRemark(
        filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              category
              author
              coverImage {
                childImageSharp {
                  fluid(maxWidth: 1000, quality: 64) {
                    ...GatsbyImageSharpFluid
                  }
                }
              }
            }
          }
        }
      }
      locations: allMarkdownRemark(
        filter: { frontmatter: { templateKey: { eq: "location" } } }
      ) {
        edges {
          node {
            frontmatter {
              name
              coverImage {
                publicURL
                childImageSharp {
                  fluid(maxWidth: 1000) {
                    ...GatsbyImageSharpFluid
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
    }
  `)

  console.log(carouselPosts.locations.edges)

  const [currentX, setCurrentX] = useState(
    carouselPosts &&
      carouselPosts.locations &&
      carouselPosts.locations.edges.length > 0 &&
      carouselPosts.locations.edges[0] &&
      carouselPosts.locations.edges[0].node.frontmatter.longitude
      ? carouselPosts.locations.edges[0].node.frontmatter.longitude
      : 0
  )
  const [currentY, setCurrentY] = useState(
    carouselPosts &&
      carouselPosts.locations &&
      carouselPosts.locations.edges.length > 0 &&
      carouselPosts.locations.edges[0] &&
      carouselPosts.locations.edges[0].node.frontmatter.latitude
      ? carouselPosts.locations.edges[0].node.frontmatter.latitude
      : 0
  )

  const [zoomLevel, setZoomLevel] = useState(undefined)
  const [zoomInterval, setZoomInterval] = useState(undefined)

  const [clickedLocation, setClickedLocation] = useState(undefined)
  const [filterCategory, setFilterCategory] = useState('Select Category')

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

  let featuredCategories = []

  carouselPosts &&
    carouselPosts.categoryFeaturedPosts &&
    carouselPosts.categoryFeaturedPosts.edges.length > 0 &&
    carouselPosts.categoryFeaturedPosts.edges.forEach(({ node }) => {
      let categoryName = node.frontmatter.category
      if (featuredCategories.indexOf(categoryName) == -1) {
        featuredCategories.push(categoryName)
      }
    })

  let featuredCategoriesInOrder = (featuredCategories) => {
    let filteredCategories =
      carouselPosts &&
      carouselPosts.categories &&
      carouselPosts.categories.edges.length > 0 &&
      carouselPosts.categories.edges.filter(({ node: category }) => {
        if (featuredCategories.indexOf(category.frontmatter.title) !== -1) {
          return true
        }
      })

    return filteredCategories
  }

  return (
    <Layout>
      <Helmet>
        <base target="_blank" href="/" />
      </Helmet>
      <main>
        <h1>RUN BGD</h1>
        <p>
          RUN BGD is a team of young and ambitious people gathered around the
          idea to present Belgrade as destination in a little different light,
          unlike agencies and other organisations.
        </p>
        <hr />
        <BigPostsCarousel
          posts={carouselPosts && carouselPosts.allMarkdownRemark}
        />
        <SecondaryPostsCarousel
          posts={
            carouselPosts &&
            carouselPosts.trending &&
            carouselPosts.trending.edges &&
            carouselPosts.trending.edges
          }
          onlyMobile={true}
          heading="Trending"
          displayCategory={true}
        />
        <NewsletterForm />
        <hr />
        <h2>Find Places</h2>
        <div className={styles.mapAndLocations}>
          <div className={styles.map}>
            <FindPlacesMap
              locations={
                carouselPosts &&
                carouselPosts.locations &&
                carouselPosts.locations.edges.length > 0 &&
                carouselPosts.locations.edges
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
              filterCategory={filterCategory}
            />
          </div>
          <div className={styles.locations}>
            {!clickedLocation &&
              <select
                onChange={(e) => setFilterCategory(e.target.value)}
                className={styles.categoryFilter}
              >
                <option value="Select Category">Select Category</option>
                {carouselPosts.locationCategories &&
                  carouselPosts.locationCategories.edges.length > 0 &&
                  carouselPosts.locationCategories.edges.map(({ node: category }) => {
                    if (category.frontmatter.title == 'Current Location') {
                      return
                    }
                    return (
                      <option value={category.frontmatter.title}>
                        {category.frontmatter.title}
                      </option>
                    )
                  })}
              </select>
          
            }
            <FindPlacesLocations
              locations={
                carouselPosts &&
                carouselPosts.locations &&
                carouselPosts.locations.edges.length > 0 &&
                carouselPosts.locations.edges
              }
              filterCategory={filterCategory}
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
        <FindPlacesMainCard />
        <hr />
        {featuredCategoriesInOrder(featuredCategories).map(
          ({ node: category }) => {
            let posts =
              carouselPosts &&
              carouselPosts.categoryFeaturedPosts &&
              carouselPosts.categoryFeaturedPosts.edges.length > 0 &&
              carouselPosts.categoryFeaturedPosts.edges.filter(({ node }) => {
                if (node.frontmatter.category && category.frontmatter.title) {
                  return (
                    node.frontmatter.category === category.frontmatter.title
                  )
                } else {
                  return false
                }
              })

            return (
              <React.Fragment>
                <div className={styles.titleAndSeeMore}>
                  <h2>{category.frontmatter.title}</h2>
                  <PostCategoryTag
                    slug={category.fields.slug}
                    text={'See More'}
                  />
                </div>
                <SecondaryPostsCarousel posts={posts} />
              </React.Fragment>
            )
          }
        )}
        <h2>Latest Stories</h2>
        <div style={{ display: 'relative' }}>
          <LatestPosts posts={carouselPosts.latestPosts} />
        </div>
      </main>
      <aside>
        <div>
          <AsideContent
            posts={
              carouselPosts &&
              carouselPosts.trending &&
              carouselPosts.trending.edges.length > 0 &&
              carouselPosts.trending.edges
            }
            heading="Trending"
            displayCategory={true}
          />
        </div>
      </aside>
    </Layout>
  )
}

export default IndexPage

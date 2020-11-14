import React, { useState } from 'react'
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
import PostCategoryTag from '../../components/PostCategoryTag'
import SecondaryPostsCarousel from '../../components/SecondaryPostsCarousel'
import styles from './category-page.module.scss'

const toHTML = (value) => remark().use(remarkHTML).processSync(value).toString()

let CategoryPage = ({ data }) => {
  const [selectedPackage, setSelectedPackage] = useState(undefined)
  const [firstName, setFirstName] = useState(undefined)
  const [lastName, setLastName] = useState(undefined)
  const [email, setEmail] = useState(undefined)
  const [message, setMessage] = useState(undefined)
  const [errorMessage, setErrorMessage] = useState(undefined)
  const [successMessage, setSuccessMessage] = useState(undefined)
  const [fetching, setFetching] = useState(false)

  const [currentX, setCurrentX] = useState(
    data.locations.edges[0] &&
      data.locations.edges[0].node.frontmatter.longitude
  )
  const [currentY, setCurrentY] = useState(
    data.locations.edges[0] && data.locations.edges[0].node.frontmatter.latitude
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    if (
      !selectedPackage ||
      !firstName ||
      !(
        email &&
        email.match(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
      )
    ) {
      setErrorMessage('Required fields not filled!')
    } else {
      setErrorMessage(undefined)
      setFetching(true)
      fetch(
        `/.netlify/functions/contactForm?package=${data.packages.frontmatter.title}&selectedPackage=${selectedPackage}&firstName=${firstName}&lastName=${lastName}&email=${email}&message=${message}`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }
      )
      .then((response) => response.json())
        .then((data) => {
          setFetching(false)
          if (data.status == 'success') {
            return setSuccessMessage(data.message)
          } else if (data.status == 'error') {
            return setErrorMessage(data.message)
          }
        })
        .catch((error) => {
          console.log(error)
          setFetching(false)
          setErrorMessage(
            'There was some error while trying to send your email. Try later!'
          )
        })
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
              <Image
                fluid={
                  data.markdownRemark.frontmatter.coverImage.childImageSharp
                    .fluid
                }
                alt=""
              />
            </div>
          </div>
          {data.subCategories.edges[0] && (
            <div className={styles.subCategoriesNavigation}>
              {data.subCategories.edges.map(({ node: subcategory }) => {
                return (
                  <Link to={`#${subcategory.frontmatter.title}`}>
                    {subcategory.frontmatter.title}
                  </Link>
                )
              })}
            </div>
          )}
        </React.Fragment>
      }
    >
      <Helmet>
        <title>{data.markdownRemark.frontmatter.title} | RUN BGD</title>
        <meta
          name="description"
          content={`Find more interesting stories in category ${data.markdownRemark.frontmatter.title} at RUN BGD`}
        />
      </Helmet>
      <main>
        <HTMLContent
          content={toHTML(data.markdownRemark.frontmatter.description)}
        />
        <hr />
        <BigPostsCarousel posts={data.categoryFeaturedPosts} />
        {data.locations.edges[0] && (
          <React.Fragment>
            <h2>Find Places</h2>
            <div className={styles.mapAndLocations}>
              <div className={styles.map}>
                <FindPlacesMap
                  locations={data.locations.edges}
                  zoom={12}
                  currentX={currentX}
                  currentY={currentY}
                />
              </div>
              <div className={styles.locations}>
                <FindPlacesLocations
                  locations={data.locations.edges}
                  filterCategory={'Select Category'}
                  horizontalOnMobile={true}
                  setCurrentX={setCurrentX}
                  setCurrentY={setCurrentY}
                />
              </div>
            </div>
            <hr />
          </React.Fragment>
        )}
        {data.packages && (
          <div className={styles.packageSection}>
            <h2>{data.packages.frontmatter.title}</h2>
            <HTMLContent
              className={styles.packageDescription}
              content={toHTML(data.packages.frontmatter.description)}
            />
            <div className={styles.packageContainer}>
              {data.packages.frontmatter.packages.map((item) => {
                return (
                  <div className={styles.package}>
                    <div className={styles.background}>
                      <Image
                        className={styles.fullHeightImage}
                        fluid={item.background.childImageSharp.fluid}
                      />
                      <div className={styles.overlay}></div>
                    </div>
                    <p className={styles.packageTitle}>{item.title}</p>
                    <HTMLContent
                      className={styles.packageDescription}
                      content={toHTML(item.description)}
                    />
                  </div>
                )
              })}
            </div>
            <HTMLContent
              className={styles.packageBody}
              content={toHTML(data.packages.frontmatter.bottomText)}
            />
            {data.packages.frontmatter.form && (
              <React.Fragment>
                <h3>Contact Us About {data.packages.frontmatter.title}</h3>
                <form className={styles.packagesContactForm}>
                  <p className={styles.packageLabel}>Select Package*</p>
                  {data.packages.frontmatter.packages.map((item) => {
                    return (
                      <div
                        className={styles.packageInput}
                        onChange={(e) => setSelectedPackage(e.target.value)}
                      >
                        <label>{item.title}</label>
                        <input type="radio" name="package" value={item.title} />
                      </div>
                    )
                  })}
                  <div className={styles.fullNameInput}>
                    <div onChange={(e) => setFirstName(e.target.value)}>
                      <label>First Name*</label>
                      <input type="text" name="firstName" />
                    </div>
                    <div onChange={(e) => setLastName(e.target.value)}>
                      <label>Last Name</label>
                      <input type="text" name="lastName" />
                    </div>
                  </div>
                  <div
                    className={styles.emailInput}
                    onChange={(e) => setEmail(e.target.value)}
                  >
                    <label>Email*</label>
                    <input type="email" name="email" />
                  </div>
                  <div
                    className={styles.messageInput}
                    onChange={(e) => setMessage(e.target.value)}
                  >
                    <label>Message</label>
                    <textarea name="message"></textarea>
                  </div>
                  <div className={styles.actionButtonContainer}>
                    <button
                      className={styles.actionButton}
                      onClick={(e) => handleSubmit(e)}
                    >
                      Send
                    </button>
                  </div>
                  {successMessage && (
                    <p className={styles.successMessage}>{successMessage}</p>
                  )}
                  {errorMessage && (
                    <p className={styles.errorMessage}>{errorMessage}</p>
                  )}
                  {fetching && (
                    <div className={styles.loadingIndicatorContainer}>
                      <div className={styles.loadingIndicator}></div>
                    </div>
                  )}
                </form>
              </React.Fragment>
            )}
          </div>
        )}
        {data.subCategories.edges[0] &&
          data.subCategories.edges.map(({ node: category }) => {
            let filteredPosts = data.subCategoryItems.edges.filter(
              ({ node: item }) => {
                return (
                  item.frontmatter.subcategory === category.frontmatter.title
                )
              }
            )
            return (
              <div id={category.frontmatter.title}>
                <div className={styles.titleAndSeeMore}>
                  <h2>{category.frontmatter.title}</h2>
                  <PostCategoryTag
                    slug={category.fields.slug}
                    text={'See More'}
                  />
                </div>
                <HTMLContent
                  content={toHTML(category.frontmatter.description)}
                />
                <SecondaryPostsCarousel posts={filteredPosts} />
              </div>
            )
          })}
        <h2>Latest In {data.markdownRemark.frontmatter.title}</h2>
        <LatestPosts posts={data.categoryLatestPosts} />
      </main>
    </Layout>
  )
}

export const pageQuery = graphql`
  query CategoryByID($id: String!, $title: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      frontmatter {
        title
        description
        coverImage {
          childImageSharp {
            fluid(maxWidth: 1920, quality: 64) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
    subCategoryItems: allMarkdownRemark(
      filter: {
        frontmatter: {
          templateKey: { eq: "subcategory-item" }
          category: { eq: $title }
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
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
    categoryFeaturedPosts: allMarkdownRemark(
      filter: {
        frontmatter: {
          templateKey: { eq: "blog-post" }
          category: { eq: $title }
          categoryFeatured: { eq: true }
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
    categoryLatestPosts: allMarkdownRemark(
      filter: {
        frontmatter: {
          templateKey: { eq: "blog-post" }
          category: { eq: $title }
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
      filter: {
        frontmatter: {
          templateKey: { eq: "location" }
          category: { eq: $title }
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
                  ...GatsbyImageSharpFluid
                }
              }
            }
            pin{
              publicURL
            }
            category
            subcategory
            address
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
          fields {
            slug
          }
          frontmatter {
            title
            description
            coverImage {
              childImageSharp {
                fluid(maxWidth: 1000) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
    packages: markdownRemark(
      frontmatter: { templateKey: { eq: "packages" }, category: { eq: $title } }
    ) {
      frontmatter {
        title
        description
        packages {
          title
          description
          background {
            childImageSharp {
              fluid(maxHeight: 1000, quality: 64) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
        bottomText
        form
      }
    }
  }
`
export default CategoryPage

// import React from 'react'
// import PropTypes from 'prop-types'
// import { Link, graphql } from 'gatsby'

// import Layout from '../components/Layout'
// import Features from '../components/Features'
// import BlogRoll from '../components/BlogRoll'

// export const IndexPageTemplate = ({
//   image,
//   title,
//   heading,
//   subheading,
//   mainpitch,
//   description,
//   intro,
// }) => (
//   <div>
//     <div
//       className="full-width-image margin-top-0"
//       style={{
//         backgroundImage: `url(${
//           !!image.childImageSharp ? image.childImageSharp.fluid.src : image
//         })`,
//         backgroundPosition: `top left`,
//         backgroundAttachment: `fixed`,
//       }}
//     >
//       <div
//         style={{
//           display: 'flex',
//           height: '150px',
//           lineHeight: '1',
//           justifyContent: 'space-around',
//           alignItems: 'left',
//           flexDirection: 'column',
//         }}
//       >
//         <h1
//           className="has-text-weight-bold is-size-3-mobile is-size-2-tablet is-size-1-widescreen"
//           style={{
//             boxShadow:
//               'rgb(255, 68, 0) 0.5rem 0px 0px, rgb(255, 68, 0) -0.5rem 0px 0px',
//             backgroundColor: 'rgb(255, 68, 0)',
//             color: 'white',
//             lineHeight: '1',
//             padding: '0.25em',
//           }}
//         >
//           {title}
//         </h1>
//         <h3
//           className="has-text-weight-bold is-size-5-mobile is-size-5-tablet is-size-4-widescreen"
//           style={{
//             boxShadow:
//               'rgb(255, 68, 0) 0.5rem 0px 0px, rgb(255, 68, 0) -0.5rem 0px 0px',
//             backgroundColor: 'rgb(255, 68, 0)',
//             color: 'white',
//             lineHeight: '1',
//             padding: '0.25em',
//           }}
//         >
//           {subheading}
//         </h3>
//       </div>
//     </div>
//     <section className="section section--gradient">
//       <div className="container">
//         <div className="section">
//           <div className="columns">
//             <div className="column is-10 is-offset-1">
//               <div className="content">
//                 <div className="content">
//                   <div className="tile">
//                     <h1 className="title">{mainpitch.title}</h1>
//                   </div>
//                   <div className="tile">
//                     <h3 className="subtitle">{mainpitch.description}</h3>
//                   </div>
//                 </div>
//                 <div className="columns">
//                   <div className="column is-12">
//                     <h3 className="has-text-weight-semibold is-size-2">
//                       {heading}
//                     </h3>
//                     <p>{description}</p>
//                   </div>
//                 </div>
//                 <Features gridItems={intro.blurbs} />
//                 <div className="columns">
//                   <div className="column is-12 has-text-centered">
//                     <Link className="btn" to="/products">
//                       See all products
//                     </Link>
//                   </div>
//                 </div>
//                 <div className="column is-12">
//                   <h3 className="has-text-weight-semibold is-size-2">
//                     Latest stories
//                   </h3>
//                   <BlogRoll />
//                   <div className="column is-12 has-text-centered">
//                     <Link className="btn" to="/blog">
//                       Read more
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   </div>
// )

// IndexPageTemplate.propTypes = {
//   image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
//   title: PropTypes.string,
//   heading: PropTypes.string,
//   subheading: PropTypes.string,
//   mainpitch: PropTypes.object,
//   description: PropTypes.string,
//   intro: PropTypes.shape({
//     blurbs: PropTypes.array,
//   }),
// }

// const IndexPage = ({ data }) => {
//   const { frontmatter } = data.markdownRemark

//   return (
//     <Layout>
//       <IndexPageTemplate
//         image={frontmatter.image}
//         title={frontmatter.title}
//         heading={frontmatter.heading}
//         subheading={frontmatter.subheading}
//         mainpitch={frontmatter.mainpitch}
//         description={frontmatter.description}
//         intro={frontmatter.intro}
//       />
//     </Layout>
//   )
// }

// IndexPage.propTypes = {
//   data: PropTypes.shape({
//     markdownRemark: PropTypes.shape({
//       frontmatter: PropTypes.object,
//     }),
//   }),
// }

// export default IndexPage

// export const pageQuery = graphql`
//   query IndexPageTemplate {
//     markdownRemark(frontmatter: { templateKey: { eq: "index-page" } }) {
//       frontmatter {
//         title
//         image {
//           childImageSharp {
//             fluid(maxWidth: 2048, quality: 100) {
//               ...GatsbyImageSharpFluid
//             }
//           }
//         }
//         heading
//         subheading
//         mainpitch {
//           title
//           description
//         }
//         description
//         intro {
//           blurbs {
//             image {
//               childImageSharp {
//                 fluid(maxWidth: 240, quality: 64) {
//                   ...GatsbyImageSharpFluid
//                 }
//               }
//             }
//             text
//           }
//           heading
//           description
//         }
//       }
//     }
//   }
// `

import React, { useState } from 'react'
import { graphql, useStaticQuery } from 'gatsby'

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
                  fluid(maxWidth: 1000, quality: 64) {
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
    }
  `)

  const [currentX, setCurrentX] = useState(
    carouselPosts.locations.edges[0].node.frontmatter.longitude
  )
  const [currentY, setCurrentY] = useState(
    carouselPosts.locations.edges[0].node.frontmatter.latitude
  )

  let featuredCategories = []

  carouselPosts.categoryFeaturedPosts.edges.forEach(({ node }) => {
    let categoryName = node.frontmatter.category
    if (featuredCategories.indexOf(categoryName) == -1) {
      featuredCategories.push(categoryName)
    }
  })

  let featuredCategoriesInOrder = (featuredCategories) => {
    let filteredCategories = carouselPosts.categories.edges.filter(
      ({ node: category }) => {
        if (featuredCategories.indexOf(category.frontmatter.title) !== -1) {
          return true
        }
      }
    )

    return filteredCategories
  }

  return (
    <Layout>
      <main>
        <h1>RUN BGD</h1>
        <p>
          RUN BGD is a team of young and ambitious people gathered around the
          idea to present Belgrade as destination in a little different light,
          unlike agencies and other organisations.
        </p>
        <hr />
        <BigPostsCarousel posts={carouselPosts.allMarkdownRemark} />
        <SecondaryPostsCarousel
          posts={carouselPosts.trending.edges}
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
              locations={carouselPosts.locations.edges}
              zoom={12}
              currentX={currentX}
              currentY={currentY}
            />
          </div>
          <div className={styles.locations}>
            <FindPlacesLocations
              locations={carouselPosts.locations.edges}
              filterCategory={'Select Category'}
              horizontalOnMobile={true}
              setCurrentX={setCurrentX}
              setCurrentY={setCurrentY}
            />
          </div>
        </div>
        <hr />
        <FindPlacesMainCard />
        <hr />
        {featuredCategoriesInOrder(featuredCategories).map(
          ({ node: category }) => {
            let posts = carouselPosts.categoryFeaturedPosts.edges.filter(
              ({ node }) => {
                return node.frontmatter.category === category.frontmatter.title
              }
            )

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
            posts={carouselPosts.trending.edges}
            heading="Trending"
            displayCategory={true}
          />
        </div>
      </aside>
    </Layout>
  )
}

export default IndexPage

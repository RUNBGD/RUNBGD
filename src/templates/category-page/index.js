import React, {useState} from 'react'
import {graphql} from 'gatsby'
import {Helmet} from 'react-helmet'
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
import styles from './category-page.module.scss'


const toHTML = value => remark().use(remarkHTML).processSync(value).toString()

let CategoryPage = ({data}) => {

  const [currentX, setCurrentX] = useState(data.locations.edges[0] && data.locations.edges[0].node.frontmatter.longitude)
  const [currentY, setCurrentY] = useState(data.locations.edges[0] && data.locations.edges[0].node.frontmatter.latitude)

    return(
        <Layout
          fullWidthContent={
            <React.Fragment>
              <div className={styles.categoryCoverContainer}>
                <h1 className={styles.categoryCoverHeading}>{data.markdownRemark.frontmatter.title}</h1>
                <hr/>
                <div className={styles.categoryCover}>
                  <Image fluid={data.markdownRemark.frontmatter.coverImage.childImageSharp.fluid} alt=''/>
                </div>
              </div>
            </React.Fragment>
          }
        >
          <Helmet>
            <title>{data.markdownRemark.frontmatter.title} | RUN BGD</title>
            <meta name="description" content={`Find more interesting stories in category ${data.markdownRemark.frontmatter.title} at RUN BGD`} />
          </Helmet>
          <main>
            <HTMLContent content={toHTML(data.markdownRemark.frontmatter.description)}/>
            <hr/>
            <BigPostsCarousel posts={data.categoryFeaturedPosts} />
            {data.locations.edges[0] && 
            <React.Fragment>
              <h2>Find Places</h2>
              <div className={styles.mapAndLocations}>
                <div className={styles.map}>
                  <FindPlacesMap locations={data.locations.edges} zoom={6} currentX={currentX} currentY={currentY}/>
                </div>
                <div className={styles.locations}>
                  <FindPlacesLocations locations={data.locations.edges} filterCategory={'Select Category'} horizontalOnMobile={true} setCurrentX={setCurrentX} setCurrentY={setCurrentY}/>
                </div>
              </div>
              <FindPlacesMainCard />
            </React.Fragment>
          }
          <hr/>
          {data.subCategories.edges[0] && 
            data.subCategories.edges.map(({node:category}) => {
              let filteredPosts = data.subCategoryItems.edges.filter(({node:item}) => {
                return item.frontmatter.subcategory === category.frontmatter.title
              })
              return <React.Fragment>
                <h2>{category.frontmatter.title}</h2>
                <HTMLContent content={toHTML(category.frontmatter.description)}/>
                <SecondaryPostsCarousel posts={filteredPosts}/>
              </React.Fragment>
            })
          }
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
            coverImage{
              childImageSharp{
                fluid(maxWidth:1920, quality: 64){
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
        subCategoryItems:allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "subcategory-item"}, category: {eq:$title}}}){
          edges {
              node{
              fields{
                slug
              }
              frontmatter{
                  title
                  subcategory
                  coverImage{
                      childImageSharp{
                          fluid(maxWidth:1000){
                              ...GatsbyImageSharpFluid
                          }
                      }
                  }
              }
              }
            }
          }
        categoryFeaturedPosts:allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "blog-post"}, category: {eq: $title}, categoryFeatured: {eq: true}}}){
          edges {
              node{
                fields{
                  slug
                }
              frontmatter{
                  title
                  category
                  author
                  coverImage{
                  childImageSharp {
                      fluid(maxWidth:1000, quality: 64){
                      ...GatsbyImageSharpFluid
                      }
                  }
                  }
              }
              }
          }
          }
        categoryLatestPosts:allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "blog-post"}, category: {eq: $title}}}){
          edges {
              node{
                fields{
                  slug
                }
              frontmatter{
                  title
                  category
                  author
                  coverImage{
                  childImageSharp {
                      fluid(maxWidth:1000, quality: 64){
                      ...GatsbyImageSharpFluid
                      }
                  }
                  }
              }
              }
          }
          }
          locations:allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "location"}, category: {eq:$title}}}){
            edges {
                node{
                frontmatter{
                    name
                    coverImage{
                        childImageSharp{
                            fluid(maxWidth:1000){
                                ...GatsbyImageSharpFluid
                            }
                        }
                    }
                    category
                    address
                    latitude
                    longitude
                }
                }
              }
            }
          subCategories:allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "category-subcategory"}, category: {eq:$title}}}){
            edges {
                node{
                frontmatter{
                    title
                    description
                    coverImage{
                        childImageSharp{
                            fluid(maxWidth:1000){
                                ...GatsbyImageSharpFluid
                            }
                        }
                    }
                }
                }
              }
            }
      }
    `
    export default CategoryPage
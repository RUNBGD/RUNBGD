import React from 'react'
import Image from 'gatsby-image'
import {graphql, Link} from 'gatsby'
import {Helmet} from 'react-helmet'

import styles from './tour.module.scss'

import Layout from '../../components/Layout'
import {HTMLContent} from '../../components/Content'
import Content from '../../components/Content'
import LatestPosts from '../../components/LatestPosts'
import PostCategoryTag from '../../components/PostCategoryTag'

export const TourTemplate = ({data}) => {

  return (
    <main>
      <Helmet>
          <title>{data.markdownRemark.frontmatter.title} | RUN BGD</title>
          <meta name="description" content={`${data.markdownRemark.frontmatter.title} ${data.markdownRemark.html}`} />
      </Helmet>
      <h2>{data.markdownRemark.frontmatter.title}</h2>
      <hr/>
      {/* <div className={styles.postDetails}>
        <div className={styles.postCategory}>
          <PostCategoryTag slug={categorySlug} text={data.markdownRemark.frontmatter.category} />
        </div>
        <p className={styles.postAuthor}>
          <span>BY </span>
          <Link to={authorSlug}>
            {data.markdownRemark.frontmatter.author}
          </Link> 
        </p>
        <p className={styles.postDate}>
          {String(data.markdownRemark.frontmatter.date)}
        </p>
      </div> */}
      <div className={styles.postCover}>
        {data.markdownRemark.frontmatter.coverImage.childImageSharp ?
          <Image fluid={data.markdownRemark.frontmatter.coverImage.childImageSharp.fluid} alt=''/>
            :
          <img src={data.markdownRemark.frontmatter.coverImage}/>
        }
      </div>
      {data.html ? 
        <Content content={data.html} className={styles.postBody}/>
        :
        <HTMLContent content={data.markdownRemark.html} className={styles.postBody}/>

      }
      <hr/>
      <h2>Latest In {data.markdownRemark.frontmatter.subcategory}</h2>
      {data.subcategoryLatestPosts && <LatestPosts posts={data.subcategoryLatestPosts}/>}
    </main>
  )
}

let Tour = ({data}) => {
    

    return(
      <Layout>
        <TourTemplate data={data}/>
      </Layout>
        )
    }
    
    export const pageQuery = graphql`
      query SubcategoryItemByID($id: String!, $subcategory: String!) {
        markdownRemark(id: { eq: $id }) {
          id
          html
          frontmatter {
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
        subcategoryLatestPosts:allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "subcategory-item"}, subcategory: {eq: $subcategory}}, id:{ne: $id}}){
          edges {
              node{
                fields{
                  slug
                }
              frontmatter{
                  title
                  subcategory
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
      }
    `
    export default Tour
    
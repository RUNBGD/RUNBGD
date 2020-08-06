import React from 'react'
import {graphql} from 'gatsby'
import {Helmet} from 'react-helmet'

import Layout from '../../components/Layout'
import LatestPosts from '../../components/LatestPosts'
import BigPostsCarousel from '../../components/BigPostsCarousel'

let CategoryPage = ({data}) => {

    return(
        <Layout>
          <Helmet>
            <title>{data.markdownRemark.frontmatter.title} | RUN BGD</title>
            <meta name="description" content={`Find more interesting stories in category ${data.markdownRemark.frontmatter.title} at RUN BGD`} />
          </Helmet>
          <main>
            <h1>{data.markdownRemark.frontmatter.title}</h1>
            <hr/>
            <BigPostsCarousel posts={data.categoryFeaturedPosts} />
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
      }
    `
    export default CategoryPage
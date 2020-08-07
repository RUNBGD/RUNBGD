import React from 'react'
import {graphql} from 'gatsby'
import {Helmet} from 'react-helmet'
import remark from 'remark'
import remarkHTML from 'remark-html'

import Layout from '../../components/Layout'
import LatestPosts from '../../components/LatestPosts'
import { HTMLContent } from '../../components/Content'
import styles from './author-page.module.scss'


const toHTML = value => remark().use(remarkHTML).processSync(value).toString()

let AuthorPage = ({data}) => {

return(
    <Layout>
        <Helmet>
            <title>Author {data.markdownRemark.frontmatter.name} | RUN BGD</title>
            <meta name="description" content={`See all stories written by ${data.markdownRemark.frontmatter.name} sorted from newer to older ones.`} />
        </Helmet>
        <main>
            <h1>{data.markdownRemark.frontmatter.name}</h1>
            <HTMLContent className={styles.authorInformation} content={toHTML(data.markdownRemark.frontmatter.information)}/>
            <h2>Latest Stories By {data.markdownRemark.frontmatter.name}</h2>
            <LatestPosts posts={data.categoryLatestPosts} />
        </main>
    </Layout>
    )
}

export const pageQuery = graphql`
    query AuthortByID($id: String!, $author: String!) {
    markdownRemark(id: { eq: $id }) {
        id
        frontmatter {
          name
          information
        }
    }
    categoryLatestPosts:allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "blog-post"}, author: {eq: $author}}}){
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
export default AuthorPage
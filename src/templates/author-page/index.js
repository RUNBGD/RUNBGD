import React from 'react'
import {graphql} from 'gatsby'

import Layout from '../../components/Layout'
import LatestPosts from '../../components/LatestPosts'

let AuthorPage = ({data}) => {

return(
    <Layout>
        <main>
            <h1>{data.markdownRemark.frontmatter.name}</h1>
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
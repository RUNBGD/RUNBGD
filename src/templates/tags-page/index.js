import React from 'react'
import {graphql} from 'gatsby'
import {Helmet} from 'react-helmet'
import remark from 'remark'
import remarkHTML from 'remark-html'

import Layout from '../../components/Layout'
import LatestPosts from '../../components/LatestPosts'
import { HTMLContent } from '../../components/Content'
import styles from './tags-page.module.scss'


const toHTML = value => remark().use(remarkHTML).processSync(value).toString()

let TagsPage = ({data}) => {

return(
    <Layout>
        <Helmet>
            <title>Tag {data.markdownRemark.frontmatter.iconDescription} | RUN BGD</title>
            <meta name="description" content={`See all stories by tag ${data.markdownRemark.frontmatter.iconDescription} sorted from newer to older ones.`} />
        </Helmet>
        <main>
            <h1>{data.markdownRemark.frontmatter.heading}: {data.markdownRemark.frontmatter.iconDescription}</h1>
            <h2>Stories</h2>
            <LatestPosts posts={data.TagPosts} />
        </main>
    </Layout>
    )
}

export const pageQuery = graphql`
    query TagByID($id: String!, $tag: String!) {
    markdownRemark(id: { eq: $id }) {
        id
        frontmatter {
          heading
          iconDescription
        }
    }
    TagPosts:allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "blog-post"}, icons: {elemMatch: {icon: {eq: $tag}}}}}){
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
export default TagsPage
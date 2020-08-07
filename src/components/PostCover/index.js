import React from 'react'
import Image from 'gatsby-image'
import {Link, useStaticQuery, graphql} from 'gatsby'

import styles from './post-cover.module.scss'
import PostImage from '../PostImage'

const PostCover = ({post}) => {
    
    let data = useStaticQuery(graphql`
    query data{
        allCategories: allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "category-page"}}}){
            edges {
                node{
                  fields{
                    slug
                  }
                frontmatter{
                    title
                }
                }
            }
            }
        authors:allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "author-page"}}}){
            edges {
                node{
                  fields{
                    slug
                  }
                frontmatter{
                    name
                }
                }
            }
            }
    }
    `)

    let category = data.allCategories.edges.find(({node:category}) => post.frontmatter.category === category.frontmatter.title)

    let categorySlug = category.node.fields.slug

    let author = data.authors.edges.find(({node:author}) => post.frontmatter.author === author.frontmatter.name)

    let authorSlug = author.node.fields.slug

    return(
        <div className={styles.post}> 
                <div className={styles.postImage}>
                    <PostImage slug={post.fields.slug} image={post.frontmatter.coverImage.childImageSharp.fluid} />
                </div>
            <div className={styles.postText}>
                <div className={styles.postDetails}>
                <Link to={categorySlug}>
                    <span className={styles.postCategory}>{post.frontmatter.category}</span>
                </Link>
                <Link to={authorSlug}>
                    <p className={styles.postAuthor}>by <a>{post.frontmatter.author}</a></p>
                </Link>
                </div>
                <Link to={post.fields.slug}>
                    <p className={styles.postHeading}>
                    {post.frontmatter.title}
                    </p>
                </Link>
            </div>
        </div>
    )
}

export default PostCover
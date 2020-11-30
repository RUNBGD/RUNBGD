import React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'

import styles from './post-cover.module.scss'
import PostImage from '../PostImage'
import PostCategoryTag from '../PostCategoryTag'

const PostCover = ({ post }) => {
  let data = useStaticQuery(graphql`
    query data {
      allCategories: allMarkdownRemark(
        filter: { frontmatter: { templateKey: { eq: "category-page" } } }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
            }
          }
        }
      }
      authors: allMarkdownRemark(
        filter: { frontmatter: { templateKey: { eq: "author-page" } } }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              name
            }
          }
        }
      }
    }
  `)

  let categorySlug = undefined
  let authorSlug = undefined

  let category = data.allCategories.edges.find(
    ({ node: category }) =>
      post.frontmatter.category === category.frontmatter.title
  )

  if (category) {
    categorySlug = category.node.fields.slug
  }

  let author = data.authors.edges.find(
    ({ node: author }) => post.frontmatter.author === author.frontmatter.name
  )

  if (author) {
    authorSlug = author.node.fields.slug
  }

  console.log(post.frontmatter)

  return (
    <div className={styles.post}>
      <div className={styles.postImage}>
        {
          post.frontmatter.coverImage &&
          <PostImage
            slug={post.fields.slug}
            image={post.frontmatter.coverImage}
          />
        }
      </div>
      <div className={styles.postText}>
        <div className={styles.postDetails}>
          {post.frontmatter.category && (
            <PostCategoryTag
              slug={categorySlug}
              text={post.frontmatter.category}
            />
          )}
          <Link to={authorSlug}>
            <p className={styles.postAuthor}>
              by <a>{post.frontmatter.author}</a>
            </p>
          </Link>
        </div>
        <Link to={post.fields.slug}>
          <p className={styles.postHeading}>{post.frontmatter.title}</p>
        </Link>
      </div>
    </div>
  )
}

export default PostCover

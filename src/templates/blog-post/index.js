import React from 'react'
import Image from 'gatsby-image'
import { graphql, Link } from 'gatsby'
import { Helmet } from 'react-helmet'

import styles from './blog-post.module.scss'

import Layout from '../../components/Layout'
import { HTMLContent } from '../../components/Content'
import Content from '../../components/Content'
import LatestPosts from '../../components/LatestPosts'
import PostCategoryTag from '../../components/PostCategoryTag'

export const BlogPostTemplate = ({ data }) => {
  console.log(data.icons)

  let authorSlug = ''
  let categorySlug = ''

  if (data.categories && data.authors) {
    let category = data.categories.edges.find(
      ({ node: category }) =>
        data.markdownRemark.frontmatter.category === category.frontmatter.title
    )

    categorySlug = category.node.fields.slug

    let author = data.authors.edges.find(
      ({ node: author }) =>
        data.markdownRemark.frontmatter.author === author.frontmatter.name
    )

    authorSlug = author.node.fields.slug
  }

  return (
    <main>
      <Helmet>
        <title>{data.markdownRemark.frontmatter.title} | RUN BGD</title>
        <meta
          name="description"
          content={`${data.markdownRemark.frontmatter.title} ${data.markdownRemark.html}`}
        />
      </Helmet>
      <h2>{data.markdownRemark.frontmatter.title}</h2>
      <hr />
      <div className={styles.postDetails}>
        <div className={styles.postCategory}>
          <PostCategoryTag
            slug={categorySlug}
            text={data.markdownRemark.frontmatter.category}
          />
        </div>
        <p className={styles.postAuthor}>
          <span>BY </span>
          <Link to={authorSlug}>{data.markdownRemark.frontmatter.author}</Link>
        </p>
        <p className={styles.postDate}>
          {String(data.markdownRemark.frontmatter.date)}
        </p>
      </div>
      <div className={styles.postCover}>
        {data.markdownRemark.frontmatter.coverImage && data.markdownRemark.frontmatter.coverImage.childImageSharp ? (
          <Image
            fluid={
              data.markdownRemark.frontmatter.coverImage.childImageSharp.fluid
            }
            alt=""
          />
        ) : (
          <img src={data.markdownRemark.frontmatter.coverImage} />
        )}
      </div>
      {data.html ? (
        <Content content={data.html} className={styles.postBody} />
      ) : (
        <HTMLContent
          content={data.markdownRemark.html}
          className={styles.postBody}
        />
      )}
      {data.icons && data.icons.edges != undefined && (
        <div className={styles.iconsContainer}>
          {data.icons.edges.map(({ node: icon }, index) => {
            return (
              <Link
                to={`/tag/${icon.frontmatter.iconDescription.toLowerCase()}`}
              >
                <div className={styles.icon} key={index}>
                  <h3>{icon.frontmatter.heading}</h3>
                  <div>
                    {data.markdownRemark.frontmatter.coverImage
                      .childImageSharp ? (
                      <Image
                        className={styles.iconImage}
                        fixed={icon.frontmatter.icon.childImageSharp.fixed}
                        alt=""
                      />
                    ) : (
                      <img src={icon.icon} />
                    )}
                  </div>
                  <p>{icon.frontmatter.iconDescription}</p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
      <hr />
      <h2>Latest In {data.markdownRemark.frontmatter.category}</h2>
      {data.categoryPosts && <LatestPosts posts={data.categoryPosts} />}
    </main>
  )
}

let BlogPost = ({ data }) => {
  return (
    <Layout>
      <BlogPostTemplate data={data} />
    </Layout>
  )
}

export const pageQuery = graphql`
  query BlogPostByID($id: String!, $category: String!, $tagArray: [String]!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        author
        category
        date(formatString: "MMMM DD, YYYY")
        title
        coverImage {
          publicURL
          childImageSharp {
            fluid(maxWidth: 1000) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
    icons: allMarkdownRemark(
      filter: {
        frontmatter: {
          templateKey: { eq: "tag" }
          iconDescription: { in: $tagArray }
        }
      }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            heading
            icon {
              childImageSharp {
                fixed(height: 65, quality: 64) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
            iconDescription
          }
        }
      }
    }
    categories: allMarkdownRemark(
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
    categoryPosts: allMarkdownRemark(
      filter: {
        frontmatter: {
          templateKey: { eq: "blog-post" }
          category: { eq: $category }
        }
        id: { ne: $id }
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
  }
`
export default BlogPost

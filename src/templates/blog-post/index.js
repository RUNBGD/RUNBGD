// import React from 'react'
// import PropTypes from 'prop-types'
// import { kebabCase } from 'lodash'
// import { Helmet } from 'react-helmet'
// import { graphql, Link } from 'gatsby'
// import Layout from '../components/Layout'
// import Content, { HTMLContent } from '../components/Content'

// export const BlogPostTemplate = ({
//   content,
//   contentComponent,
//   description,
//   tags,
//   title,
//   helmet,
// }) => {
//   const PostContent = contentComponent || Content

//   return (
//     <section className="section">
//       {helmet || ''}
//       <div className="container content">
//         <div className="columns">
//           <div className="column is-10 is-offset-1">
//             <h1 className="title is-size-2 has-text-weight-bold is-bold-light">
//               {title}
//             </h1>
//             <p>{description}</p>
//             <PostContent content={content} />
//             {tags && tags.length ? (
//               <div style={{ marginTop: `4rem` }}>
//                 <h4>Tags</h4>
//                 <ul className="taglist">
//                   {tags.map((tag) => (
//                     <li key={tag + `tag`}>
//                       <Link to={`/tags/${kebabCase(tag)}/`}>{tag}</Link>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ) : null}
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// BlogPostTemplate.propTypes = {
//   content: PropTypes.node.isRequired,
//   contentComponent: PropTypes.func,
//   description: PropTypes.string,
//   title: PropTypes.string,
//   helmet: PropTypes.object,
// }

// const BlogPost = ({ data }) => {
//   const { markdownRemark: post } = data

//   return (
//     <Layout>
//       <BlogPostTemplate
//         content={post.html}
//         contentComponent={HTMLContent}
//         description={post.frontmatter.description}
//         helmet={
//           <Helmet titleTemplate="%s | Blog">
//             <title>{`${post.frontmatter.title}`}</title>
//             <meta
//               name="description"
//               content={`${post.frontmatter.description}`}
//             />
//           </Helmet>
//         }
//         tags={post.frontmatter.tags}
//         title={post.frontmatter.title}
//       />
//     </Layout>
//   )
// }

// BlogPost.propTypes = {
//   data: PropTypes.shape({
//     markdownRemark: PropTypes.object,
//   }),
// }

// export default BlogPost


import React from 'react'
import Image from 'gatsby-image'
import {graphql, Link} from 'gatsby'

import styles from './blog-post.module.scss'

import Layout from '../../components/Layout'
import {HTMLContent} from '../../components/Content'
import Content from '../../components/Content'
import LatestPosts from '../../components/LatestPosts'

export const BlogPostTemplate = ({data}) => {
  let authorSlug = ''
  let categorySlug = ''
  
  if(data.categories && data.authors){
    let category = data.categories.edges.find(({node:category}) => data.markdownRemark.frontmatter.category === category.frontmatter.title)
    
    categorySlug = category.node.fields.slug

    let author = data.authors.edges.find(({node:author}) => data.markdownRemark.frontmatter.author === author.frontmatter.name)
    
    authorSlug = author.node.fields.slug
  }
  

  return (
    <main>
      <h2>{data.markdownRemark.frontmatter.title}</h2>
      <hr/>
      <div className={styles.postDetails}>
        <div className={styles.postCategory}>
        <Link to={categorySlug}>
          <span>{data.markdownRemark.frontmatter.category}</span>
        </Link>
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
      </div>
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
      <h3>Latest In {data.markdownRemark.frontmatter.category}</h3>
      {data.categoryPosts && <LatestPosts posts={data.categoryPosts}/>}
    </main>
  )
}

let BlogPost = ({data}) => {
    

    return(
      <Layout>
        <BlogPostTemplate data={data}/>
      </Layout>
        )
    }
    
    export const pageQuery = graphql`
      query BlogPostByID($id: String!, $category: String!) {
        markdownRemark(id: { eq: $id }) {
          id
          html
          frontmatter {
            author
            category
            date(formatString: "MMMM DD, YYYY")
            title
            coverImage{
              childImageSharp{
                fluid(maxWidth:1000){
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
        categories:allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "category-page"}}}){
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
            categoryPosts:allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "blog-post"}, category: {eq: $category}}, id: {ne: $id}}){
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
    export default BlogPost
    
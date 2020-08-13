const _ = require('lodash')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const { fmImagesToRelative } = require('gatsby-remark-relative-images')

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions

  await graphql(`
    {
      allMarkdownRemark(limit: 2000, filter:{frontmatter:{createPage:{eq: "true"}, templateKey: {eq: "blog-post"}}}) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              templateKey
              category
            }
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      result.errors.forEach((e) => console.error(e.toString()))
      return Promise.reject(result.errors)
    }

    const posts = result.data.allMarkdownRemark.edges

    posts.forEach((edge) => {
      const id = edge.node.id
      const category = edge.node.frontmatter.category
      
      createPage({
        path: edge.node.fields.slug,
        component: path.resolve(
          `src/templates/${String(edge.node.frontmatter.templateKey)}/index.js`
        ),
        // additional data can be passed via context
        context: {
          id,
          category
        },
      })
    })
  })

  await graphql(`
    {
      allMarkdownRemark(limit: 2000, filter:{frontmatter:{createPage:{eq: "true"}, templateKey: {eq: "subcategory-item"}}}) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              templateKey
            }
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      result.errors.forEach((e) => console.error(e.toString()))
      return Promise.reject(result.errors)
    }

    const items = result.data.allMarkdownRemark.edges

    items.forEach((edge) => {
      const id = edge.node.id
      
      createPage({
        path: edge.node.fields.slug,
        component: path.resolve(
          `src/templates/${String(edge.node.frontmatter.templateKey)}/index.js`
        ),
        // additional data can be passed via context
        context: {
          id
        },
      })
    })
  })

  await graphql(`
    {
      allMarkdownRemark(limit: 2000, filter:{frontmatter:{createPage:{eq: "true"}, templateKey: {eq: "author-page"}}}) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              templateKey
              name
            }
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      result.errors.forEach((e) => console.error(e.toString()))
      return Promise.reject(result.errors)
    }

    const posts = result.data.allMarkdownRemark.edges

    posts.forEach((edge) => {
      const id = edge.node.id
      const author = edge.node.frontmatter.name
      
      createPage({
        path: edge.node.fields.slug,
        component: path.resolve(
          `src/templates/${String(edge.node.frontmatter.templateKey)}/index.js`
        ),
        // additional data can be passed via context
        context: {
          id,
          author
        },
      })
    })
  })

    await graphql(`
    {
      allMarkdownRemark(limit: 2000, filter:{frontmatter:{templateKey: {eq: "page-title-and-body"}}}) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              templateKey
            }
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      result.errors.forEach((e) => console.error(e.toString()))
      return Promise.reject(result.errors)
    }

    const posts = result.data.allMarkdownRemark.edges

    posts.forEach((edge) => {
      const id = edge.node.id
      
      createPage({
        path: edge.node.fields.slug,
        component: path.resolve(
          `src/templates/page-title-and-body/index.js`
        ),
        // additional data can be passed via context
        context: {
          id
        },
      })
    })
  })

    return graphql(`
    {
      allMarkdownRemark(limit: 2000, filter:{frontmatter:{createPage:{eq: "true"}, templateKey: {eq: "category-page"}}}) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              templateKey
              title
            }
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      result.errors.forEach((e) => console.error(e.toString()))
      return Promise.reject(result.errors)
    }

    const posts = result.data.allMarkdownRemark.edges

    posts.forEach((edge) => {
      const id = edge.node.id
      const title = edge.node.frontmatter.title
      
      createPage({
        path: edge.node.fields.slug,
        component: path.resolve(
          `src/templates/${String(edge.node.frontmatter.templateKey)}/index.js`
        ),
        // additional data can be passed via context
        context: {
          id,
          title
        },
      })
    })

    // // Tag pages:
    // let tags = []
    // // Iterate through each post, putting all found tags into `tags`
    // posts.forEach((edge) => {
    //   if (_.get(edge, `node.frontmatter.tags`)) {
    //     tags = tags.concat(edge.node.frontmatter.tags)
    //   }
    // })
    // // Eliminate duplicate tags
    // tags = _.uniq(tags)

    // // Make tag pages
    // tags.forEach((tag) => {
    //   const tagPath = `/tags/${_.kebabCase(tag)}/`

    //   createPage({
    //     path: tagPath,
    //     component: path.resolve(`src/templates/tags.js`),
    //     context: {
    //       tag,
    //     },
    //   })
    // })



  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  fmImagesToRelative(node) // convert image paths for gatsby images

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

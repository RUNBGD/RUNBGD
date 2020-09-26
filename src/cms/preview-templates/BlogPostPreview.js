import React from 'react'
import PropTypes from 'prop-types'
import { BlogPostTemplate } from '../../templates/blog-post'

const BlogPostPreview = ({ entry, widgetFor }) => {
  return (
    <BlogPostTemplate
      data={{
        markdownRemark: {
          frontmatter: {
            title: entry.getIn(['data', 'title']),
            coverImage: entry.getIn(['data', 'coverImage']),
            category: entry.getIn(['data', 'category']),
            author: entry.getIn(['data', 'author']),
            date: entry.getIn(['data', 'date']),
            icons: entry.getIn(['data']).toJS().icons,
          },
        },
        html: widgetFor('body'),
      }}
    />
  )
}

BlogPostPreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  widgetFor: PropTypes.func,
}

export default BlogPostPreview

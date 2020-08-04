import React from 'react'
import PropTypes from 'prop-types'
import { BlogPostTemplate } from '../../templates/blog-post'

const BlogPostPreview = ({ entry, widgetFor }) => {
  // const tags = entry.getIn(['data', 'tags'])
  return (
    <BlogPostTemplate
      data={{
        markdownRemark:{
          frontmatter:{
            title:entry.getIn(['data', 'title']),
            coverImage:entry.getIn(['data', 'coverImage']),
            category:entry.getIn(['data', 'category']),
            author:entry.getIn(['data', 'author']),
            date:entry.getIn(['data', 'date'])
          },
          html:entry.getIn(['data', 'body'])
        }
      }}
      // content={widgetFor('body')}
      // description={entry.getIn(['data', 'description'])}
      // tags={tags && tags.toJS()}
      // title={entry.getIn(['data', 'title'])}
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

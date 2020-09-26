import React from 'react'
import PropTypes from 'prop-types'
import { TourTemplate } from '../../templates/subcategory-item'

const TourPreview = ({ entry, widgetFor }) => {
  return (
    <TourTemplate
      data={{
        markdownRemark: {
          frontmatter: {
            title: entry.getIn(['data', 'title']),
            coverImage: entry.getIn(['data', 'coverImage']),
            category: entry.getIn(['data', 'category']),
            subcategory: entry.getIn(['data', 'subcategory']),
          },
        },
        html: widgetFor('body'),
      }}
    />
  )
}

TourPreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  widgetFor: PropTypes.func,
}

export default TourPreview

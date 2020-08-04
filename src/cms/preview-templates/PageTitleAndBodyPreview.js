import React from 'react'
import PropTypes from 'prop-types'
import { PageTitleAndBodyTemplate } from '../../templates/page-title-and-body'

const PageTitleAndBodyPreview = ({ entry, widgetFor }) => {
  return (
    <PageTitleAndBodyTemplate
      data={{
        markdownRemark:{
          frontmatter:{
            title:entry.getIn(['data', 'title']),
          },
        },
        html:widgetFor('body')
      }}
    />
  )
}

PageTitleAndBodyPreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  widgetFor: PropTypes.func,
}

export default PageTitleAndBodyPreview

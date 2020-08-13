import CMS from 'netlify-cms-app'
import uploadcare from 'netlify-cms-media-library-uploadcare'
import cloudinary from 'netlify-cms-media-library-cloudinary'

import styles from './preview-templates/templates.css'
import BlogPostPreview from './preview-templates/BlogPostPreview'
import ProductPagePreview from './preview-templates/ProductPagePreview'
import PageTitleAndBodyPreview from './preview-templates/PageTitleAndBodyPreview'
import TourPreview from './preview-templates/TourPreview'

CMS.registerPreviewStyle(styles)

CMS.registerMediaLibrary(uploadcare)
CMS.registerMediaLibrary(cloudinary)

CMS.registerPreviewTemplate('contactUs', PageTitleAndBodyPreview)
CMS.registerPreviewTemplate('privacyPolicy', PageTitleAndBodyPreview)
CMS.registerPreviewTemplate('tour', TourPreview)
CMS.registerPreviewTemplate('termsOfUse', PageTitleAndBodyPreview)
CMS.registerPreviewTemplate('products', ProductPagePreview)
CMS.registerPreviewTemplate('post', BlogPostPreview)

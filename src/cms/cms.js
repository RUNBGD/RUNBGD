import CMS from 'netlify-cms-app'
import uploadcare from 'netlify-cms-media-library-uploadcare'
import cloudinary from 'netlify-cms-media-library-cloudinary'

import styles from './preview-templates/templates.css'
import AboutPagePreview from './preview-templates/AboutPagePreview'
import BlogPostPreview from './preview-templates/BlogPostPreview'
import ProductPagePreview from './preview-templates/ProductPagePreview'
import IndexPagePreview from './preview-templates/IndexPagePreview'
import PageTitleAndBodyPreview from './preview-templates/PageTitleAndBodyPreview'

CMS.registerPreviewStyle(styles)

CMS.registerMediaLibrary(uploadcare)
CMS.registerMediaLibrary(cloudinary)

CMS.registerPreviewTemplate('index', IndexPagePreview)
CMS.registerPreviewTemplate('contactUs', PageTitleAndBodyPreview)
CMS.registerPreviewTemplate('privacyPolicy', PageTitleAndBodyPreview)
CMS.registerPreviewTemplate('termsOfUse', PageTitleAndBodyPreview)
CMS.registerPreviewTemplate('about', AboutPagePreview)
CMS.registerPreviewTemplate('products', ProductPagePreview)
CMS.registerPreviewTemplate('post', BlogPostPreview)

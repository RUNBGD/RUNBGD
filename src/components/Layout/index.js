import React from 'react'
import {Helmet} from 'react-helmet'

import Header from '../Header'
import Footer from '../Footer'
import useSiteMetadata from '../SiteMetadata'

import logo from '../../img/logo.jpeg'


const Layout = ({children, verticalSlider, fullWidthContent, fullWidth}) => {

  const { title, description } = useSiteMetadata()

  return (
    <div style={{height:verticalSlider && '100vh', overflow: verticalSlider && 'hidden'}}>
      <Helmet>
      <html lang="en" />
      <title>{title}</title>
      <meta name="description" content={description} />

      <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={logo}
        />
        <link
          rel="icon"
          type="image/png"
          href={logo}
          sizes="32x32"
        />
        <link
          rel="icon"
          type="image/png"
          href={logo}
          sizes="16x16"
        />

        <link
          rel="mask-icon"
          href={logo}
          color="#ff4400"
        />
        <meta name="theme-color" content="#fff" />

        <meta property="og:type" content="business.business" />
        <meta property="og:title" content={title} />
        <meta property="og:url" content="/" />
        <meta
          property="og:image"
          content={logo}
        />
      </Helmet>
      {
        <Header/>
      }
      {fullWidthContent}
      <div className={!fullWidth && 'content'}>
        {children}
      </div>
      {!verticalSlider && <Footer/>}
    </div>
  )
}

export default Layout
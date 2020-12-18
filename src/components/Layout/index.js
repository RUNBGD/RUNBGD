import React from 'react'
import { Helmet } from 'react-helmet'

import Header from '../Header'
import Footer from '../Footer'
import useSiteMetadata from '../SiteMetadata'

import logo from '../../img/logo.jpeg'
import logoVector from '../../img/logo-vector.svg'

const Layout = ({ children, verticalSlider, fullWidthContent, fullWidth }) => {
  const { title, description } = useSiteMetadata()

  return (
    <div
      style={{
        height: verticalSlider && '100vh',
        overflow: verticalSlider && 'hidden',
      }}
    >
      <Helmet>
        <html lang="en" />
        <title>{title}</title>
        <meta name="description" content={description} />
        
        <link rel="icon" href={logo} sizes="32x32"/>
        <link rel="icon" href={logo} sizes="57x57"/>
        <link rel="icon" href={logo} sizes="76x76"/>
        <link rel="icon" href={logo} sizes="96x96"/>
        <link rel="icon" href={logo} sizes="128x128"/>
        <link rel="icon" href={logo} sizes="192x192"/>
        <link rel="icon" href={logo} sizes="228x228"/>
        
        <link rel="shortcut icon" href={logo} sizes="196x196"/>
        
        <link rel="apple-touch-icon" href={logo} sizes="120x120"/>
        <link rel="apple-touch-icon" href={logo} sizes="152x152"/>
        <link rel="apple-touch-icon" href={logo} sizes="180x180"/>

        <link rel="mask-icon" href={logoVector} color="#ff4400" />
        <meta name="theme-color" content="#fff" />

        <meta property="og:type" content="business.business" />
        <meta property="og:title" content={title} />
        <meta property="og:url" content="/" />
        <meta property="og:image" content={logo} />
      </Helmet>
      {<Header />}
      {fullWidthContent}
      <div className={!fullWidth && 'content'}>{children}</div>
      {!verticalSlider && <Footer />}
    </div>
  )
}

export default Layout

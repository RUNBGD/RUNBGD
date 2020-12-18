import React from 'react'
import { Helmet } from 'react-helmet'
import { useStaticQuery, graphql} from 'gatsby'

import Layout from '../../components/Layout'
import styles from './advertise.module.scss'
import logoImg from '../../img/logo.jpeg'

const AdvertisePage = () => {

  const data = useStaticQuery(graphql`
    query AdvertisePageQuery {
      page:markdownRemark(frontmatter:{templateKey:{eq:"advertise-page"}}) {
        frontmatter {
          seo
          seoTitle
        }
      }
    }
  `)

  return (
    <Layout fullWidthContent={<div className={styles.background}></div>}>
      <Helmet>
        <base target="_blank" href="/" />
        {
          data.page.frontmatter.seoTitle ?
          <title>{data.page.frontmatter.seoTitle}</title>
          :
          <title>Advertise | RUN BGD</title>
        }
        {data.page.frontmatter.seo ?
          <meta
            name="description"
            content={data.page.frontmatter.seo}
          />
          :
          <meta
            name="description"
            content={`RUN BGD advertise page.`}
          />
        }
      </Helmet>
      <main>
        <div className={styles.advertiseCard}>
          <div>
            <div className={styles.lRow}>
              <h1 className={styles.title}>ADVERTISE WITH US</h1>
              <img className={styles.logo} src={logoImg} alt="" />
            </div>
            <p>
              The world is changing quickly, and connecting with a younger
              audience is becoming more challenging than ever. We're here to
              share our learnings from working with some of the top marketers in
              the world in how we've helped them future-proof their business.
            </p>
            <a
              className={styles.actionButton}
              href="mailto:advertise@runbgd.com"
            >
              GET IN TOUCH
            </a>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default AdvertisePage

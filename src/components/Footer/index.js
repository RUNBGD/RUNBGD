import React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'

import styles from './footer.module.scss'

const Footer = () => {
  let data = useStaticQuery(graphql`
    query footerData {
      socialLinks: allMarkdownRemark(
        filter: { frontmatter: { templateKey: { eq: "social-link" } } }
        sort: { fields: [frontmatter___order], order: [ASC] }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              url
              title
              iconDark {
                publicURL
              }
              order
            }
          }
        }
      }
    }
  `)

  return (
    <footer className={styles.footer}>
      <div className={styles.footerLinks}>
        <div className={styles.socialContainer}>
          <p>Connect With Us</p>
          <div className={styles.socialIconsContainer}>
            {data.socialLinks.edges.map(({ node: link }) => {
              return (
                <a href={link.fields.slug}>
                  <img
                    src={link.frontmatter.iconDark.publicURL}
                    alt={`${link.frontmatter.title} logo`}
                  />
                </a>
              )
            })}
          </div>
        </div>
        <hr />
        <div className={styles.columnLinks}>
          <Link to="/terms-of-use">Terms of Use</Link>
          <Link to="/advertise">Advertise</Link>
          <Link to="/contact-us">Contact Us</Link>
          <Link to="/sitemap">Sitemap</Link>
        </div>
      </div>
      <hr />
      <small className={styles.copyrightText}>
        © 2020 RUN BGD, All Rights Reserved.
      </small>
    </footer>
  )
}

export default Footer

import React from 'react'
import {graphql, useStaticQuery, Link} from 'gatsby'

import Layout from '../../components/Layout'
import styles from './sitemap.module.scss'

let Sitemap = () => {

    const data = useStaticQuery(graphql`
    query Sitemap{
        channels:allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "category-page"}}}, sort: {fields: [frontmatter___order]}) {
            edges {
              node {
                fields{
                  slug
                }
                frontmatter {
                  title
                  order
                }
              }
            }
          }
        authors:allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "author-page"}}}) {
            edges {
              node {
                fields{
                  slug
                }
                frontmatter {
                  name
                }
              }
            }
          }
          socialLinks:allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "social-link"}}}) {
            edges {
              node {
                frontmatter {
                  title
                  url
                }
              }
            }
          }
    }
    `)

    return(
        <Layout>
            <main>
            <h1>Sitemap</h1>
            <hr/>
            <div className={styles.sitemapEntries}>
              <div className={styles.entryGroup}>
                <p className={styles.groupParagraph}>Channels</p>
                {data.channels.edges.map(({node:channel}) => 
                    <Link to={channel.fields.slug}>
                        <p>{channel.frontmatter.title}</p>
                    </Link>
                )}
              </div>
              <div className={styles.entryGroup}>
                <p className={styles.groupParagraph}>Authors</p>
                {data.authors.edges.map(({node:author}) => 
                    <Link to={author.fields.slug}>
                        <p>{author.frontmatter.name}</p>
                    </Link>
                )}
              </div>
              <div className={styles.entryGroup}>
                <p className={styles.groupParagraph}>Web Application</p>
                <Link to='/find-places'>
                    <p>Find Places</p>
                </Link>
              </div>
              <div className={styles.entryGroup}>
                <p className={styles.groupParagraph}>Follow Us</p>
                {data.socialLinks.edges.map(({node:social}) => 
                    <Link to={social.frontmatter.url}>
                        <p>Follow us on {social.frontmatter.title}</p>
                    </Link>
                )}
              </div>
              <div className={styles.entryGroup}>
                <p className={styles.groupParagraph}>Info</p>
                <Link to='/privacy-policy'>
                    <p>Privacy Policy</p>
                </Link>
                <Link to='/terms-of-use'>
                    <p>Terms of Use</p>
                </Link>
                <Link to='/contact-us'>
                    <p>Contact Us</p>
                </Link>
              </div>
            </div>
            </main>
        </Layout>
        )
}

export default Sitemap
import React from 'react'
import {graphql, useStaticQuery, Link} from 'gatsby'
import { Helmet } from 'react-helmet'

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
        subchannels:allMarkdownRemark(filter:{frontmatter:{templateKey:{eq:"category-subcategory"}}}){
          edges{
            node{
              fields{
                slug
              }
              frontmatter{
                title
                category
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
          <Helmet>
              <title>Site Map | RUN BGD</title>
              <meta name="description" content='Sitemap on RUN BGD with links to different sections of the site like channels, authors, social networks, our web app, and other links.' />
          </Helmet>
            <main>
            <h1>Sitemap</h1>
            <hr/>
            <div className={styles.sitemapEntries}>
              <div className={styles.entryGroup}>
                <p className={styles.groupParagraph}>Channels</p>
                {data.channels.edges.map(({node:channel}) => {
                  console.log(data.subchannels)
                let subchannels = data.subchannels.edges.filter(({node:subchannel}) => {
                  return channel.frontmatter.title === subchannel.frontmatter.category
                })
                return <React.Fragment>
                    <Link to={channel.fields.slug}>
                        <p className={styles.entry}>{channel.frontmatter.title}</p>
                    </Link>
                    {subchannels &&
                    <ul className={styles.subentryList}>
                      {subchannels.map(({node:subchannel}) => {
                        return <li className={styles.subentry}>
                          <Link to={subchannel.fields.slug}>
                            {subchannel.frontmatter.title}
                          </Link>
                        </li>
                      })}
                    </ul>
                    }
                </React.Fragment>
                }
                )}
              </div>
              <div className={styles.entryGroup}>
                <p className={styles.groupParagraph}>Follow Us</p>
                {data.socialLinks.edges.map(({node:social}) => 
                    <Link to={social.frontmatter.url}>
                        <p className={styles.entry}>Follow us on {social.frontmatter.title}</p>
                    </Link>
                )}
              </div>
              <div className={styles.entryGroup}>
                <p className={styles.groupParagraph}>Info</p>
                <Link to='/privacy-policy'>
                    <p className={styles.entry}>Privacy Policy</p>
                </Link>
                <Link to='/terms-of-use'>
                    <p className={styles.entry}>Terms of Use</p>
                </Link>
                <Link to='/contact-us'>
                    <p className={styles.entry}>Contact Us</p>
                </Link>
                <Link to='/advertise'>
                    <p className={styles.entry}>Advertise</p>
                </Link>
                <Link to='/work-with-us'>
                    <p className={styles.entry}>Work with us</p>
                </Link>
                <Link to='/careers'>
                    <p className={styles.entry}>Careers</p>
                </Link>
              </div>
              <div className={styles.entryGroup}>
                <p className={styles.groupParagraph}>Authors</p>
                {data.authors.edges.map(({node:author}) => 
                    <Link to={author.fields.slug}>
                        <p className={styles.entry}>{author.frontmatter.name}</p>
                    </Link>
                )}
              </div>
              <div className={styles.entryGroup}>
                <p className={styles.groupParagraph}>Web Application</p>
                <Link to='/find-places'>
                    <p className={styles.entry}>Find Places</p>
                </Link>
              </div>
              <div className={styles.entryGroup}>
                <p className={styles.groupParagraph}>Merch</p>
                <Link to='/shop'>
                    <p className={styles.entry}>Shop</p>
                </Link>
                <Link to='/shop'>
                    <p className={styles.entry}>Cart</p>
                </Link>
              </div>
            </div>
            </main>
        </Layout>
        )
}

export default Sitemap
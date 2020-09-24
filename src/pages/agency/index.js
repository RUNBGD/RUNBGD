import React from 'react'
import Image from 'gatsby-image'
import {useStaticQuery, graphql} from 'gatsby'
import remark from 'remark'
import remarkHTML from 'remark-html'

import Layout from '../../components/Layout'
import styles from './agency.module.scss'
import {HTMLContent} from '../../components/Content'

const toHTML = value => remark().use(remarkHTML).processSync(value).toString()

const AgencyPage = () => {

    const data = useStaticQuery(graphql`
        query AgencyPage{
            page:markdownRemark(frontmatter:{templateKey:{eq: "agency-page"}}){
                frontmatter{
                    sections{
                        image{
                            childImageSharp{
                                fluid(maxWidth:770, quality:100){
                                    ...GatsbyImageSharpFluid
                                }
                            }
                        }
                        backgroundColor
                        imageOnRight
                        heading
                        body
                    }
                }
            }
        }
    `)

    return(
        <Layout
            fullWidthContent={
                data.page.frontmatter.sections.map(section => {
                    console.log(section.backgroundColor)
                    return(
                        <section className={`${styles.contentSection} ${section.imageOnRight && styles.reverseSection}`} style={{backgroundColor: `#${section.backgroundColor}`}}>
                            <div className={styles.heroBanner}>

                            </div>
                            <div className={styles.sectionImage}>
                                <Image fluid={section.image.childImageSharp.fluid} alt=''/>
                            </div>
                            <div className={styles.sectionContent}>
                                <h3>{section.heading}</h3>
                                <div className={styles.body}>
                                    <HTMLContent content={section.body}/>
                                </div>
                            </div>
                        </section>
                    )
    
                })
            }
        >
        </Layout>
    )
}

export default AgencyPage
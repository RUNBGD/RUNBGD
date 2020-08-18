import React from 'react'
import {useStaticQuery, graphql} from 'gatsby'
import Image from 'gatsby-image'

import Layout from '../../components/Layout'
import {HTMLContent} from '../../components/Content'
import styles from './work-with-us.module.scss'

const WorkWithUsPage = () => {

    const data = useStaticQuery(graphql`
        query WorkWithUsData{
            markdownRemark(frontmatter:{templateKey: {eq: "work-with-us-page"}}){
                frontmatter{
                    coverImage{
                        childImageSharp{
                            fluid(maxWidth:1920, quality:64){
                                ...GatsbyImageSharpFluid
                            }
                        }
                    }
                }
                html
            }
        }
    `)

    return(
        <Layout
            fullWidthContent={
                    <div className={styles.cover}>
                        <Image fluid={data.markdownRemark.frontmatter.coverImage.childImageSharp.fluid} alt=''/>
                    </div>
            }
        >
            <main>
                <HTMLContent content={data.markdownRemark.html} className={styles.postBody}/>
            </main>
        </Layout>
    )
}

export default WorkWithUsPage
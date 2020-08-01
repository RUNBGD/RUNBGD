import React from 'react'
import Image from 'gatsby-image'
import {graphql} from 'gatsby'

import Layout from '../../components/Layout'
import LatestPosts from '../../components/LatestPosts'
import BigPostsCarousel from '../../components/BigPostsCarousel'

let PageTitleAndBody = ({data}) => {

    return(
        <Layout>
          <main>
            <h1>{data.markdownRemark.frontmatter.title}</h1>
            <hr/>
            {data.markdownRemark.html}
          </main>
        </Layout>
        )
    }
    
    export const pageQuery = graphql`
      query TermsOfUsePage($id: String!){
        markdownRemark(id:{eq: $id}) {
          id
          frontmatter {
            title
          }
          html
        }
      }
    `
    export default PageTitleAndBody
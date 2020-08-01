import React from 'react'
import {graphql} from 'gatsby'

import Layout from '../../components/Layout'
import {HTMLContent} from '../../components/Content'


let PageTitleAndBody = ({data}) => {

    return(
        <Layout>
          <main>
            <h1>{data.markdownRemark.frontmatter.title}</h1>
            <hr/>
            <HTMLContent content={data.markdownRemark.html}/>
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
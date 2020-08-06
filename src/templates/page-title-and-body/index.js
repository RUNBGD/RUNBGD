import React from 'react'
import {graphql} from 'gatsby'
import {Helmet} from 'react-helmet'

import Layout from '../../components/Layout'
import {HTMLContent} from '../../components/Content'

export const PageTitleAndBodyTemplate = ({data}) => {
  return(
    <main>
      <Helmet>
        <title>{data.markdownRemark.frontmatter.title} | RUN BGD</title>
        <meta name="description" content={data.markdownRemark.html} />
      </Helmet>
      <h1>{data.markdownRemark.frontmatter.title}</h1>
      <hr/>
      {data.html ? 
        <div>{data.html}</div>
          :
        <HTMLContent content={data.markdownRemark.html}/>
      }
    </main>
  )
}

let PageTitleAndBody = ({data}) => {

    return(
        <Layout>
          <PageTitleAndBodyTemplate data={data}/>
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
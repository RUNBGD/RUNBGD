import React from 'react'

let CategoryPage = (data) => {

    console.log(data)

    return(
            <div>{data.markdownRemark.frontmatter.title}</div>
        )
    }
    
    export const pageQuery = graphql`
      query CategoryByID($id: String!) {
        markdownRemark(id: { eq: $id }) {
          id
          frontmatter {
            title
          }
        }
      }
    `
    export default CategoryPage
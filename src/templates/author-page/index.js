import React from 'react'

let AuthorPage = (data) => {

console.log(data)

return(
        <div>{data.markdownRemark.frontmatter.name}</div>
    )
}

export const pageQuery = graphql`
    query AuthortByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
        id
        frontmatter {
          name
        }
    }
    }
`
export default AuthorPage
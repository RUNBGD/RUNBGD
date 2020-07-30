import React, {useState} from 'react'
import {useStaticQuery, graphql} from 'gatsby'

import InfiniteScroll from 'react-infinite-scroll-component';
import PostCover from '../PostCover'


let LatestPosts = () => {

    
    let [numOfLatestPosts, setNumOfLatestPosts] = useState(5)

    let allPosts = useStaticQuery( graphql`
    query allPosts {
        allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "blog-post"}}}){
        edges {
            node{
              fields{
                slug
              }
            frontmatter{
                title
                category
                coverImage{
                childImageSharp {
                    fluid(maxWidth:1000, quality: 64){
                    ...GatsbyImageSharpFluid
                    }
                }
                }
            }
            }
        }
        }
        allCategories: allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "category-page"}}}){
          edges {
              node{
                fields{
                  slug
                }
              frontmatter{
                  title
              }
              }
          }
          }
    }
    `)

    
    function loadMoreLatestPosts(){
        setNumOfLatestPosts(prevState => prevState + 5)
    }

    return(
        <InfiniteScroll
            scrollThreshold='0px'
            dataLength={numOfLatestPosts}
            next={loadMoreLatestPosts}
            hasMore={numOfLatestPosts < allPosts.allMarkdownRemark.edges.length ? true : false}
            endMessage={
              <p style={{textAlign: 'center'}}>
                <b>You have seen it all! Come later</b>
              </p>
            }
          >
            {allPosts.allMarkdownRemark.edges.map(({node:post}, index) => {
              if(index < numOfLatestPosts){
                let category = allPosts.allCategories.edges.filter(({node:category}) => post.frontmatter.category === category.frontmatter.title)
                return <PostCover post={post} categorySlug={category[0].node.fields.slug}/>
              }
          })}
          </InfiniteScroll>
    )
}

export default LatestPosts
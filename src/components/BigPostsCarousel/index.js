import React, {useState} from 'react'
import SwiperCore, {Pagination} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import swiperStyles from 'swiper/swiper.scss';
import paginationSwiperStyles from 'swiper/components/pagination/pagination.scss'
import Image from 'gatsby-image'
import {Link, useStaticQuery, graphql} from 'gatsby'

import styles from './big-posts-carousel.module.scss';

console.log(swiperStyles, paginationSwiperStyles)



SwiperCore.use([Pagination])

const BigPostsCarousel = ({posts}) => {

    let data = useStaticQuery(graphql`
      query allCategories{
        allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "category-page"}}}){
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
        
          authors:allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "author-page"}}}){
            edges {
                node{
                  fields{
                    slug
                  }
                frontmatter{
                    name
                }
                }
            }
            }
      }
    `)

    let [activeSlide, setActiveSlide] = useState(0)

    return(
      <div>
        <Swiper
          spaceBetween={50}
          pagination={{ el:`.${styles.swiperPagination}`,clickable: true }}
          loop={true}
          className={styles.carousel}
          onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
        >
          {posts.allMarkdownRemark.edges.map(({node: post}, index) => {
            
            let category = data.allMarkdownRemark.edges.find(({node:category}) => post.frontmatter.category === category.frontmatter.title)

            let categorySlug = category.node.fields.slug
            
            let author = data.authors.edges.find(({node:author}) => post.frontmatter.author === author.frontmatter.name)

            let authorSlug = author.node.fields.slug

            return(
              <SwiperSlide className={index === activeSlide && styles.activeSlide}>
                <div className={styles.post}>
                  <Link to={post.fields.slug}>
                    <h3>
                      {post.frontmatter.title}
                    </h3>
                  </Link> 
                  <div className={styles.postDetails}>
                    <Link to={categorySlug}>
                      <span className={styles.postCategory}>{post.frontmatter.category}</span>
                    </Link>
                    <Link to={authorSlug}>
                      <p className={styles.postAuthor}>by <a>{post.frontmatter.author}</a></p>
                    </Link>
                  </div>
                  <Link to={post.fields.slug}>
                    <Image fluid={post.frontmatter.coverImage.childImageSharp.fluid} alt='' className={styles.postCover} />
                  </Link>
                </div>
              </SwiperSlide>
            )
          })}
          <div className={styles.swiperPagination}></div>
        </Swiper>
        <hr/>
      </div>
    )
}   

export default BigPostsCarousel
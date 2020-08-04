import React, {useState} from 'react'
import SwiperCore, {Pagination} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import swiperStyles from 'swiper/swiper.scss';
import paginationSwiperStyles from 'swiper/components/pagination/pagination.scss'
import Image from 'gatsby-image'
import {Link, useStaticQuery, graphql} from 'gatsby'

import styles from './secondary-posts-carousel.module.scss';

console.log(swiperStyles, paginationSwiperStyles)

SwiperCore.use([Pagination])

const BigPostsCarousel = ({posts, heading, displayCategory, onlyMobile}) => {

  let data = useStaticQuery(graphql`
      query categories{
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
      <div className={onlyMobile && styles.onlyMobile}>
        <h2>{heading}</h2>
        <Swiper
          pagination={{ el:`.${styles.swiperPagination}`,clickable: true }}
          loop={posts.length > 1 ? true : false}
          className={styles.carousel}
          onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
          slidesPerView='auto'
        >
          {posts.map(({node:post}, index) => {

            let category = data.allMarkdownRemark.edges.find(({node:category}) => post.frontmatter.category === category.frontmatter.title)

            let categorySlug = category.node.fields.slug
            
            let author = data.authors.edges.find(({node:author}) => post.frontmatter.author === author.frontmatter.name)

            let authorSlug = author.node.fields.slug

            return(
              <SwiperSlide className={`${styles.slide} ${posts.length < 2 && styles.isOnlySlide} ${index === activeSlide ? styles.activeSlide : styles.inactiveSlide}`}>
                <div className={styles.post}>
                  <div className={styles.postImage}>
                    <Link to={post.fields.slug}>
                      <Image fluid={post.frontmatter.coverImage.childImageSharp.fluid} alt='' className={styles.postCover}/>
                    </Link>
                  </div>
                  <div className={styles.postDetails}>
                    {displayCategory && 
                      <Link to={categorySlug}>
                        <span className={styles.postCategory}>{post.frontmatter.category}</span>
                      </Link>
                    }
                    <Link to={authorSlug}>
                      <p className={styles.postAuthor}>By <a>{post.frontmatter.author}</a></p>
                    </Link>
                  </div>
                  <Link to={post.fields.slug}>
                    <p className={styles.postHeading}>
                      {post.frontmatter.title}
                    </p>
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
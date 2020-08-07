import React, {useState} from 'react'
import SwiperCore, {Pagination, Navigation} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import swiperStyles from 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import paginationSwiperStyles from 'swiper/components/pagination/pagination.scss'
import Image from 'gatsby-image'
import {Link, useStaticQuery, graphql} from 'gatsby'

import styles from './secondary-posts-carousel.module.scss';
import swiperArrow from '../../img/right-arrow.svg'
import PostImage from '../PostImage';

console.log(swiperStyles, paginationSwiperStyles)

SwiperCore.use([Pagination, Navigation])

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
          onInit={(swiper) => {swiper.slideNext(100,() => swiper.slidePrev())}}
          navigation={{
            nextEl: `.${styles.swiperNextEl}`,
            prevEl: `.${styles.swiperPrevEl}`
          }}
        >
          {posts.map(({node:post}, index) => {

            let category = data.allMarkdownRemark.edges.find(({node:category}) => post.frontmatter.category === category.frontmatter.title)

            let categorySlug = category.node.fields.slug
            
            let author = data.authors.edges.find(({node:author}) => post.frontmatter.author === author.frontmatter.name)

            let authorSlug = author.node.fields.slug

            return(
              <SwiperSlide className={`${styles.slide} ${posts.length < 2 && styles.isOnlySlide} ${index === activeSlide ? styles.activeSlide : styles.inactiveSlide}`}>
                <div className={styles.post}>
                  <PostImage slug={post.fields.slug} image={post.frontmatter.coverImage.childImageSharp.fluid}/>
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
          <img className={styles.swiperPrevEl} src={swiperArrow} alt='prev slide' />
          <img className={styles.swiperNextEl} src={swiperArrow} alt='next slide'/>
        </Swiper>
        <hr/>
      </div>
    )
}   

export default BigPostsCarousel
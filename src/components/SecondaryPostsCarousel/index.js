import React, { useState } from 'react'
import SwiperCore, { Pagination, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import swiperStyles from 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import paginationSwiperStyles from 'swiper/components/pagination/pagination.scss'
import Image from 'gatsby-image'
import { Link, useStaticQuery, graphql } from 'gatsby'

import styles from './secondary-posts-carousel.module.scss'
import swiperArrow from '../../img/right-arrow.svg'
import PostImage from '../PostImage'

console.log(swiperStyles, paginationSwiperStyles)

SwiperCore.use([Pagination, Navigation])

const BigPostsCarousel = ({ posts, heading, displayCategory, onlyMobile }) => {
  let data = useStaticQuery(graphql`
    query categories {
      allMarkdownRemark(
        filter: { frontmatter: { templateKey: { eq: "category-page" } } }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
            }
          }
        }
      }
      authors: allMarkdownRemark(
        filter: { frontmatter: { templateKey: { eq: "author-page" } } }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              name
            }
          }
        }
      }
    }
  `)

  let [activeSlide, setActiveSlide] = useState()

  return (
    <div className={onlyMobile && styles.onlyMobile}>
      <h2>{heading}</h2>
      <Swiper
        pagination={{ el: `.${styles.swiperPagination}`, clickable: true }}
        loop={posts.length > 1 ? true : false}
        className={styles.carousel}
        onSlideChange={(swiper) => {
          setActiveSlide(swiper.realIndex)
        }}
        slidesPerView="auto"
        onInit={() => setActiveSlide(0)}
        navigation={{
          nextEl: `.${styles.swiperNextEl}`,
          prevEl: `.${styles.swiperPrevEl}`,
        }}
      >
        {posts.map(({ node: post }, index) => {
          let categorySlug = undefined
          let authorSlug = undefined

          let category =
            data.allMarkdownRemark &&
            data.allMarkdownRemark.edges &&
            data.allMarkdownRemark.edges.length > 0 &&
            data.allMarkdownRemark.edges.find(({ node: category }) => {
              if (post.frontmatter.category && category.frontmatter.title) {
                return post.frontmatter.category === category.frontmatter.title
              } else {
                return false
              }
            })

          if (category) {
            categorySlug = category.node.fields.slug
          }

          let author =
            data.authors &&
            data.authors.edges &&
            data.authors.edges.length > 0 &&
            data.authors.edges.find(({ node: author }) => {
              if (post.frontmatter.author && author.frontmatter.name) {
                return post.frontmatter.author === author.frontmatter.name
              } else {
                return false
              }
            })

          if (author) {
            authorSlug = author.node.fields.slug
          }

          return (
            <SwiperSlide
              className={`${styles.slide} ${
                posts.length < 2 && styles.isOnlySlide
              } ${
                index === activeSlide
                  ? styles.activeSlide
                  : styles.inactiveSlide
              }`}
            >
              <div className={styles.post}>
<<<<<<< HEAD
                {post.frontmatter.coverImage && (
                  <PostImage
                    slug={post.fields.slug}
                    image={post.frontmatter.coverImage}
                  />
                )}
=======
                {
                  post.frontmatter.coverImage &&
                  <PostImage
                    slug={post.fields.slug}
                    image={post.frontmatter.coverImage.childImageSharp.fluid}
                  />

                }
>>>>>>> 12dc5530e6796f73c9d4d253f121920e012f27fa
                <div className={styles.postDetails}>
                  {displayCategory && categorySlug && (
                    <Link to={categorySlug}>
                      <span className={styles.postCategory}>
                        {post.frontmatter.category}
                      </span>
                    </Link>
                  )}
                  {authorSlug && (
                    <Link to={authorSlug}>
                      <p className={styles.postAuthor}>
                        By <a>{post.frontmatter.author}</a>
                      </p>
                    </Link>
                  )}
                </div>
                <Link to={post.fields.slug}>
                  <p className={styles.postHeading}>{post.frontmatter.title}</p>
                </Link>
              </div>
            </SwiperSlide>
          )
        })}
        <div className={styles.swiperPagination}></div>
        <img
          className={styles.swiperPrevEl}
          src={swiperArrow}
          alt="prev slide"
        />
        <img
          className={styles.swiperNextEl}
          src={swiperArrow}
          alt="next slide"
        />
      </Swiper>
      <hr />
    </div>
  )
}

export default BigPostsCarousel

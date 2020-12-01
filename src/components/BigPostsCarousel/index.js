import React, { useState } from 'react'
import SwiperCore, { Pagination, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import swiperStyles from 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import paginationSwiperStyles from 'swiper/components/pagination/pagination.scss'
import { Link, useStaticQuery, graphql } from 'gatsby'

import styles from './big-posts-carousel.module.scss'
import swiperArrow from '../../img/right-arrow.svg'
import PostImage from '../PostImage'
import PostCategoryTag from '../PostCategoryTag'

console.log(swiperStyles, paginationSwiperStyles)

SwiperCore.use([Pagination, Navigation])

const BigPostsCarousel = ({ posts }) => {
  let data = useStaticQuery(graphql`
    query allCategories {
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

  let [activeSlide, setActiveSlide] = useState(0)

  return (
    <div>
      <Swiper
        spaceBetween={50}
        navigation={{
          nextEl: `.${styles.swiperNextEl}`,
          prevEl: `.${styles.swiperPrevEl}`,
        }}
        pagination={{ el: `.${styles.swiperPagination}`, clickable: true }}
        loop={true}
        className={styles.carousel}
        onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
      >
        {posts.edges.length > 0 &&
          posts.edges.map(({ node: post }, index) => {
            let categorySlug = undefined
            let authorSlug = undefined

            let category =
              data.allMarkdownRemark.edges.length > 0 &&
              data.allMarkdownRemark.edges.find(({ node: category }) => {
                if (post.frontmatter.category && category.frontmatter.title) {
                  return (
                    post.frontmatter.category === category.frontmatter.title
                  )
                } else {
                  return false
                }
              })

            let author =
              data.authors.edges.length > 0 &&
              data.authors.edges.find(({ node: author }) => {
                if (post.frontmatter.author && author.frontmatter.name) {
                  return post.frontmatter.author === author.frontmatter.name
                } else {
                  return false
                }
              })

            if (category) {
              categorySlug = category.node.fields.slug
            }
            if (author) {
              authorSlug = author.node.fields.slug
            }

            return (
              <SwiperSlide
                className={`${styles.slide} ${
                  index === activeSlide
                    ? styles.activeSlide
                    : styles.notActiveSlide
                }`}
              >
                <div className={styles.post}>
                  <Link to={post.fields.slug}>
                    <h2>{post.frontmatter.title}</h2>
                  </Link>
                  <div className={styles.postDetails}>
                    {post.frontmatter.category && (
                      <PostCategoryTag
                        slug={categorySlug}
                        text={post.frontmatter.category}
                      />
                    )}
                    {post.frontmatter.author && (
                      <Link to={authorSlug}>
                        <p className={styles.postAuthor}>
                          by <a>{post.frontmatter.author}</a>
                        </p>
                      </Link>
                    )}
                  </div>
                  <div className={styles.postImage}>
                    <PostImage
                      slug={post.fields.slug}
                      image={post.frontmatter.coverImage}
                    />
                  </div>
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

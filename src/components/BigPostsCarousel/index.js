import React, {useState} from 'react'
import SwiperCore, {Pagination} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import swiperStyles from 'swiper/swiper.scss';
import paginationSwiperStyles from 'swiper/components/pagination/pagination.scss'
import Image from 'gatsby-image'

import styles from './big-posts-carousel.module.scss';

console.log(swiperStyles, paginationSwiperStyles)



SwiperCore.use([Pagination])

const BigPostsCarousel = ({posts}) => {

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
            console.log(post)
            return(
              <SwiperSlide className={index === activeSlide && styles.activeSlide}>
                <div className={styles.post}> 
                  <h3>
                    {post.frontmatter.title}
                  </h3>
                  <div className={styles.postDetails}>
                    <span className={styles.postCategory}>{post.frontmatter.category}</span>
                    <p className={styles.postAuthor}>by <a>{post.frontmatter.author}</a></p>
                  </div>
                  {
                    post.frontmatter.coverImage && <Image fluid={post.frontmatter.coverImage.childImageSharp.fluid} alt='' className={styles.postCover} />
                  }
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
import React, {useState} from 'react'
import SwiperCore, {Pagination} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import swiperStyles from 'swiper/swiper.scss';
import paginationSwiperStyles from 'swiper/components/pagination/pagination.scss'
import Image from 'gatsby-image'

import styles from './secondary-posts-carousel.module.scss';

console.log(swiperStyles, paginationSwiperStyles)

SwiperCore.use([Pagination])

const BigPostsCarousel = ({posts, heading}) => {

    let [activeSlide, setActiveSlide] = useState(0)

    return(
      <div>
        <h2>{heading}</h2>
        <Swiper
          pagination={{ el:`.${styles.swiperPagination}`,clickable: true }}
          loop={posts.length > 1 ? true : false}
          className={styles.carousel}
          onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
          slidesPerView='auto'
        >
          {posts.map((post, index) => {
            return(
              <SwiperSlide className={`${styles.slide} ${posts.length < 2 && styles.isOnlySlide} ${index === activeSlide ? styles.activeSlide : styles.inactiveSlide}`}>
                <div className={styles.post}>
                  <div className={styles.postImage}>
                    <Image fluid={post.node.frontmatter.coverImage.childImageSharp.fluid} alt='' className={styles.postCover}/>
                  </div>
                  <div className={styles.postDetails}>
                    <span className={styles.postCategory}>{post.node.frontmatter.category}</span>
                  </div>
                  <p className={styles.postHeading}>
                    {post.node.frontmatter.title}
                  </p>
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
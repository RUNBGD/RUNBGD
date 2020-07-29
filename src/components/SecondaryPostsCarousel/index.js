import React, {useState} from 'react'
import SwiperCore, {Pagination} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import swiperStyles from 'swiper/swiper.scss';
import paginationSwiperStyles from 'swiper/components/pagination/pagination.scss'
console.log(swiperStyles, paginationSwiperStyles)


import styles from './secondary-posts-carousel.module.scss';

import postImg from '../../img/example.png';

SwiperCore.use([Pagination])

const BigPostsCarousel = ({posts}) => {

    let [activeSlide, setActiveSlide] = useState(0)

    return(
      <div>
        <Swiper
          pagination={{ el:`.${styles.swiperPagination}`,clickable: true }}
          loop={true}
          className={styles.carousel}
          onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
          slidesPerView='auto'
        >
          {posts.map((post, index) => {
            return(
              <SwiperSlide className={`${styles.slide} ${index === activeSlide ? styles.activeSlide : styles.inactiveSlide}`}>
                <div className={styles.post}> 
                  <img src={postImg} alt='' className={styles.postImage}/>
                  <div className={styles.postDetails}>
                    <span className={styles.postCategory}>{post.category}</span>
                  </div>
                  <p className={styles.postHeading}>
                    {post.heading}
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
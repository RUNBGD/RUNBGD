import React, {useState} from 'react'
import SwiperCore, {Pagination} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';
import 'swiper/components/pagination/pagination.scss';


import styles from './big-posts-carousel.module.scss';

import postImg from '../../img/example.png';

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
          {posts.map((post, index) => {
            return(
              <SwiperSlide className={index === activeSlide ? styles.activeSlide : styles.inactiveSlide}>
                <div className={styles.post}> 
                  <h3>
                    {post.heading}
                  </h3>
                  <div className={styles.postDetails}>
                    <span className={styles.postCategory}>{post.category}</span>
                    <p className={styles.postAuthor}>by <a>{post.author}</a></p>
                  </div>
                  <img className={styles.postCover} src={postImg} alt=''/>
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
import React from 'react'
import SwiperCore, { Pagination, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import swiperStyles from 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import paginationSwiperStyles from 'swiper/components/pagination/pagination.scss'

import swiperArrow from '../../img/right-arrow.svg'
import styles from './full-width-slider.module.scss'

console.log(swiperStyles, paginationSwiperStyles)

SwiperCore.use([Pagination, Navigation])

const FullWidthSlider = ({ children }) => {
  return (
    <div>
      <Swiper
        navigation={{
          nextEl: `.${styles.swiperNextEl}`,
          prevEl: `.${styles.swiperPrevEl}`,
        }}
        slidesPerView="auto"
        pagination={{ el: `.${styles.swiperPagination}`, clickable: true }}
        loop={true}
        className={styles.carousel}
        centeredSlides={true}
      >
        {children}
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
    </div>
  )
}

export default FullWidthSlider

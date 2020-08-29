import React, {useState, useEffect} from 'react'
import SwiperCore, {Pagination, Navigation, Thumbs} from 'swiper'
import {Swiper, SwiperSlide} from 'swiper/react'
import swiperStyles from 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import thumbsStyles from 'swiper/components/thumbs/thumbs.scss'
import paginationSwiperStyles from 'swiper/components/pagination/pagination.scss'
import Image from 'gatsby-image'


import styles from './shop-product-page.module.scss'
import Layout from '../../components/Layout'
import sliderArrow from '../../img/right-arrow.svg'

console.log(swiperStyles, paginationSwiperStyles, thumbsStyles);


SwiperCore.use([Pagination, Navigation, Thumbs]);

const ShopProductPage = ({data}) => {

    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [selectedSize, setSelectedSize] = useState(undefined);

    return <Layout fullWidth={true}>
        <main className={styles.fullWidth}>
            <div className={styles.product}>
                <div className={styles.productSlider}>
                    <div className={styles.thumbsSliderContainer}>
                        <Swiper
                            direction='vertical'
                            slidesPerView={4}
                            spaceBetween={20}
                            loop={false}
                            navigation={{
                                nextEl:`.${styles.swiperNextEl}`,
                                prevEl: `.${styles.swiperPrevEl}`
                            }}
                            onSwiper={setThumbsSwiper}
                            className={styles.thumbnailSlider}
                        >
                            {data.product.frontmatter.images.map((image, index) => {
                                return <SwiperSlide className={styles.thumbnailSlide} key={index}>
                                    <div className={styles.thumbnail}>
                                        <Image className={styles.thumbnailImage} fluid={image.image.childImageSharp.fluid} alt=''/>
                                    </div>
                                </SwiperSlide>
                            })}
                            <div className={styles.swiperNextEl}>
                                <img src={sliderArrow} alt=''/>
                            </div>
                            <div className={styles.swiperPrevEl}>
                                <img src={sliderArrow} alt=''/>
                            </div>
                        </Swiper>
                    </div>
                    <div className={styles.mainSliderContainer}>
                        <Swiper
                            direction='vertical'
                            thumbs={{swiper: thumbsSwiper}}
                            slidesPerView={1}
                            loop={true}
                            className={styles.mainSlider}
                        >
                            {data.product.frontmatter.images.map((image, index) => {
                                return <SwiperSlide key={index}>
                                    <Image className={styles.mainImage} fluid={image.image.childImageSharp.fluid} alt=''/>
                                </SwiperSlide>
                            })}
                        </Swiper>
                    </div>
                </div>
                <div className={styles.productInformation}>
                    <h2 className={styles.productTitle}>{data.product.frontmatter.title}</h2>
                    <p className={styles.productPrice}>€{data.product.frontmatter.price}</p>
                    <hr/>
                    <p>Sizes</p>
                    <div className={styles.sizes}>
                        {data.product.frontmatter.sizes.map((size, index) => {
                            return <div onClick={() => {size.available && setSelectedSize(index)}} className={`${styles.size} ${!size.available && styles.notAvailable} ${selectedSize === index && styles.selected}`} key={index}>
                                {size.size}
                            </div>
                        })}
                    </div>
                    <button class={styles.callToActionButton}>Add to bag</button>
                    <hr/>
                    <h3>Description</h3>
                    <p className={styles.productDescription}>{data.product.frontmatter.description}</p>
                </div>
            </div>
        </main>
    </Layout>
}

export const pageQuery = graphql`
      query ShopProductByID($id: String!) {
        product: markdownRemark(id: { eq: $id }) {
            fields{
                slug
            }
            frontmatter{
                title
                price
                images{
                    image{
                        childImageSharp{
                            fluid(maxWidth:900, quality:64){
                                ...GatsbyImageSharpFluid
                            }
                        }
                    }
                }
                sizes{
                    size
                    available
                }
                category
                description
            }
        }
      }
    `

export default ShopProductPage
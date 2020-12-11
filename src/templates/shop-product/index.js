import React, { useState, useEffect } from 'react'
import SwiperCore, { Pagination, Navigation, Thumbs } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import swiperStyles from 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import thumbsStyles from 'swiper/components/thumbs/thumbs.scss'
import paginationSwiperStyles from 'swiper/components/pagination/pagination.scss'
import Image from 'gatsby-image'
import { graphql } from 'gatsby'
import { useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet'

import getProductAvailability from '../../utils/getProductAvailability'
import styles from './shop-product-page.module.scss'
import Layout from '../../components/Layout'
import sliderArrow from '../../img/right-arrow.svg'
import ProductSize from '../../components/ProductSize'

console.log(swiperStyles, paginationSwiperStyles, thumbsStyles)

SwiperCore.use([Pagination, Navigation, Thumbs])

const ShopProductPage = ({ data }) => {
  const dispatch = useDispatch()

  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [selectedSize, setSelectedSize] = useState(undefined)
  const [alreadyAddedToCartMessage, setAlreadyAddedToCartMessage] = useState(
    undefined
  )
  const [productSold, setProductSold] = useState(false)

  useEffect(() => {
    addToStateFromLocalStorage()
  }, [])

  useEffect(() => {
    if(productSold){
      setAlreadyAddedToCartMessage('This product has been sold out!')
    }else{
      setAlreadyAddedToCartMessage(undefined)
    }
  }, [productSold])

  useEffect(() => {
    getProductAvailability(
      data.product.fields.slug,
      selectedSize,
      data.product.frontmatter.sizes,
      setProductSold
    )
  }, [selectedSize])

  function addToStateFromLocalStorage() {
    if (JSON.parse(localStorage.getItem('cartItems'))) {
      dispatch({
        type: 'ADD_FROM_LOCAL_STORAGE',
        payload: JSON.parse(localStorage.getItem('cartItems')),
      })
    }
  }

  const addProductToCart = () => {
    if (JSON.parse(localStorage.getItem('cartItems'))) {
      if (
        JSON.parse(localStorage.getItem('cartItems')).findIndex((product) => {
          if (
            product.id == data.product.fields.slug &&
            product.size == selectedSize
          ) {
            return true
          }
        }) == -1
      ) {
        setAlreadyAddedToCartMessage(undefined)
        return dispatch({
          type: 'ADD_PRODUCT',
          payload: {
            product: data.product,
            size: selectedSize,
            quantity: 1,
            id: data.product.fields.slug,
          },
        })
      } else {
        setAlreadyAddedToCartMessage(
          'You have already added that item to cart!'
        )
      }
    } else {
      setAlreadyAddedToCartMessage(undefined)
      return dispatch({
        type: 'ADD_PRODUCT',
        payload: {
          product: data.product,
          size: selectedSize,
          quantity: 1,
          id: data.product.fields.slug,
        },
      })
    }
  }

  useEffect(() => {
    if(!data.product.frontmatter.sizes){
      setAlreadyAddedToCartMessage('This product is currently not available.')
    }else if(data.product.frontmatter.sizes){
      data.product.frontmatter.sizes.length <= 0 &&
      setAlreadyAddedToCartMessage('This product is currently not available.')
    }
  }, [data.product])

  return (
    <Layout fullWidth={true}>
      <Helmet>
        <title>{data.product.frontmatter.title} | RUN BGD</title>
        <meta
          name="description"
          content={`Official RUN BGD Shop. Buy anything from t-shirts to miscellaneous accessories.`}
        />
      </Helmet>
      <main className={styles.fullWidth}>
        <div className={styles.product}>
          <div className={styles.productSlider}>
            <div className={styles.thumbsSliderContainer}>
              <Swiper
                direction="horizontal"
                breakpoints={{
                  1200: {
                    direction: 'vertical',
                    spaceBetween: 20,
                  },
                }}
                slidesPerView={4}
                spaceBetween={10}
                loop={false}
                navigation={{
                  nextEl: `.${styles.swiperNextEl}`,
                  prevEl: `.${styles.swiperPrevEl}`,
                }}
                onSwiper={setThumbsSwiper}
                className={styles.thumbnailSlider}
              >
                {data.product.frontmatter.images.length > 0 &&
                  data.product.frontmatter.images.map((image, index) => {
                    return (
                      <SwiperSlide
                        className={styles.thumbnailSlide}
                        key={index}
                      >
                        <div className={styles.thumbnail}>
                          {image.image &&
                            image.image.childImageSharp &&
                            image.image.childImageSharp.fluid && (
                              <Image
                                className={styles.thumbnailImage}
                                fluid={image.image.childImageSharp.fluid}
                                alt=""
                              />
                            )}
                        </div>
                      </SwiperSlide>
                    )
                  })}
                <div className={styles.swiperNextEl}>
                  <img src={sliderArrow} alt="" />
                </div>
                <div className={styles.swiperPrevEl}>
                  <img src={sliderArrow} alt="" />
                </div>
              </Swiper>
            </div>
            <div className={styles.mainSliderContainer}>
              <Swiper
                direction="horizontal"
                breakpoints={{
                  1200: {
                    direction: 'vertical',
                    spaceBetween: 0,
                  },
                }}
                spaceBetween={20}
                thumbs={{ swiper: thumbsSwiper }}
                slidesPerView={1}
                loop={true}
                className={styles.mainSlider}
              >
                {data.product.frontmatter.images.length > 0 &&
                  data.product.frontmatter.images.map((image, index) => {
                    return (
                      <SwiperSlide key={index}>
                        {image.image &&
                          image.image.childImageSharp &&
                          image.image.childImageSharp.fluid && (
                            <Image
                              className={styles.mainImage}
                              fluid={image.image.childImageSharp.fluid}
                              alt=""
                            />
                          )}
                      </SwiperSlide>
                    )
                  })}
              </Swiper>
            </div>
          </div>
          <div className={styles.productInformation}>
            <h2 className={styles.productTitle}>
              {data.product.frontmatter.title}
            </h2>
            <p className={styles.productPrice}>
              €{data.product.frontmatter.price}
            </p>
            <hr />
            {data.product.frontmatter.sizes != undefined && data.product.frontmatter.sizes.length > 0 && (
              <React.Fragment>
                <p>Sizes</p>
                <div className={styles.sizes}>
                  {data.product.frontmatter.sizes.length > 0 &&
                    data.product.frontmatter.sizes.map((size, index) => {
                      return (
                        <ProductSize size={size} selectedSize={selectedSize} index={index} setSelectedSize={setSelectedSize} data={data}/>
                      )
                    })}
                </div>
              </React.Fragment>
            )}
            {
              data.product.frontmatter.sizes &&
              data.product.frontmatter.sizes.length > 0 &&
              <button
                class={styles.callToActionButton}
                onClick={() => {
                  if(productSold){
                    setAlreadyAddedToCartMessage('This product has been sold out!')
                  }else if (
                    selectedSize != undefined
                  ){
                    setAlreadyAddedToCartMessage(undefined)
                    addProductToCart()
                  }else if(data.product.frontmatter.sizes.length <= 0){
                    setAlreadyAddedToCartMessage('This product is currently not available.')
                  }else {
                    setAlreadyAddedToCartMessage('Please choose size.')
                  }
                }}
              >
                Add to bag
              </button>
            }
            {alreadyAddedToCartMessage && (
              <div className={styles.error}>{alreadyAddedToCartMessage}</div>
            )}
            <hr />
            <h3>Description</h3>
            <p className={styles.productDescription}>
              {data.product.frontmatter.description}
            </p>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export const pageQuery = graphql`
  query ShopProductByID($id: String!) {
    product: markdownRemark(id: { eq: $id }) {
      id
      fields {
        slug
      }
      frontmatter {
        title
        price
        images {
          image {
            childImageSharp {
              fluid(maxWidth: 900, quality: 64) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
        sizes {
          size
          quantity
        }
        category
        description
      }
    }
  }
`

export default ShopProductPage

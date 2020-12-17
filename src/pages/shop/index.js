import React, { useState, useEffect } from 'react'
import { useStaticQuery, graphql, Link } from 'gatsby'
import SwiperCore, { Pagination, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import swiperStyles from 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import paginationSwiperStyles from 'swiper/components/pagination/pagination.scss'
import { animated, useTransition } from 'react-spring'
import { Helmet } from 'react-helmet'
import Image from 'gatsby-image'

import Layout from '../../components/Layout'
import styles from './shop.module.scss'
import ShopProduct from '../../components/ShopProduct'
import downArrow from '../../img/down-arrow-white.svg'

console.log(swiperStyles, paginationSwiperStyles)

SwiperCore.use([Pagination, Navigation])

const Shop = () => {
  const data = useStaticQuery(graphql`
    query Shop {
      page: markdownRemark(frontmatter: { templateKey: { eq: "shop-page" } }) {
        frontmatter {
          banners {
            bannerImage {
              childImageSharp {
                fluid(maxWidth: 1720, quality: 64) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
            bannerHeading
            bannerDescription
            buttonText
            buttonLink
          }
        }
      }
      products: allMarkdownRemark(
        filter: { frontmatter: { templateKey: { eq: "shop-product" } } }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              price
              images {
                image {
                  childImageSharp {
                    fluid(maxWidth: 310, quality: 64) {
                      ...GatsbyImageSharpFluid_withWebp
                    }
                  }
                }
              }
              sizes {
                size
                quantity
              }
              category
              showFirst
            }
          }
        }
      }
    }
  `)

  const [activeSlide, setActiveSlide] = useState(0)
  const [filters, setFilters] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState(allProducts)

  useEffect(() => {
    setAllProducts(data.products.edges)
  }, [data.products])

  console.log(data.page)

  const changeFilter = (event) => {
    event.persist()
    if (event.target.checked) {
      setFilters((prevState) => {
        return [...prevState, event.target.name]
      })
    } else {
      setFilters((prevState) => {
        const previousState = [...prevState]
        let filterIndex = previousState.indexOf(event.target.name)
        previousState.splice(filterIndex, 1)
        return previousState
      })
    }
  }

  const filteredCategories = () => {
    const filteredCategories = []

    data.products.edges.forEach(({ node: product }) => {
      if (filteredCategories.indexOf(product.frontmatter.category) == -1) {
        return filteredCategories.push(product.frontmatter.category)
      }
    })

    return filteredCategories.map((category) => {
      return (
        <label className={styles.filter}>
          {category}
          <input
            type="checkbox"
            name={category}
            onChange={(e) => changeFilter(e)}
          />
        </label>
      )
    })
  }

  // const filteredProducts = () => {
  //     return data.products.edges.map(({node: product}) => {
  //         if(filters.indexOf(product.frontmatter.category) != -1 || filters.length < 1){
  //             return <div className={styles.product}>
  //                 <ShopProduct title={product.frontmatter.title} images={product.frontmatter.images} price={product.frontmatter.price} availableSizes={product.frontmatter.sizes}/>
  //             </div>
  //         }
  //     })
  // }

  const filterProducts = (products) => {
    setFilteredProducts(() => {
      return products.filter((product) => {
        return (
          filters.indexOf(product.node.frontmatter.category) != -1 ||
          filters.length < 1
        )
      })
    })
  }

  useEffect(() => {
    filterProducts(data.products.edges)
  }, [filters])

  const transitionProducts = useTransition(
    filteredProducts,
    (product) => product.node.fields.slug,
    {
      from: { transform: 'translate(0px, 100px)', opacity: 0 },
      enter: { transform: 'translate(0px, 0px)', opacity: 1 },
      leave: { transform: 'translate(0px, -100px) ', opacity: 0 },
    }
  )
  return (
    <Layout fullWidth={true}>
      <Helmet>
        <title>Shop | RUN BGD</title>
        <meta
          name="description"
          content={`Official RUN BGD Shop. Buy anything from t-shirts to miscellaneous accessories.`}
        />
      </Helmet>
      <main className={styles.fullWidth}>
        <div className={styles.shopBannersContainer}>
          <div className={styles.bannerTextContainer}>
            <div className={styles.bannerText}>
              <h2>
                {data.page &&
                  data.page.frontmatter.banners &&
                  data.page.frontmatter.banners.length > 0 &&
                  data.page.frontmatter.banners[activeSlide] &&
                  data.page.frontmatter.banners[activeSlide].bannerHeading}
              </h2>
              <p className={styles.bannerDescription}>
                {data.page &&
                  data.page.frontmatter.banners &&
                  data.page.frontmatter.banners.length > 0 &&
                  data.page.frontmatter.banners[activeSlide] &&
                  data.page.frontmatter.banners[activeSlide].bannerDescription}
              </p>
              <Link
                to={
                  data.page &&
                  data.page.frontmatter.banners &&
                  data.page.frontmatter.banners.length > 0 &&
                  data.page.frontmatter.banners[activeSlide] &&
                  data.page.frontmatter.banners[activeSlide].buttonLink
                }
              >
                {data.page &&
                  data.page.frontmatter.banners &&
                  data.page.frontmatter.banners.length > 0 &&
                  data.page.frontmatter.banners[activeSlide] &&
                  data.page.frontmatter.banners[activeSlide] &&
                  data.page.frontmatter.banners[activeSlide].buttonText}
              </Link>
            </div>
          </div>
          <div className={styles.bannerImages}>
            {
              data.page && data.page.frontmatter.banners && data.page.frontmatter.banners.length > 0 &&
              <Swiper
                spaceBetween={10}
                grabCursor={true}
                navigation={{
                  nextEl: `.${styles.swiperNextEl}`,
                  prevEl: `.${styles.swiperPrevEl}`,
                }}
                pagination={{
                  el: `.${styles.swiperPagination}`,
                  clickable: true,
                }}
                slidesPerView="auto"
                loop={true}
                className={styles.carousel}
                onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
              >
                {data.page &&
                  data.page.frontmatter.banners &&
                  data.page.frontmatter.banners.length > 0 &&
                  data.page.frontmatter.banners.map((banner) => {
                    return (
                      <SwiperSlide className={styles.slide}>
                        {banner.bannerImage &&
                          banner.bannerImage.childImageSharp &&
                          banner.bannerImage.childImageSharp.fluid && (
                            <Image
                              className={styles.banner}
                              fluid={banner.bannerImage.childImageSharp.fluid}
                              alt=""
                            />
                          )}
                      </SwiperSlide>
                    )
                  })}
                <div className={styles.navigation}>
                  <div className={styles.swiperPrevEl}>
                    <img src={downArrow} alt="" />
                  </div>
                  <div className={styles.swiperNextEl}>
                    <img src={downArrow} alt="" />
                  </div>
                </div>
                <div className={styles.swiperPagination}></div>
              </Swiper>
            }
          </div>
        </div>
        <div className={styles.productContainer}>
          <div className={styles.filterContainer}>
            <div className={styles.filters}>{filteredCategories()}</div>
          </div>
          <div className={styles.products}>
            {transitionProducts.map(({ item: product, key, props }) => {
              return (
                <animated.div
                  style={props}
                  key={key}
                  className={`${styles.product} ${product.node.frontmatter.showFirst && styles.showFirst}`}
                >
                  <Link to={product.node.fields.slug}>
                    <ShopProduct
                      showFirst={product.node.frontmatter.showFirst}
                      title={product.node.frontmatter.title}
                      images={product.node.frontmatter.images}
                      price={product.node.frontmatter.price}
                      availableSizes={product.node.frontmatter.sizes}
                    />
                  </Link>
                </animated.div>
              )
            })}
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Shop

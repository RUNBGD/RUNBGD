import React, {useState, useEffect} from 'react'
import {useStaticQuery, graphql} from 'gatsby'
import SwiperCore, {Pagination, Navigation} from 'swiper'
import {Swiper, SwiperSlide} from 'swiper/react'
import swiperStyles from 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import paginationSwiperStyles from 'swiper/components/pagination/pagination.scss'
import {animated, useTransition} from 'react-spring'

import Layout from '../../components/Layout'
import styles from './shop.module.scss'
import ShopProduct from '../../components/ShopProduct'

import shopBanner1 from '../../img/shop-banner-1.jpeg'
import shopBanner2 from '../../img/shop-banner-2.jpeg'

console.log(swiperStyles, paginationSwiperStyles)


const Shop = () => {

    const data = useStaticQuery(graphql`
        query Shop{
            products:allMarkdownRemark(filter:{frontmatter:{templateKey:{eq:"shop-product"}}}){
                edges{
                    node{
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
                        }
                    }
                }
            }
        }
    `)

    const [activeSlide, setActiveSlide] = useState(0)
    const [filters, setFilters] = useState([])
    const [filteredProducts, setFilteredProducts] = useState(data.products.edges)

    
    const dummyBanners = [
        {
            image:shopBanner1,
            text:'First Short Heading'
        },
        {
            image:shopBanner2,
            text:'Second Short Heading'
        }
    ]
    
    const changeFilter = (event) => {
        event.persist()
        if(event.target.checked){
            setFilters(prevState => {
                return [...prevState, event.target.name]
            })
        }else{
            setFilters(prevState => {
                const previousState = [...prevState]
                let filterIndex = previousState.indexOf(event.target.name)
                previousState.splice(filterIndex, 1)
                return previousState
            })
        }
    }
    
    const filteredCategories = () => {
        const filteredCategories = []
        
        data.products.edges.forEach(({node: product}) => {
            if(filteredCategories.indexOf(product.frontmatter.category) == -1){
                return filteredCategories.push(product.frontmatter.category)
            }
        })
        
        return filteredCategories.map(category => {
            return <label className={styles.filter}>
                    {category}
                    <input type='checkbox' name={category} onChange={e => changeFilter(e)}/>
                </label>
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
            return products.filter(product => {
                return (filters.indexOf(product.node.frontmatter.category) != -1 || filters.length < 1)
            })
        })
    }

    useEffect(() => {
        filterProducts(data.products.edges)
    }, [filters])

    const transitionProducts = useTransition(filteredProducts, product => product.node.fields.slug,
        {
            from:{transform:'translate(0px, 100px)', opacity:0},
            enter:{transform:'translate(0px, 0px)', opacity:1},
            leave:{transform:'translate(0px, -100px) ', opacity:0},
        }
    )
    return(
        <Layout fullWidth={true}>
            <main className={styles.fullWidth}>
                <div className={styles.shopBannersContainer}>
                    <div className={styles.bannerTextContainer}>
                        <div className={styles.bannerText}>
                            <h2>
                                {dummyBanners[activeSlide].text}
                            </h2>
                            <a href=''>See Product</a>
                        </div>
                    </div>
                    <div className={styles.bannerImages}>
                        <Swiper
                            navigation={{
                                nextEl:`.${styles.swiperNextEl}`,
                                prevEl: `.${styles.swiperPrevEl}`
                            }}
                            pagination={{
                                el:`.${styles.swiperPagination}`,
                                clickable: true 
                            }}
                            slidesPerView='auto'
                            loop={true}
                            className={styles.carousel}
                            onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
                        >
                            {dummyBanners.map(banner => {
                                return <SwiperSlide className={styles.slide}>
                                    <img className={styles.banner} src={banner.image} alt=''/>
                                </SwiperSlide>
                            })}
                        </Swiper>
                    </div>
                </div>
                <div className={styles.productContainer}>
                    <div className={styles.filterContainer}>
                        <div className={styles.filters}>
                            {
                                filteredCategories()
                            }
                        </div>
                    </div>
                    <div className={styles.products}>
                        {
                            transitionProducts.map(({item: product, key, props}) => {
                                    return <animated.div style={props} key={key} className={styles.product}>
                                        <ShopProduct title={product.node.frontmatter.title} images={product.node.frontmatter.images} price={product.node.frontmatter.price} availableSizes={product.node.frontmatter.sizes}/>
                                    </animated.div>
                            })
                        }
                    </div>
                </div>
            </main>
        </Layout>
    )
}

export default Shop
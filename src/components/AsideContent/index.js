import React, {useState} from 'react'
import SwiperCore, {Pagination, Autoplay, Navigation} from 'swiper';
import { Swiper, SwiperSlide} from 'swiper/react';
import swiperStyles from 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import paginationSwiperStyles from 'swiper/components/pagination/pagination.scss'
import {Link, useStaticQuery, graphql} from 'gatsby'

import styles from './aside-content.module.scss';
import swiperArrow from '../../img/right-arrow.svg'
import PostImage from '../PostImage'
import PostCategoryTag from '../PostCategoryTag';

console.log(swiperStyles, paginationSwiperStyles)

SwiperCore.use([Pagination, Autoplay, Navigation])

const AsideContent = ({posts, heading, displayCategory}) => {

  let data = useStaticQuery(graphql`
      query asideContent{
        allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "category-page"}}}){
          edges {
              node{
                fields{
                  slug
                }
              frontmatter{
                  title
              }
              }
          }
          }
          authors:allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "author-page"}}}){
            edges {
                node{
                  fields{
                    slug
                  }
                frontmatter{
                    name
                }
                }
            }
            }
      }
    `)


    let [activeSlide, setActiveSlide] = useState(0)

    return(
      <div>
        <h2>{heading}</h2>
        <Swiper
          pagination={{ el:`.${styles.swiperPagination}`,clickable: true }}
          loop={posts.length > 1 ? true : false}
          className={styles.carousel}
          onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
          slidesPerView={1}
          navigation={{
            nextEl: `.${styles.swiperNextEl}`,
            prevEl: `.${styles.swiperPrevEl}`
          }}
          autoplay={{
              delay:'5000'
          }}
          disableOnInteraction={false}
          key={posts.length}
        >
          {posts.map(({node:post}, index) => {

            let category = data.allMarkdownRemark.edges.find(({node:category}) => post.frontmatter.category === category.frontmatter.title)

            let categorySlug = category.node.fields.slug
            
            let author = data.authors.edges.find(({node:author}) => post.frontmatter.author === author.frontmatter.name)

            let authorSlug = author.node.fields.slug

            return(
              <SwiperSlide className={`${styles.slide} ${posts.length < 2 && styles.isOnlySlide} ${index === activeSlide ? styles.activeSlide : styles.inactiveSlide}`}>
                <div className={styles.post}>
                  <PostImage slug={post.fields.slug} image={post.frontmatter.coverImage.childImageSharp.fluid}/>
                  <div className={styles.postDetails}>
                    {displayCategory &&
                      <PostCategoryTag slug={categorySlug} text={post.frontmatter.category}/> 
                    }
                    <Link to={authorSlug}>
                      <p className={styles.postAuthor}>By <a>{post.frontmatter.author}</a></p>
                    </Link>
                  </div>
                  <Link to={post.fields.slug}>
                    <p className={styles.postHeading}>
                      {post.frontmatter.title}
                    </p>
                  </Link>
                </div>
              </SwiperSlide>
            )
          })}
          <div className={styles.swiperPagination}></div>
          <img className={styles.swiperPrevEl} src={swiperArrow} alt='prev slide' />
          <img className={styles.swiperNextEl} src={swiperArrow} alt='next slide'/>
        </Swiper>
      </div>
    )
}   

export default AsideContent
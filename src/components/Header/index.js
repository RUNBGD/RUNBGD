import React, { useState, useEffect } from 'react'
import Image from 'gatsby-image'
import { useStaticQuery, graphql, Link } from 'gatsby'
import * as JsSearch from 'js-search'
import { useTransition, useSpring, animated } from 'react-spring'
import { useSelector } from 'react-redux'

import menuButton from '../../img/menu-icon.svg'
import searchButton from '../../img/search-icon.svg'
import searchButtonWhite from '../../img/search-icon-white.svg'
import closeButton from '../../img/close-icon.svg'
import cartIcon from '../../img/cart-icon.svg'
import cartIconWhite from '../../img/cart-icon-white.svg'
import LinksBlock from '../LinksBlock'

import styles from './navbar.module.scss'
import NewsletterForm from '../NewsletterForm'

const Header = () => {
  let data = useStaticQuery(graphql`
    query getFluidLogo {
      channels: allMarkdownRemark(
        filter: { frontmatter: { templateKey: { eq: "category-page" } } }
        sort: { fields: [frontmatter___orderNavbar] }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              orderNavbar
            }
          }
        }
      }
      otherSites: allMarkdownRemark(
        filter: { frontmatter: { templateKey: { eq: "other-sites-links" } } }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              url
            }
          }
        }
      }
      socialLinks: allMarkdownRemark(
        filter: { frontmatter: { templateKey: { eq: "social-link" } } }
        sort: { fields: [frontmatter___order], order: [ASC] }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              url
              iconLight {
                publicURL
              }
              iconDark {
                publicURL
              }
              order
            }
          }
        }
      }
      authors: allMarkdownRemark(
        filter: { frontmatter: { templateKey: { eq: "author-page" } } }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              name
            }
          }
        }
      }
      allPosts: allMarkdownRemark(
        filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              category
              author
              date(formatString: "MMMM DD, YYYY")
              coverImage {
                childImageSharp {
                  fluid(maxWidth: 100) {
                    ...GatsbyImageSharpFluid
                  }
                }
              }
            }
            html
          }
        }
      }
      mainLogo: markdownRemark(
        frontmatter: { templateKey: { eq: "logos" }, title: { eq: "RUNBGD" } }
      ) {
        frontmatter {
          logoImage {
            childImageSharp {
              fluid(maxWidth: 300, quality: 64) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  `)

  var search = new JsSearch.Search(['fields', 'slug'])
  search.addIndex(['frontmatter', 'title'])
  search.addIndex(['frontmatter', 'category'])
  search.addIndex('html')
  search.addIndex(['frontmatter', 'author'])

  let allPostsNewArray =
    data.allPosts &&
    data.allPosts.edges.length > 0 &&
    data.allPosts.edges.map(({ node }) => node)

  search.addDocuments(allPostsNewArray)

  let [menuOpened, setMenuOpened] = useState(false)
  let [searchOpened, setSearchOpened] = useState(false)
  let [searchValue, setSearchValue] = useState('')
  let [searchResults, setSearchResults] = useState([])
  let [numOfItemsInCart, setNumOfItemsInCart] = useState(
    typeof window !== 'undefined' &&
      (JSON.parse(localStorage.getItem('cartItems'))
        ? JSON.parse(localStorage.getItem('cartItems')).length
        : 0)
  )

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (JSON.parse(localStorage.getItem('cartItems'))) {
        setNumOfItemsInCart(
          JSON.parse(localStorage.getItem('cartItems')).length
        )
      }
    }
  }, [useSelector((state) => state)])

  const transitions = useTransition(
    searchResults.slice(0, 10),
    (result) => result.fields.slug,
    {
      from: {
        transform: 'translate3d(-5px, 0px,0)',
        opacity: 0,
        maxHeight: '0vh',
        padding: '0px',
      },
      enter: {
        transform: 'translate3d(0,0px,0)',
        opacity: 1,
        maxHeight: '20vh',
        padding: '5px',
      },
      leave: {
        transform: 'translate3d(-5px,0px,0)',
        opacity: 0,
        maxHeight: '0vh',
        padding: '0px',
      },
      trail: 200,
    }
  )

  const slideDown = useSpring({
    from: { transform: 'translate(0px, -200%)' },
    to: { transform: 'translate(0px, 0%)' },
  })

  function searchHandler(e) {
    let searchValue = e.target.value
    setSearchValue(searchValue)
  }

  useEffect(() => {
    setSearchResults(search.search(searchValue))
  }, [searchValue])

  return (
    <header
      class={`${styles.header} ${menuOpened && styles.headerDark}`}
    >
      <div className={styles.headerMainButtons}>
        <div className={styles.hamburgerNavItems}>
          <div className={styles.menuButtonContainer}>
            <img
              src={menuOpened ? closeButton : menuButton}
              alt="mobile menu button"
              onClick={() => setMenuOpened((prevState) => !prevState)}
            />
          </div>
        </div>
        <div className={styles.logoNavItems}>
          <Link to="/" className={styles.logo}>
            {data.mainLogo &&
              data.mainLogo.frontmatter.logoImage &&
              data.mainLogo.frontmatter.logoImage.childImageSharp &&
              data.mainLogo.frontmatter.logoImage.childImageSharp.fluid && (
                <Image
                  fluid={
                    data.mainLogo.frontmatter.logoImage.childImageSharp.fluid
                  }
                  alt="logo"
                />
              )}
          </Link>
        </div>
        <div className={styles.headerLinks}>
          {data.channels &&
            data.channels.edges.length > 0 &&
            data.channels.edges.map(({ node: channel }) => {
              return (
                <Link to={channel.fields.slug}>
                  {channel.frontmatter.title}
                </Link>
              )
            })}
          <Link to={'/shop'}>Shop</Link>
          <div
            className={styles.menuButtonContainer}
            onClick={() => setMenuOpened((prevState) => !prevState)}
          >
            {menuOpened ? 'Less' : 'More'}
            <img
              src={menuOpened ? closeButton : menuButton}
              alt="mobile menu button"
            />
          </div>
        </div>
        <div className={styles.miscNavItems}>
          {searchOpened && (
            <input
              className={styles.headerSearchInput}
              type="text"
              placeholder="Search"
              onChange={searchHandler}
            ></input>
          )}
          <div className={styles.menuButtonContainer}>
            <img
              src={menuOpened ? searchButtonWhite : searchButton}
              alt="search website button"
              onClick={() => setSearchOpened((prevState) => !prevState)}
            />
          </div>
          <div className={styles.shoppingCart}>
            <Link to={'/shop/cart'}>
              <img
                src={menuOpened ? cartIconWhite : cartIcon}
                alt="checkout cart"
              />
            </Link>
            <div className={styles.numOfItemsInCart}>{numOfItemsInCart}</div>
          </div>
          <div className={styles.navSocialLinks}>
            {data.socialLinks &&
              data.socialLinks.edges.length > 0 &&
              data.socialLinks.edges.map(({ node: link }) => {
                return (
                  <div className={styles.menuButtonContainer}>
                    <a href={link.frontmatter.url}>
                      <img
                        src={
                          menuOpened
                            ? link.frontmatter.iconLight &&
                              link.frontmatter.iconLight.publicURL
                            : link.frontmatter.iconDark &&
                              link.frontmatter.iconDark.publicURL
                        }
                        alt={`${link.frontmatter.title} icon`}
                      />
                    </a>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      <div
        className={`${styles.headerSearchContainer} ${
          searchOpened && styles.headerSearchContainerOpened
        }`}
      >
        <div
          className={`${styles.headerSearch} ${
            searchOpened && styles.headerSearchOpened
          }`}
        >
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search"
            onChange={searchHandler}
          ></input>
          <div className={styles.searchResults}>
            {transitions.length > 0 &&
              transitions.map(({ item, props, key }) => {
                return (
                  <animated.div
                    style={props}
                    key={key}
                    className={styles.searchResult}
                  >
                    <Link
                      to={item.fields.slug}
                      className={styles.searchResultLink}
                    >
                      <div className={styles.searchResultThumbnail}>
                        {item.frontmatter.coverImage &&
                          item.frontmatter.coverImage.childImageSharp &&
                          item.frontmatter.coverImage.childImageSharp.fluid && (
                            <Image
                              fluid={
                                item.frontmatter.coverImage.childImageSharp
                                  .fluid
                              }
                              alt=""
                            />
                          )}
                      </div>
                      <div className={styles.searchResultText}>
                        <p>{item.frontmatter.title}</p>
                        <p className={styles.searchResultDate}>
                          {item.frontmatter.date}
                        </p>
                      </div>
                    </Link>
                  </animated.div>
                )
              })}
          </div>
        </div>
      </div>

      <div
        className={`${styles.headerMoreMenuContainer} ${
          menuOpened && styles.headerMoreMenuContainerOpened
        }`}
      >
        <nav
          className={`${styles.headerMoreMenu} ${
            menuOpened && styles.headerMoreMenuOpened
          }`}
        >
          {data.channels &&
            data.channels.edges &&
            data.channels.edges.length > 0 && (
              <LinksBlock
                groupName="Channels"
                linkArray={data.channels.edges}
                trigger={menuOpened}
              />
            )}
          <LinksBlock
            groupName="information"
            linkArray={[
              {
                node: {
                  fields: { slug: '/work-with-us' },
                  frontmatter: { title: 'Work With Us' },
                },
              },
              {
                node: {
                  fields: { slug: '/careers' },
                  frontmatter: { title: 'Careers' },
                },
              },
              {
                node: {
                  fields: { slug: '/advertise' },
                  frontmatter: { title: 'Advertise' },
                },
              },
              {
                node: {
                  fields: { slug: '/contact-us' },
                  frontmatter: { title: 'Contact Us' },
                },
              },
              {
                node: {
                  fields: { slug: '/agency' },
                  frontmatter: { title: 'Agency' },
                },
              },
              {
                node: {
                  fields: { slug: '/about' },
                  frontmatter: { title: 'About' },
                },
              },
            ]}
            trigger={menuOpened}
          />
          {data.socialLinks &&
            data.socialLinks.edges &&
            data.socialLinks.edges.length > 0 && (
              <LinksBlock
                groupName="Follow On"
                linkArray={data.socialLinks.edges}
                trigger={menuOpened}
              />
            )}
          {data.otherSites &&
            data.otherSites.edges &&
            data.otherSites.edges.length > 0 && (
              <LinksBlock
                groupName="run bgd sites"
                linkArray={data.otherSites.edges}
                trigger={menuOpened}
              />
            )}
          <LinksBlock
            groupName="Our Web App"
            linkArray={[
              {
                node: {
                  fields: { slug: '/find-places' },
                  frontmatter: { title: 'Find Places' },
                },
              },
            ]}
            trigger={menuOpened}
          />
          <LinksBlock
            groupName="merch"
            linkArray={[
              {
                node: {
                  fields: { slug: '/shop' },
                  frontmatter: { title: 'Shop' },
                },
              },
            ]}
            trigger={menuOpened}
          />

          <footer>
            <NewsletterForm dark={true} />
            <div className={styles.navFooterLinks}>
              <Link to="/terms-of-use">Terms of use</Link>
              <Link to="/privacy-policy">Privacy policy</Link>
              <Link to="/contact-us">Contact us</Link>
              <Link to="/sitemap">Site map</Link>
              <Link to="/public-notice">Public notice</Link>
            </div>
            <hr />
            <small className={styles.navFooterCopyright}>
              © 2020 RUN BGD, All Rights Reserved.
            </small>
          </footer>
        </nav>
      </div>
    </header>
  )
}

export default Header

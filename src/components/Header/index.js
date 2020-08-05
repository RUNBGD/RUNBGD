// import React from 'react'
// import { Link } from 'gatsby'
// import github from '../img/github-icon.svg'
// import logo from '../img/logo.svg'

// const Navbar = class extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       active: false,
//       navBarActiveClass: '',
//     }
//   }

//   toggleHamburger = () => {
//     // toggle the active boolean in the state
//     this.setState(
//       {
//         active: !this.state.active,
//       },
//       // after state has been updated,
//       () => {
//         // set the class in state for the navbar accordingly
//         this.state.active
//           ? this.setState({
//               navBarActiveClass: 'is-active',
//             })
//           : this.setState({
//               navBarActiveClass: '',
//             })
//       }
//     )
//   }

//   render() {
//     return (
//       <nav
//         className="navbar is-transparent"
//         role="navigation"
//         aria-label="main-navigation"
//       >
//         <div className="container">
//           <div className="navbar-brand">
//             <Link to="/" className="navbar-item" title="Logo">
//               <img src={logo} alt="Kaldi" style={{ width: '88px' }} />
//             </Link>
//             {/* Hamburger menu */}
//             <div
//               className={`navbar-burger burger ${this.state.navBarActiveClass}`}
//               data-target="navMenu"
//               onClick={() => this.toggleHamburger()}
//             >
//               <span />
//               <span />
//               <span />
//             </div>
//           </div>
//           <div
//             id="navMenu"
//             className={`navbar-menu ${this.state.navBarActiveClass}`}
//           >
//             <div className="navbar-start has-text-centered">
//               <Link className="navbar-item" to="/about">
//                 About
//               </Link>
//               <Link className="navbar-item" to="/products">
//                 Products
//               </Link>
//               <Link className="navbar-item" to="/blog">
//                 Blog
//               </Link>
//               <Link className="navbar-item" to="/contact">
//                 Contact
//               </Link>
//               <Link className="navbar-item" to="/contact/examples">
//                 Form Examples
//               </Link>
//             </div>
//             <div className="navbar-end has-text-centered">
//               <a
//                 className="navbar-item"
//                 href="https://github.com/netlify-templates/gatsby-starter-netlify-cms"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <span className="icon">
//                   <img src={github} alt="Github" />
//                 </span>
//               </a>
//             </div>
//           </div>
//         </div>
//       </nav>
//     )
//   }
// }

// export default Navbar

import React, {useState, useEffect} from 'react'
import Image from 'gatsby-image'
import {useStaticQuery, graphql, Link} from 'gatsby'
import * as JsSearch from 'js-search'
import {useTransition, animated} from 'react-spring'

import menuButton from '../../img/menu-icon.svg'
import searchButton from '../../img/search-icon.svg'
import searchButtonWhite from '../../img/search-icon-white.svg'
import closeButton from '../../img/close-icon.svg' 

import styles from './navbar.module.scss'
import NewsletterForm from '../NewsletterForm'


const Header = () => {
  
  let data = useStaticQuery(graphql`
  query getFluidLogo{
    logo:file(relativePath:{eq:"logo.jpeg"}){
      childImageSharp{
        fluid(maxWidth: 300){
          ...GatsbyImageSharpFluid
        }
      }
    }
    channels:allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "category-page"}}}, sort: {fields: [frontmatter___orderNavbar]}){
      edges {
        node{
          fields{
            slug
          }
          frontmatter{
            title
            orderNavbar
          }
        }
      }
    }
    otherSites:allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "other-sites-links"}}}){
      edges {
        node{
          fields{
            slug
          }
          frontmatter{
            title
            url
          }
        }
      }
    }
    socialLinks:allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "social-link"}}}, sort: {fields: [frontmatter___order], order: [ASC]}){
      edges {
        node{
          fields{
            slug
          }
          frontmatter{
            title
            url
            iconLight{
              publicURL
            }
            order
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
    allPosts:allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "blog-post"}}}){
      edges {
        node{
          fields{
            slug
          }
          frontmatter{
            title
            category
            author
            date(formatString: "MMMM DD, YYYY")
            coverImage{
              childImageSharp{
                fluid(maxWidth:100){
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
          html
        }
      }
    }
  }
  `)

  console.log(data.authors)
 
  var search = new JsSearch.Search(['fields','slug']);
  search.addIndex(['frontmatter','title']);
  search.addIndex(['frontmatter','category']);
  search.addIndex('html');
  search.addIndex(['frontmatter', 'author'])

  let allPostsNewArray = data.allPosts.edges.map(({node}) => node)
  
  search.addDocuments(allPostsNewArray);
  
  let [menuOpened, setMenuOpened] = useState(false)
  let [searchOpened, setSearchOpened] = useState(false)
  let [searchValue, setSearchValue] = useState('')
  let [searchResults, setSearchResults] = useState([])
  
  const transitions = useTransition(searchResults.slice(0, 10), result => result.fields.slug, {
    from: {transform: 'translate3d(-5px, 0px,0)', opacity:0, maxHeight:'0vh', padding:'0px'},
    enter: { transform: 'translate3d(0,0px,0)' , opacity: 1, maxHeight:'20vh', padding:'5px'},
    leave: { transform: 'translate3d(-5px,0px,0)', opacity: 0, maxHeight:'0vh', padding:'0px'},
    trail: 200
  })

  function searchHandler(e){
    let searchValue = e.target.value
    setSearchValue(searchValue)
  }

  useEffect(() => {
    setSearchResults(search.search(searchValue))
  }, [searchValue])

  return (
    <header class={`${styles.header} ${menuOpened && styles.headerDark}`}>
      <div className={styles.headerMainButtons}>
        <div className={styles.menuButtonContainer}>
          <img src={menuOpened ? closeButton : menuButton} alt='mobile menu button' onClick={() => setMenuOpened(prevState => !prevState)}/>
        </div>
        <Link to='/' className={styles.logo}>
          <Image fluid={data.logo.childImageSharp.fluid} alt='logo'/>
        </Link>
        <div className={styles.headerLinks}>
          {data.channels.edges.map(({node:channel}) => {
            return <Link to={channel.fields.slug}>
              {channel.frontmatter.title}
            </Link>
          })}
          
          <div className={styles.menuButtonContainer}  onClick={() => setMenuOpened(prevState => !prevState)}>
            {menuOpened ? 'Less' : 'More'}
            <img src={menuOpened ? closeButton : menuButton} alt='mobile menu button'/>
          </div>
        </div>
        <div className={styles.menuButtonContainer}>
          <img src={menuOpened ? searchButtonWhite : searchButton} alt='search website button' onClick={() => setSearchOpened(prevState => !prevState)}/>
        </div>
      </div>

      <div className={`${styles.headerSearchContainer} ${searchOpened && styles.headerSearchContainerOpened}`}>
        <div className={`${styles.headerSearch} ${searchOpened && styles.headerSearchOpened}`}>
          <input className={styles.searchInput} type='text' placeholder='Search' onChange={searchHandler}></input>
          <div className={styles.searchResults}>
            {transitions.map(({item, props, key}) => {
              
              return <animated.div style={props} key={key} className={styles.searchResult}>
                <Link to={item.fields.slug} className={styles.searchResultLink}>
                  <div className={styles.searchResultThumbnail}>
                    <Image fluid={item.frontmatter.coverImage.childImageSharp.fluid} alt=''/>
                  </div>
                  <div className={styles.searchResultText}>
                    <p>{item.frontmatter.title}</p>
                    <p className={styles.searchResultDate}>{item.frontmatter.date}</p>
                  </div>
                </Link>
              </animated.div>
            }
            )}
          </div>
        </div>
      </div>

      <div className={`${styles.headerMoreMenuContainer} ${menuOpened && styles.headerMoreMenuContainerOpened}`}>
        <nav className={`${styles.headerMoreMenu} ${menuOpened && styles.headerMoreMenuOpened}`}>
          <div className={styles.linksBlock}>
            <div className={styles.centeredContainer}>
              <p className={styles.linksGroupName}>Channels</p>
              {data.channels.edges.map(({node:channel}) => {
                return <Link to={channel.fields.slug} className={styles.link}>
                  {channel.frontmatter.title}
                </Link>
              })}
            </div>
          </div>

          <div className={styles.linksBlock}>
            <div className={styles.centeredContainer}>
              <p className={styles.linksGroupName}>Our Web App</p>
                <Link to='/find-places' className={styles.link}>
                  Find Places
                </Link>
            </div>
          </div>

          <div className={styles.linksBlock}>
            <div className={styles.centeredContainer}>
              <p className={styles.linksGroupName}>Follow On</p>
              {data.socialLinks.edges.map(({node:link}) => {
                return <a href={link.fields.slug} className={styles.link}><img src={link.frontmatter.iconLight.publicURL}/> {link.frontmatter.title}</a>
              })}
            </div>
          </div>
          <div className={styles.linksBlock}>
            <div className={styles.centeredContainer}>
              <p className={styles.linksGroupName}>run bgd sites</p>
              {data.otherSites.edges.map(({node:site}) => {
                return <a className={styles.link} href={site.frontmatter.url} target='_blank'>{site.frontmatter.title}</a>
              })}
            </div>
          </div>

          <div className={styles.linksBlock}>
            <div className={styles.centeredContainer}>
              <p className={styles.linksGroupName}>Authors</p>
              {data.authors.edges.map(({node:author}) => {
                return <Link className={styles.link} to={author.fields.slug} target='_blank'>{author.frontmatter.name}</Link>
              })}
            </div>
          </div>

          <div className={styles.linksBlock}>
            <div className={styles.centeredContainer}>
              <p className={styles.linksGroupName}>work with us</p>
              <a className={styles.link}>careers</a>
              <a className={styles.link}>advertise</a>
              <Link className={styles.link} to='/contact-us'>
                contact us
              </Link>
            </div>
          </div>
          <footer>
            <NewsletterForm dark={true}/>
            <div className={styles.navFooterLinks}>
              <Link to='/terms-of-use'>
                Terms of use
              </Link>
              <Link to='/privacy-policy'>
                Privacy policy
              </Link>
              <Link to='/do-not-sell-my-info'>
                Do not sell my info
              </Link>
              <Link to='/sitemap'>
                Site map
              </Link>
              <Link to='/public-notice'>
                Public notice
              </Link>
            </div>
            <hr/>
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
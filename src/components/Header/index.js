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

import React, {useState} from 'react'
import Image from 'gatsby-image'
import {useStaticQuery, graphql, Link} from 'gatsby'

import menuButton from '../../img/menu-icon.svg'
import searchButton from '../../img/search-icon.svg'
import searchButtonWhite from '../../img/search-icon-white.svg'
import closeButton from '../../img/close-icon.svg'
import instagramLogo from '../../img/instagram-logo-white.svg' 
import facebookLogo from '../../img/facebook-logo-white.svg' 
import twitterLogo from '../../img/twitter-logo-white.svg' 

import styles from './navbar.module.scss'
import NewsletterForm from '../NewsletterForm'


const Header = () => {

  let logo = useStaticQuery(graphql`
    query getFluidLogo{
      file(relativePath:{eq:"logo.jpeg"}){
        childImageSharp{
          fluid(maxWidth: 300){
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)

  let [menuOpened, setMenuOpened] = useState(false)

  return (
    <header class={`${styles.header} ${menuOpened && styles.headerDark}`}>
      <div className={styles.headerMainButtons}>
        <div className={styles.menuButtonContainer}>
          <img src={menuOpened ? closeButton : menuButton} alt='mobile menu button' onClick={() => setMenuOpened(prevState => !prevState)}/>
        </div>
        <Link to='/' className={styles.logo}>
          <Image fluid={logo.file.childImageSharp.fluid} alt='logo'/>
        </Link>
        <div className={styles.menuButtonContainer}>
          <img src={menuOpened ? searchButtonWhite : searchButton} alt='search website button' />
        </div>
      </div>
      <div className={`${styles.headerMoreMenuContainer} ${menuOpened && styles.headerMoreMenuContainerOpened}`}>
        <nav className={`${styles.headerMoreMenu} ${menuOpened && styles.headerMoreMenuOpened}`}>
          <div className={styles.linksBlock}>
            <p className={styles.linksGroupName}>Channels</p>
            <a>THE CITY</a>
            <a>TRAVEL</a>
            <a>MUSIC</a>
            <a>CULTURE</a>
            <a>style</a>
            <a>life</a>
            <a>Food & Beverages</a>
          </div>
          <div className={styles.linksBlock}>
            <p className={styles.linksGroupName}>Follow On</p>
            <a><img src={instagramLogo}/> instagram</a>
            <a><img src={facebookLogo}/> facebook</a>
            <a><img src={twitterLogo}/> twitter</a>
          </div>
          <div className={styles.linksBlock}>
            <p className={styles.linksGroupName}>run bgd sites</p>
            <a>RUN BGD</a>
          </div>
          <div className={styles.linksBlock}>
            <p className={styles.linksGroupName}>work with us</p>
            <a>careers</a>
            <a>advertise</a>
            <a>contact us</a>
          </div>
          <footer>
            <NewsletterForm dark={true}/>
            <div className={styles.navFooterLinks}>
              <a>Terms of use</a>
              <a>Privacy policy</a>
              <a>Do not sell my info</a>
              <a>Site map</a>
              <a>Public Notice</a>
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
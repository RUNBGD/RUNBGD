// import React from 'react'
// import { Link } from 'gatsby'

// import logo from '../img/logo.svg'
// import facebook from '../img/social/facebook.svg'
// import instagram from '../img/social/instagram.svg'
// import twitter from '../img/social/twitter.svg'
// import vimeo from '../img/social/vimeo.svg'

// const Footer = class extends React.Component {
//   render() {
//     return (
//       <footer className="footer has-background-black has-text-white-ter">
//         <div className="content has-text-centered">
//           <img
//             src={logo}
//             alt="Kaldi"
//             style={{ width: '14em', height: '10em' }}
//           />
//         </div>
//         <div className="content has-text-centered has-background-black has-text-white-ter">
//           <div className="container has-background-black has-text-white-ter">
//             <div style={{ maxWidth: '100vw' }} className="columns">
//               <div className="column is-4">
//                 <section className="menu">
//                   <ul className="menu-list">
//                     <li>
//                       <Link to="/" className="navbar-item">
//                         Home
//                       </Link>
//                     </li>
//                     <li>
//                       <Link className="navbar-item" to="/about">
//                         About
//                       </Link>
//                     </li>
//                     <li>
//                       <Link className="navbar-item" to="/products">
//                         Products
//                       </Link>
//                     </li>
//                     <li>
//                       <Link className="navbar-item" to="/contact/examples">
//                         Form Examples
//                       </Link>
//                     </li>
//                     <li>
//                       <a
//                         className="navbar-item"
//                         href="/admin/"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         Admin
//                       </a>
//                     </li>
//                   </ul>
//                 </section>
//               </div>
//               <div className="column is-4">
//                 <section>
//                   <ul className="menu-list">
//                     <li>
//                       <Link className="navbar-item" to="/blog">
//                         Latest Stories
//                       </Link>
//                     </li>
//                     <li>
//                       <Link className="navbar-item" to="/contact">
//                         Contact
//                       </Link>
//                     </li>
//                   </ul>
//                 </section>
//               </div>
//               <div className="column is-4 social">
//                 <a title="facebook" href="https://facebook.com">
//                   <img
//                     src={facebook}
//                     alt="Facebook"
//                     style={{ width: '1em', height: '1em' }}
//                   />
//                 </a>
//                 <a title="twitter" href="https://twitter.com">
//                   <img
//                     className="fas fa-lg"
//                     src={twitter}
//                     alt="Twitter"
//                     style={{ width: '1em', height: '1em' }}
//                   />
//                 </a>
//                 <a title="instagram" href="https://instagram.com">
//                   <img
//                     src={instagram}
//                     alt="Instagram"
//                     style={{ width: '1em', height: '1em' }}
//                   />
//                 </a>
//                 <a title="vimeo" href="https://vimeo.com">
//                   <img
//                     src={vimeo}
//                     alt="Vimeo"
//                     style={{ width: '1em', height: '1em' }}
//                   />
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </footer>
//     )
//   }
// }

// export default Footer

import React from 'react'
import {Link, useStaticQuery, graphql} from 'gatsby'

import styles from './footer.module.scss'

const Footer = () => {

  let data = useStaticQuery(graphql`
    query footerData{
      socialLinks:allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "social-link"}}}, sort: {fields: [frontmatter___order], order: [ASC]}){
        edges {
            node{
              fields{
                slug
              }
            frontmatter{
                url
                title
                iconDark{
                  publicURL
                }
                order
            }
            }
          }
        }
    }
  `)

  return(
    <footer className={styles.footer}>
      <div className={styles.footerLinks}>

        <div className={styles.socialContainer}>
          <p>Connect With Us</p>
          <div className={styles.socialIconsContainer}>
            {data.socialLinks.edges.map(({node:link}) => {
              return <a href={link.fields.slug}><img src={link.frontmatter.iconDark.publicURL} alt={`${link.frontmatter.title} logo`}/></a>
            })}
          </div>
        </div>
        <hr/>
        <div className={styles.columnLinks}>
          <Link to='/terms-of-use'>
            Terms of Use
          </Link>
          <Link to='/advertise'>
            Advertise
          </Link>
          <Link to='/contact-us'>
            Contact Us
          </Link>
          <Link to='/sitemap'>
            Sitemap
          </Link>
        </div>
      </div>
      <hr/>
      <small className={styles.copyrightText}>
        © 2020 RUN BGD, All Rights Reserved.
      </small>
    </footer>
  )
}

export default Footer

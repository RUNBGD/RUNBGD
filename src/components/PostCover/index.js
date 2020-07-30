import React from 'react'
import Image from 'gatsby-image'
import {Link} from 'gatsby'

import styles from './post-cover.module.scss'
const PostCover = ({post, categorySlug}) => {
    
    return(
        <div className={styles.post}> 
                <div className={styles.postImage}>
                <Link to={post.fields.slug}>
                    <Image fluid={post.frontmatter.coverImage.childImageSharp.fluid} alt=''/>
                </Link>
                </div>
            <div className={styles.postText}>
                <div className={styles.postDetails}>
                <Link to={categorySlug}>
                    <span className={styles.postCategory}>{post.frontmatter.category}</span>
                </Link>
                </div>
                <Link to={post.fields.slug}>
                    <p className={styles.postHeading}>
                    {post.frontmatter.title}
                    </p>
                </Link>
            </div>
        </div>
    )
}

export default PostCover
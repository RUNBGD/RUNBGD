import React from 'react'
import Image from 'gatsby-image'

import styles from './post-cover.module.scss'
const PostCover = ({post}) => {
    return(
        <div className={styles.post}> 
            <div className={styles.postImage}>
                {post.frontmatter.coverImage && <Image fluid={post.frontmatter.coverImage.childImageSharp.fluid} alt=''/>}
            </div>
            <div className={styles.postText}>
                <div className={styles.postDetails}>
                <span className={styles.postCategory}>{post.frontmatter.category}</span>
                </div>
                <p className={styles.postHeading}>
                {post.frontmatter.title}
                </p>
            </div>
        </div>
    )
}

export default PostCover
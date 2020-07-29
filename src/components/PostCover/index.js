import React from 'react'

import styles from './post-cover.module.scss'

import postImg from '../../img/example.png';

const PostCover = ({post}) => {
    return(
        <div className={styles.post}> 
            <img src={postImg} alt='' className={styles.postImage}/>
            <div className={styles.postText}>
                <div className={styles.postDetails}>
                <span className={styles.postCategory}>{post.category}</span>
                </div>
                <p className={styles.postHeading}>
                {post.heading}
                </p>
            </div>
        </div>
    )
}

export default PostCover
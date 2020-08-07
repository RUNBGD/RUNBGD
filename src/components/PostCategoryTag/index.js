import React, {useState} from 'react'
import { Link } from 'gatsby'
import { useSpring, animated} from 'react-spring'

import styles from './post-category.module.scss'

const PostCategoryTag = ({slug, text}) => {

    const [hovered, setHovered] = useState(false)

    const turnToBlack = useSpring({
        to:{background:hovered ? '#000000' : '#EE1C25'}
    })

    return(
        <Link to={slug} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
            <animated.span style={turnToBlack} className={styles.postCategory}>{text}</animated.span>
        </Link>
    )
}

export default PostCategoryTag
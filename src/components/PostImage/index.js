import React, { useState } from 'react'
import Image from 'gatsby-image'
import { Link } from 'gatsby'
import { useSpring, animated } from 'react-spring'

import styles from './post-image.module.scss'

const AnimatedImage = animated(Image)

const PostImage = ({ slug, image }) => {
  const [hovered, setHovered] = useState(false)

  const hoverAnimation = useSpring({
    to: { transform: hovered ? 'scale(1.1)' : 'scale(1)' },
  })

  return (
    <div
      className={styles.postImage}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Link to={slug}>
        <div className={styles.postImageContainer}>
          <AnimatedImage
            fluid={image}
            style={hoverAnimation}
            alt=""
            className={styles.postCover}
          />
        </div>
      </Link>
    </div>
  )
}

export default PostImage

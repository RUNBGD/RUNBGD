import React, { useState } from 'react'
import { useTransition, animated } from 'react-spring'

import InfiniteScroll from 'react-infinite-scroll-component'
import PostCover from '../PostCover'

import styles from './latest-posts.module.scss'

let LatestPosts = ({ posts }) => {
  let [numOfLatestPosts, setNumOfLatestPosts] = useState(5)

  const transitions = useTransition(
    posts.edges.slice(0, numOfLatestPosts),
    (post) => post.node.fields.slug,
    {
      from: { transform: 'translateX(-50px)', opacity: 0 },
      enter: { transform: 'translateX(0px)', opacity: 1 },
      leave: { transform: 'translateX(20px)', opacity: 0 },
      trail: 200,
    }
  )

  function loadMoreLatestPosts() {
    setNumOfLatestPosts((prevState) => prevState + 5)
  }

  return (
    <InfiniteScroll
      className={styles.latestPostsContainer}
      scrollThreshold="0px"
      dataLength={numOfLatestPosts}
      next={loadMoreLatestPosts}
      hasMore={numOfLatestPosts < posts.edges.length ? true : false}
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>You have seen it all! Come later</b>
        </p>
      }
    >
      {transitions.map(({ item, props, key }, index) => {
        if (index < numOfLatestPosts) {
          return (
            <animated.div style={props} key={key}>
              <PostCover post={item.node} />
            </animated.div>
          )
        }
      })}
    </InfiniteScroll>
  )
}

export default LatestPosts

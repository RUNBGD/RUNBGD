import React, {useState} from 'react'

import InfiniteScroll from 'react-infinite-scroll-component';
import PostCover from '../PostCover'


let LatestPosts = ({posts}) => {
    
    let [numOfLatestPosts, setNumOfLatestPosts] = useState(5)

    
    function loadMoreLatestPosts(){
        setNumOfLatestPosts(prevState => prevState + 5)
    }

    return(
        <InfiniteScroll
            scrollThreshold='0px'
            dataLength={numOfLatestPosts}
            next={loadMoreLatestPosts}
            hasMore={numOfLatestPosts < posts.edges.length ? true : false}
            endMessage={
              <p style={{textAlign: 'center'}}>
                <b>You have seen it all! Come later</b>
              </p>
            }
          >
            {posts.edges.map(({node:post}, index) => {
              if(index < numOfLatestPosts){
                return <PostCover post={post}/>
              }
          })}
          </InfiniteScroll>
    )
}

export default LatestPosts
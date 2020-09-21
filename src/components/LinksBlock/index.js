import React from 'react'
import {Link} from 'gatsby'
import {useTransition, animated} from 'react-spring'

import styles from './links-block.module.scss'

let AnimatedLink = animated(Link)

const LinksBlock = ({groupName, linkArray,trigger}) => {

    let transitions = useTransition(trigger ? linkArray : [], result => result.node.fields.slug, 
        {
        from:{transform:'translate(-10px, 0px)'},
        enter:{transform:'translate(0px, 0px)'},
        leave:{transform:'translate(-10px, 0px)'},
        trail:100
    }
    )

    return (
        <div className={styles.linksBlock}>
            <div className={styles.centeredContainer}>
            <p className={styles.linksGroupName}>{groupName}</p>
            {transitions.map(({item:link, key, props}) => {
                if(link.node.frontmatter.url){
                    return <animated.a key={key} style={props} className={styles.link} href={link.node.frontmatter.url} target='_blank'>
                        {link.node.frontmatter.iconLight && <img src={link.node.frontmatter.iconLight.publicURL} alt=''/>}
                        <p>{link.node.frontmatter.title}</p>
                        </animated.a>
                }else{
                    return <AnimatedLink to={link.node.fields.slug} key={key} style={props} className={styles.link}>
                        {link.node.frontmatter.iconLight && <img src={link.node.frontmatter.iconLight.publicURL} alt=''/>}
                        <p>{link.node.frontmatter.title || link.node.frontmatter.name}</p>
                    </AnimatedLink>
                }
            })}
            </div>
        </div>
    )
}

export default LinksBlock
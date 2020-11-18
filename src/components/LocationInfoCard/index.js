import React from 'react'
import Image from 'gatsby-image'
import remark from 'remark'
import remarkHTML from 'remark-html'
import Content from '../Content.js' 

import styles from './location-info-card.module.scss'

const LocationInfoCard = ({location, distance, setLocation}) => {
    console.log(location)
    
    return(
    <article className={styles.locationInfoCard}>
        <a className={styles.backButton} onClick={() => setLocation(undefined)}>
            &lt; go back
        </a>
        {location.coverImage && 
            <Image fluid={location.coverImage.childImageSharp.fluid} alt=''/>
        }
        {location.name &&
            <h3 className={styles.name}>{location.name}</h3>
        }
        {location.address &&
            <div className={styles.smallInfo}>{location.address}</div>
        }
        {location.website &&
            <Content content={location.website} className={styles.smallInfo}/>
        }
        {location.email &&
            <Content content={location.email} className={styles.smallInfo}/>
        }
        {location.description &&
            <Content content={location.description} className={styles.description}/>
        }
    </article>
    )
}

export default LocationInfoCard
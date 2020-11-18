import React from 'react'
import Image from 'gatsby-image'
import remark from 'remark'
import remarkHTML from 'remark-html'

import styles from './location-info-card.module.scss'

const toHTML = (value) => remark().use(remarkHTML).processSync(value).toString()

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
            <h4>{location.name}</h4>
        }
        {location.address &&
            <p className={styles.smallInfo}>{location.address}</p>
        }
        {location.website &&
            <p dangerouslySetInnerHTML={{__html:toHTML(location.website)}} className={styles.smallInfo}></p>
        }
        {location.email &&
            <p dangerouslySetInnerHTML={{__html:toHTML(location.email)}} className={styles.smallInfo}></p>
        }
        {location.description &&
            <p dangerouslySetInnerHTML={{__html:toHTML(location.description)}} className={styles.smallInfo}></p>
        }
    </article>
    )
}

export default LocationInfoCard
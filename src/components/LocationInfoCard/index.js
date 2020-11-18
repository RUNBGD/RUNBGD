import React from 'react'
import Image from 'gatsby-image'

import styles from './location-info-card.module.scss'

const LocationInfoCard = ({location, distance, setLocation}) => {
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
            <p>{location.address}</p>
        }
    </article>
    )
}

export default LocationInfoCard
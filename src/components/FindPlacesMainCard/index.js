import React from 'react'
import {Link} from 'gatsby'

import styles from './find-places-main-card.module.scss'

import pinIcon from '../../img/pin-icon.svg'

const FindPlacesMainCard = () => {
  return(
    <div className={styles.findPlacesCard}>
      <h2>Find exciting places hand-picked by us at RUN BGD</h2>
      <img className={styles.findPlacesIcon} src={pinIcon} alt='pin icon'/>
      <Link to={'find-places'} className={styles.findPlacesButton}>Find Now</Link>
    </div>
  )
}

export default FindPlacesMainCard
import React from 'react'
import Layout from '../components/Layout'

import globeImg from '../img/globe.png'
import moonImg from '../img/moon.png'
import styles from './404.module.scss'

const NotFoundPage = () => (
  <Layout>
    <main>
      <h1>NOT FOUND</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
      <div className={styles.animatedIllustration}>
        <img src={globeImg} alt='' className={styles.illustrationGlobe}/>
        <div className={styles.rotatingContainer}>
          <img src={moonImg} alt='' className={styles.illustrationMoon}/>
        </div>
      </div>
    </main>
  </Layout>
)

export default NotFoundPage

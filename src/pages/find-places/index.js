import React, {useEffect} from 'react'

import Layout from '../../components/Layout'
import styles from './find-places.module.scss'
import { useQueryParam, NumberParam } from 'use-query-params'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

const FindPlaces = () => {
    
    const [xCoord, setXCoord] = useQueryParam('x', NumberParam)
    const [yCoord, setYCoord] = useQueryParam('y', NumberParam)

    function getLocation(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(({coords}) => {
                setXCoord(coords.longitude)
                setYCoord(coords.latitude)
            })
        }
    }
    if (typeof window !== 'undefined'){

        return (
            <Layout>
                <main>
                    <div className={styles.locationItemsContainer}>
                        {!xCoord ? 
                            <div className={styles.inputCard}>
                            <p>Where are you looking to have fun?</p>
                            <button 
                                className={styles.inputCardButton}
                                onClick={() => getLocation()}
                            >Search near me</button>
                            <p>or</p>
                            <input type='text' placeholder='Enter location' className={styles.inputCardInput}></input>
                        </div>
                        :
                        <div className={styles.map}>
                            <Map center={[yCoord, xCoord]} zoom={10}>
                                <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                                />
                                <Marker position={[yCoord, xCoord]}>
                                <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
                                </Marker>
                            </Map>
                        </div>
                        }
                    </div>
                </main>
            </Layout>
        )
    }
}

export default FindPlaces
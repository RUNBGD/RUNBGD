import React, {useState} from 'react'
import {useStaticQuery, graphql} from 'gatsby'

import Layout from '../../components/Layout'
import styles from './find-places.module.scss'
import { useQueryParam, NumberParam } from 'use-query-params'
import {icon} from 'leaflet'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

import expandButton from '../../img/down-arrow.svg'
import testIcon from '../../img/pin-test.svg'

const FindPlaces = () => {
    
    const [xCoord, setXCoord] = useQueryParam('x', NumberParam)
    const [yCoord, setYCoord] = useQueryParam('y', NumberParam)

    const [mapExpanded, setMapExpanded] = useState(false)

    function getLocation(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(({coords}) => {
                setXCoord(coords.longitude)
                setYCoord(coords.latitude)
            })
        }
    }

    const data = useStaticQuery(graphql`
    query locationData{
        locations:allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "location"}}}){
            edges {
                node{
                frontmatter{
                    name
                    address
                    latitude
                    longitude
                }
                }
              }
            }
        }
    `)

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
                        <div className={`${styles.map} ${mapExpanded && styles.isExpanded}`}>
                            {
                                typeof window !== 'undefined' &&
                                <Map center={[yCoord, xCoord]} zoom={10}>
                                    <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                                    />
                                    {data.locations.edges.map(({node:location}) => {
                                        return <Marker position={[location.frontmatter.latitude, location.frontmatter.longitude]} icon={icon({iconUrl:testIcon, iconSize: [20, 28.57]})}>
                                            <Popup>{location.frontmatter.name}</Popup>
                                        </Marker>
                                    })}
                                    <Marker position={[yCoord, xCoord]} icon={icon({iconUrl:testIcon, iconSize: [20, 28.57]})}>
                                        <Popup>Current Location</Popup>
                                    </Marker>
                                </Map>
                        }    
                        </div>
                        }
                        <button className={styles.expandButton} onClick={() => setMapExpanded((prevState) => !prevState)}><img src={expandButton} alt='expand button'/></button>
                        <div className={styles.mapInformationCard}>
                            
                        </div>   
                    </div>
                </main>
            </Layout>
        )
}

export default FindPlaces
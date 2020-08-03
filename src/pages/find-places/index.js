import React, {useState, useEffect} from 'react'
import {useStaticQuery, graphql} from 'gatsby'
import Image from 'gatsby-image'

import Layout from '../../components/Layout'
import styles from './find-places.module.scss'
import { useQueryParam, NumberParam } from 'use-query-params'
import {icon} from 'leaflet'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

import expandButton from '../../img/down-arrow.svg'

function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist.toFixed(2)
}

const FindPlaces = () => {
    
    const [xCoord, setXCoord] = useQueryParam('x', NumberParam)
    const [yCoord, setYCoord] = useQueryParam('y', NumberParam)

    const [currentX, setCurrentX] = useState(0)
    const [currentY, setCurrentY] = useState(0)

    const [filterCategory, setFilterCategory] = useState('Select Category')

    useEffect(() => {
        setCurrentX(xCoord)
        setCurrentY(yCoord)
    }, [xCoord, yCoord])

    const [mapExpanded, setMapExpanded] = useState(false)

    function getLocation(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(({coords}) => {
                setXCoord(coords.longitude)
                setYCoord(coords.latitude)
            })
        }
    }

    function findGeocodeFromAddress(event){
        if (event.key === 'Enter') {
            fetch(`/.netlify/functions/getGeolocation?location=${event.target.value}`)
                .then(response => response.json())
                .then(({data}) => {
                    const coords = data.results[0].locations[0].latLng
                    setYCoord(coords.lat)
                    setXCoord(coords.lng)
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
                    coverImage{
                        childImageSharp{
                            fluid(maxWidth:1000){
                                ...GatsbyImageSharpFluid
                            }
                        }
                    }
                    category
                    address
                    latitude
                    longitude
                }
                }
              }
            }
        categories:allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "location-category"}}}){
            edges {
                node{
                frontmatter{
                    title
                    categoryPin{
                        publicURL
                    }
                }
                }
              }
            }
        currentLocationCategory:allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "location-category"}, title: {eq: "Current Location"}}}){
            edges {
                node{
                frontmatter{
                    categoryPin{
                        publicURL
                    }
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
                            <input type='text' onKeyDown={findGeocodeFromAddress} placeholder='Enter location' className={styles.inputCardInput}></input>
                        </div>
                        :
                        <React.Fragment>

                            <div className={`${styles.map} ${mapExpanded && styles.isExpanded}`}>
                                {
                                    typeof window !== 'undefined' &&
                                    <Map center={currentY == undefined ? [0, 0] : [currentY, currentX]} zoom={10}>
                                        <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                                        />
                                        {data.locations.edges.map(({node:location}) => {
                                            
                                            
                                        let category = data.categories.edges.find(({node:category}) => location.frontmatter.category === category.frontmatter.title)
                                            
                                            return <Marker position={[location.frontmatter.latitude, location.frontmatter.longitude]} icon={icon({iconUrl:category.node.frontmatter.categoryPin.publicURL, iconSize: [20, 28.57]})}>
                                                <Popup>{location.frontmatter.name}</Popup>
                                            </Marker>
                                        })}
                                        <Marker position={yCoord == undefined ? [0, 0] : [yCoord, xCoord]} icon={icon({iconUrl:data.currentLocationCategory.edges[0].node.frontmatter.categoryPin.publicURL, iconSize: [20, 28.57]})}>
                                            <Popup>Current Location</Popup>
                                        </Marker>
                                    </Map>
                            }    
                            </div>
                            <button className={`${styles.expandButton} ${mapExpanded && styles.isActivated}`} onClick={() => setMapExpanded((prevState) => !prevState)}><img src={expandButton} alt='expand button'/></button>
                            <div className={styles.locationCards}>
                                <select className={styles.filterSelect} onChange={(e) => {setFilterCategory(e.target.value)}}>
                                    <option value="Select Category">Select Category</option>
                                    {data.categories.edges.map(({node:category}) => {
                                        if(category.frontmatter.title === "Current Location"){
                                            return
                                        }
                                        return <option value={category.frontmatter.title}>{category.frontmatter.title}</option>
                                    })}
                                </select>

                                {data.locations.edges.map(({node:location}, index) => {
                                    let distanceFromStart = distance(xCoord, yCoord, location.frontmatter.longitude, location.frontmatter.latitude, "K")

                                    if(distanceFromStart <= 105 && (location.frontmatter.category === filterCategory  || filterCategory === "Select Category")){
                                    return <div className={styles.locationCard} style={{order:Number(distanceFromStart).toFixed(0)}} key={index} onClick={() => {setCurrentX(0);setCurrentY(0);setTimeout(()=>{setCurrentX(location.frontmatter.longitude);setCurrentY(location.frontmatter.latitude)}, 100)}}>
                                        <div className={styles.cardCover}>
                                            <Image fluid={location.frontmatter.coverImage.childImageSharp.fluid} alt='' />
                                        </div>
                                        <div className={styles.cardText}>
                                            <p className={styles.cardTitle}>{location.frontmatter.name}</p>
                                            <p className={styles.cardAddress}>{location.frontmatter.address}</p>
                                            <p className={styles.distance}>{distanceFromStart} km</p>
                                        </div>
                                    </div>
                                    }
                                })}


                            </div>   
                        </React.Fragment>
                        }
                    </div>
                </main>
            </Layout>
        )
}

export default FindPlaces
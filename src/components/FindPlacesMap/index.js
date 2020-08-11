import React from 'react'
import {useStaticQuery, graphql} from 'gatsby'

import styles from './find-places-map.module.scss'
import {icon} from 'leaflet'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

const FindPlacesMap = ({locations, zoom, expanded, xCoord, yCoord, currentX, currentY}) => {

    const data = useStaticQuery(graphql`
    query findPlacesMap{
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
        <div className={`${styles.map} ${expanded && styles.isExpanded}`}>
        {
            typeof window !== 'undefined' &&
            <Map center={currentY == undefined ? [44.823070, 20.453420] : [currentY, currentX]} zoom={zoom}>
                <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                {locations.map(({node:location}) => {
                    
                    
                let category = data.categories.edges.find(({node:category}) => location.frontmatter.category === category.frontmatter.title)
                    
                    return <Marker position={[location.frontmatter.latitude, location.frontmatter.longitude]} icon={icon({iconUrl:category.node.frontmatter.categoryPin.publicURL, iconSize: [20, 28.57]})}>
                        <Popup>{location.frontmatter.name}</Popup>
                    </Marker>
                })}
                {
                    yCoord != undefined &&
                <Marker position={[yCoord, xCoord]} icon={icon({iconUrl:data.currentLocationCategory.edges[0].node.frontmatter.categoryPin.publicURL, iconSize: [20, 28.57]})}>
                    <Popup>Current Location</Popup>
                </Marker>
                }
            </Map>
    }    
    </div>
    )
}

export default FindPlacesMap
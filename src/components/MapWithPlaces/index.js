import React, {useState, useEffect} from 'react'
import {useStaticQuery, graphql} from 'gatsby'
import Image from 'gatsby-image'
import {Helmet} from 'react-helmet'

import Layout from '../Layout'
import styles from './map-with-places.module.scss'
import { useQueryParam, NumberParam } from 'use-query-params'
import {icon} from 'leaflet'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

import expandButton from '../../img/down-arrow.svg'
import loadingIndicator from '../../img/loading-indicator.svg'

const MapWithPlaces = () => {

    const data = useStaticQuery(graphql`
    query findPlacesMain{
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
        } 
    `)

    return (
        <div className={`${styles.map}`}>
        {
            typeof window !== 'undefined' &&
            <Map center={[44.823070, 20.453420]} zoom={6}>
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
            </Map>
    }    
    </div>
    )
}

export default MapWithPlaces
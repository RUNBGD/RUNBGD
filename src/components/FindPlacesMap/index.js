import React, { useEffect, useRef } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'

import styles from './find-places-map.module.scss'
import { icon } from 'leaflet'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

const FindPlacesMap = ({
  locations,
  zoom,
  expanded,
  xCoord,
  yCoord,
  currentX,
  currentY,
  setCurrentX,
  setCurrentY,
  handleUserInteraction,
  onClick,
  clickedLocation,
  setClickedLocation
}) => {
  const data = useStaticQuery(graphql`
    query findPlacesMap {
      categories: allMarkdownRemark(
        filter: { frontmatter: { templateKey: { eq: "location-category" } } }
      ) {
        edges {
          node {
            frontmatter {
              title
              categoryPin {
                publicURL
              }
            }
          }
        }
      }
      subcategories: allMarkdownRemark(
        filter: { frontmatter: { templateKey: { eq: "location-subcategory" } } }
      ) {
        edges {
          node {
            frontmatter {
              title
              categoryPin {
                publicURL
              }
            }
          }
        }
      }
      currentLocationCategory: allMarkdownRemark(
        filter: {
          frontmatter: {
            templateKey: { eq: "location-category" }
            title: { eq: "Current Location" }
          }
        }
      ) {
        edges {
          node {
            frontmatter {
              categoryPin {
                publicURL
              }
            }
          }
        }
      }
    }
  `)

  const popupRef = useRef(null)

  function onPopupClick(location){
    setClickedLocation(undefined)
    setCurrentX(0)
    setCurrentY(0)
    setTimeout(() => {
      setCurrentX(location.frontmatter.longitude)
      setCurrentY(location.frontmatter.latitude)
    }, 100)
    onClick && onClick(location)
  }

  useEffect(() => {
    const popup = popupRef.current
    if(popup != null){
      popup.leafletElement.options.leaflet.map.closePopup()
    }
  })

  return (
    <div className={`${styles.map} ${expanded && styles.isExpanded}`}>
      {typeof window !== 'undefined' && (
        <Map
          center={
            currentY == undefined ? [44.82307, 20.45342] : [currentY, currentX]
          }
          zoom={zoom}
          onClick={handleUserInteraction}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            subdomains={'abcd'}
          />
          {locations.map(({ node: location }) => {
            let iconUrl = undefined
            let category = data.categories.edges.find(
              ({ node: category }) =>
                location.frontmatter.category === category.frontmatter.title
            )
            let subcategory = data.subcategories.edges.find(
              ({ node: subcategory }) =>
                subcategory.frontmatter.title ===
                location.frontmatter.subcategory
            )

            if (subcategory) {
              iconUrl = subcategory.node.frontmatter.categoryPin.publicURL
            } else if (category) {
              iconUrl = category.node.frontmatter.categoryPin.publicURL
            } 

            if(location.frontmatter.pin && location.frontmatter.pin.publicURL){
              iconUrl = location.frontmatter.pin.publicURL
            }

            return (
              <Marker
                position={[
                  location.frontmatter.latitude,
                  location.frontmatter.longitude,
                ]}
                icon={icon({ iconUrl, iconSize: [20, 20] })}
              >
                <Popup
                  ref={popupRef}
                  className={styles.popup}
                >
                  <div className={styles.popupInnerContainer} onClick={() => onPopupClick(location)}>
                    {
                      location.frontmatter.coverImage &&
                      <Image
                        className={styles.popupImage}
                        fluid={
                          location.frontmatter.coverImage.childImageSharp.fluid
                        }
                      />
                    }
                    <span>
                      {location.frontmatter.name}
                    </span>
                  </div>
                </Popup>
              </Marker>
            )
          })}
          {yCoord != undefined && (
            <Marker
              position={[yCoord, xCoord]}
              icon={icon({
                iconUrl:
                  data.currentLocationCategory.edges[0].node.frontmatter
                    .categoryPin.publicURL,
                iconSize: [20, 20],
              })}
            >
              <Popup>Current Location</Popup>
            </Marker>
          )}
        </Map>
      )}
    </div>
  )
}

export default FindPlacesMap

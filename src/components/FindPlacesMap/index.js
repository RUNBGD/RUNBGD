import React, { useEffect, useRef } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'

import styles from './find-places-map.module.scss'
import { icon } from 'leaflet'
import { Map, Marker, Popup, TileLayer, FeatureGroup } from 'react-leaflet'

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
  setClickedLocation,
  filterCategory = 'Select Category'
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
  const mapRef = useRef(null)
  const groupRef = useRef(null)

  function onPopupClick(location) {
    setClickedLocation(undefined)
    setCurrentX(0)
    setCurrentY(0)
    setTimeout(() => {
      setCurrentX(
        location.frontmatter.longitude ? location.frontmatter.longitude : 0
      )
      setCurrentY(
        location.frontmatter.longitude ? location.frontmatter.latitude : 0
      )
    }, 100)
    onClick && onClick(location)
  }

  useEffect(() => {
    const popup = popupRef.current
    if (popup != null) {
      popup.leafletElement.options.leaflet.map.closePopup()
    }
  })

  const fitMarkers = (e) => {
    let groupCurrent = groupRef.current;
    let mapCurrent = mapRef.current;
    if(groupCurrent && mapCurrent){
      let map = mapCurrent.leafletElement;  //get native Map instance
      let group = groupCurrent.leafletElement; //get native featureGroup instance
      if(!e){
        if(group && map && Object.keys(group._layers).length > 0){
          map.fitBounds(group.getBounds());
        }
      }else{
        if(Object.keys(e.target._layers).length > 0){
          map.fitBounds(e.target.getBounds());
        }
      }
    }  
  }

  useEffect(() => {
    fitMarkers()
  }, [mapRef, filterCategory])

  useEffect(() => {
    const fitMarkersTimeout = setTimeout(() => {
      fitMarkers()
    }, 1000)

    return () => clearTimeout(fitMarkersTimeout)
  }, [groupRef])


  return (
    <div className={`${styles.map} ${expanded && styles.isExpanded}`}>
      {typeof window !== 'undefined' && (
        <Map
          tap={false}
          ref={mapRef}
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
          <FeatureGroup ref={groupRef} onAdd={fitMarkers}>
          {locations &&
            locations.length > 0 &&
            locations.map(({ node: location }) => {
              let iconUrl = undefined
              let category =
                data.categories &&
                data.categories.edges.length > 0 &&
                data.categories.edges.find(({ node: category }) => {
                  if (
                    location.frontmatter.category &&
                    category.frontmatter.title
                  ) {
                    return (
                      location.frontmatter.category ===
                      category.frontmatter.title
                    )
                  } else {
                    return false
                  }
                })
              let subcategory = data.subcategories.edges.find(
                ({ node: subcategory }) => {
                  if (
                    subcategory.frontmatter.title &&
                    location.frontmatter.subcategory
                  ) {
                    return (
                      subcategory.frontmatter.title ===
                      location.frontmatter.subcategory
                    )
                  } else {
                    return false
                  }
                }
              )

              if (subcategory) {
                iconUrl =
                  subcategory.node.frontmatter.categoryPin &&
                  subcategory.node.frontmatter.categoryPin.publicURL
              } else if (category) {
                iconUrl =
                  category.node.frontmatter.categoryPin &&
                  category.node.frontmatter.categoryPin.publicURL
              }

              if (
                location.frontmatter.pin &&
                location.frontmatter.pin.publicURL
              ) {
                iconUrl = location.frontmatter.pin.publicURL
              }

              return (
                ((filterCategory == 'Select Category' || filterCategory == location.frontmatter.category) && iconUrl) && 
                <Marker
                  position={[
                    location.frontmatter.latitude
                      ? location.frontmatter.latitude
                      : 0,
                    location.frontmatter.longitude
                      ? location.frontmatter.longitude
                      : 0,
                  ]}
                  icon={icon({ iconUrl, iconSize: [20, 20] })}
                >
                  <Popup ref={popupRef} className={styles.popup}>
                    <div
                      className={styles.popupInnerContainer}
                      onClick={() => onPopupClick(location)}
                    >
                      {location.frontmatter.coverImage &&
                        location.frontmatter.coverImage.childImageSharp &&
                        location.frontmatter.coverImage.childImageSharp
                          .fluid && (
                          <Image
                            className={styles.popupImage}
                            fluid={
                              location.frontmatter.coverImage.childImageSharp
                                .fluid
                            }
                          />
                        )}
                      <span>{location.frontmatter.name}</span>
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          {yCoord != undefined && (
              data.currentLocationCategory &&
              data.currentLocationCategory.edges.length > 0 &&
              data.currentLocationCategory.edges[0] &&
              data.currentLocationCategory.edges[0].node.frontmatter
                .categoryPin &&
              data.currentLocationCategory.edges[0].node.frontmatter
                .categoryPin.publicURL &&
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
          </FeatureGroup>
        </Map>
      )}
    </div>
  )
}

export default FindPlacesMap

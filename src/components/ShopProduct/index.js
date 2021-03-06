import React, { useState, useEffect } from 'react'
import Image from 'gatsby-image'

import styles from './shop-product.module.scss'

const ShopProduct = ({ images, title, price, availableSizes, showFirst }) => {
  const [hovered, setHovered] = useState(false)
  const [currentImage, setCurrentImage] = useState(
    images &&
      images.length > 0 &&
      images[1] &&
      images[1].image &&
      images[1].image.childImageSharp &&
      images[1].image.childImageSharp.fluid &&
      images[1].image.childImageSharp.fluid
  )

  return (
    <div
      className={styles.productContainer}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`${styles.mainInformation} ${hovered && styles.invisible}`}
      >
        <div className={styles.image}>
          {images &&
            images.length > 0 &&
            images[0] &&
            images[0].image &&
            images[0].image.childImageSharp &&
            images[0].image.childImageSharp.fluid && (
              <Image
                className={styles.fullHeightImage}
                fluid={images[0].image.childImageSharp.fluid}
                alt=""
              />
            )}
        </div>
        <div>
          <p className={styles.title}>{title}</p>
          <p className={styles.price}>€{price}</p>
        </div>
      </div>
      <div className={`${styles.miscInformation} ${hovered && styles.visible}`}>
        <div className={styles.image}>
          {currentImage ? (
            <Image
              className={styles.fullHeightImage}
              fluid={currentImage}
              alt=""
            />
          ) : (
            images &&
            images.length > 0 &&
            images[0] &&
            images[0].image &&
            images[0].image.childImageSharp &&
            images[0].image.childImageSharp.fluid && (
              <Image
                className={styles.fullHeightImage}
                fluid={images[0].image.childImageSharp.fluid}
                alt=""
              />
            )
          )}
        </div>
        <div className={styles.thumbnailsContainer}>
          {images &&
            images.length > 0 &&
            images.map((image, index) => {
              if (index < 4) {
                return (
                  <div
                    className={styles.thumbnail}
                    onMouseEnter={() =>
                      setCurrentImage(
                        images &&
                          images.length > 0 &&
                          images[index] &&
                          images[index].image &&
                          images[index].image.childImageSharp &&
                          images[index].image.childImageSharp.fluid
                      )
                    }
                  >
                    {image &&
                      image.image &&
                      image.image.childImageSharp &&
                      image.image.childImageSharp.fluid && (
                        <Image
                          fluid={image.image.childImageSharp.fluid}
                          alt=""
                        />
                      )}
                  </div>
                )
              }
            })}
        </div>
        <div>
          {availableSizes &&
          availableSizes.some(size => size.quantity > 0) &&
          (
            <React.Fragment>
              <p className={styles.miscText}>Available Sizes</p>
              <p className={styles.miscText}>
                {availableSizes
                  .filter((size) => size.quantity > 0)
                  .map((size) => size.size)
                  .join(',')}
              </p>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShopProduct

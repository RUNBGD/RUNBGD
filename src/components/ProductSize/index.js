import React, { useEffect, useState } from 'react'

import styles from './product-size.module.scss'
import getProductAvailability from '../../utils/getProductAvailability'

const ProductSize = ({size, selectedSize, index, setSelectedSize, data}) => {

  const [sizeAvailable, setSizeAvailable] = useState(false)

  useEffect(() => {
    getProductAvailability(
      data.product.fields.slug,
      size.size,
      data.product.frontmatter.sizes,
      setSizeAvailable
    )
  }, [])

  return(
    <div
      onClick={() => {
        console.log(size)
        size.quantity > 0 && !sizeAvailable && setSelectedSize(size.size)
      }}
      className={`${styles.size} ${
        (size.quantity <= 0 || sizeAvailable) && styles.notAvailable
      } ${selectedSize === size.size && styles.selected}`}
      key={index}
    >
      {size.size}
    </div>
  )
}

export default ProductSize
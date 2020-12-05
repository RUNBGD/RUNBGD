import React, { useState, useEffect } from 'react'
import Image from 'gatsby-image'
import { useDispatch } from 'react-redux'
import Link from 'gatsby-link'

import styles from './cart-item.module.scss'

const CartItem = ({ item: product, key, representational }) => {
  let dispatch = useDispatch()

  let [quantity, setQuantity] = useState(product.quantity)

  useEffect(() => {
    let itemWithNewQuantity = { ...product }
    itemWithNewQuantity.quantity = quantity
    dispatch({ type: 'CHANGE_QUANTITY', payload: itemWithNewQuantity })
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_PRODUCT', payload: product.id })
    }
  }, [quantity])

  const setProductQuantity = (action) => {
    switch(action){
      case 'ADD_ONE':
        if(quantity < product.product.frontmatter.sizes.find(size => size.size == product.size).quantity){
          setQuantity((prevState) => prevState + 1);
        }
        break;
      case 'REMOVE_ONE':
        setQuantity((prevState) => prevState - 1);
        break;
      default:
        break;
    }
  }

  console.log(product.product.frontmatter.sizes.find(size => size.size == product.size), product)

  return (
    <div className={styles.cartItem} key={key}>
      <div className={styles.itemImage}>
        <Link to={product.product.fields.slug}>
          {product.product.frontmatter.images.length > 0 &&
            product.product.frontmatter.images[0] &&
            product.product.frontmatter.images[0].image &&
            product.product.frontmatter.images[0].image.childImageSharp &&
            product.product.frontmatter.images[0].image.childImageSharp &&
            product.product.frontmatter.images[0].image.childImageSharp
              .fluid && (
              <Image
                fluid={
                  product.product.frontmatter.images[0].image.childImageSharp
                    .fluid
                }
                alt=""
              />
            )}
        </Link>
      </div>
      <div className={styles.itemInformation}>
        <Link to={product.product.fields.slug}>
          <h2 className={styles.itemName}>
            {product.product.frontmatter.title}
          </h2>
          <p className={styles.itemDescription}>
            {product.product.frontmatter.description}
          </p>
          {product.size !== undefined &&
            product.product.frontmatter.sizes.length > 0 &&
            product.product.frontmatter.sizes[product.size] && (
              <p className={styles.itemSize}>
                Size: {product.product.frontmatter.sizes[product.size].size}
              </p>
            )}
        </Link>
      </div>
      <div className={styles.quantity}>
        {!representational &&
          <button onClick={() => setProductQuantity('REMOVE_ONE')}>
            -
          </button>
        }
        <p>
          {product.quantity}
        </p>
        {
          !representational &&
          <button onClick={() => setProductQuantity('ADD_ONE')}>
            +
          </button>
        }
      </div>
      <div className={styles.itemPrice}>
        €{quantity * product.product.frontmatter.price}
      </div>
    </div>
  )
}

export default CartItem

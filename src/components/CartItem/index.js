import React, {useState, useEffect} from 'react'
import Image from 'gatsby-image'
import {useDispatch} from 'react-redux'

import styles from './cart-item.module.scss'

const CartItem = ({item:product}) => {

    let dispatch = useDispatch()

    let [quantity, setQuantity] = useState(product.quantity)

    useEffect(() => {
        let itemWithNewQuantity = {...product}
        itemWithNewQuantity.quantity = quantity
        dispatch({type:'CHANGE_QUANTITY', payload: itemWithNewQuantity})
        if(quantity <= 0){
            dispatch({type:'REMOVE_PRODUCT', payload:product.id})
        }
    }, [quantity])

    return (
        <div className={styles.cartItem}>
            <div className={styles.itemImage}>
                <Image fluid={product.product.frontmatter.images[0].image.childImageSharp.fluid} alt=''/>
            </div>
            <div className={styles.itemInformation}>
                <h2 className={styles.itemName}>
                    {product.product.frontmatter.title}
                </h2>
                <p className={styles.itemDescription}>{product.product.frontmatter.description}</p>
                {product.size !== undefined && 
                    <p className={styles.itemSize}>Size: {product.product.frontmatter.sizes[product.size].size}</p>
                }
            </div>
            <div className={styles.quantity}>
                <button onClick={() => setQuantity(prevState => prevState - 1)}>-</button>
                {product.quantity}
                <button onClick={() => setQuantity(prevState => prevState + 1)}>+</button>
            </div>
            <div className={styles.itemPrice}>
                €{quantity * product.product.frontmatter.price}
            </div>
        </div>
    )
}

export default CartItem
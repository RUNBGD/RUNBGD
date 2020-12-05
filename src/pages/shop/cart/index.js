import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Image from 'gatsby-image'
import { Helmet } from 'react-helmet'
import Link from 'gatsby-link'

import Layout from '../../../components/Layout'
import styles from './cart.module.scss'
import CartItem from '../../../components/CartItem'
import emptyCartImage from '../../../img/empty-cart.png'

const Cart = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    addToStateFromLocalStorage()
  }, [])

  function addToStateFromLocalStorage() {
    if (typeof window !== 'undefined') {
      if (JSON.parse(localStorage.getItem('cartItems'))) {
        dispatch({
          type: 'ADD_FROM_LOCAL_STORAGE',
          payload: JSON.parse(localStorage.getItem('cartItems')),
        })
      }
    }
  }

  let products = useSelector((state) => state)

  return (
    <Layout>
      <Helmet>
        <title>Cart | RUN BGD</title>
        <meta
          name="description"
          content={`Welcome to RUN BGD Shop Cart. Here you can see everything you choose to buy from our official RUN BGD Shop.`}
        />
      </Helmet>
      <main className={styles.pageContainer}>
        <h1>Cart</h1>
        <div className={styles.checkoutSection}>
          {products.length > 0 ? (
            <React.Fragment>
              <div className={styles.products}>
                <div className={styles.columnNames}>
                  <div className={styles.product}>Product</div>
                  <div className={styles.quantity}>Quantity</div>
                  <div className={styles.price}>Price</div>
                </div>
                <div className={styles.cartItems}>
                  {products &&
                    products.map((product, index) => {
                      if (product !== undefined) {
                        return <CartItem key={index} item={product} />
                      }
                    })}
                </div>
              </div>
              <div className={styles.totalPrice}>
                <p>Total Price</p>
                <p className={styles.totalPriceAmount}>
                  €
                  {products &&
                    products.reduce((a, b) => {
                      return a + b.quantity * b.product.frontmatter.price
                    }, 0)}
                </p>
                <Link to={'/shop/checkout'} className={styles.primaryButton}>
                    Chekout Now
                </Link>
              </div>
            </React.Fragment>
          ) : (
            <div className={styles.emptyCartContainer}>
              <div className={styles.emptyCartImageContainer}>
                <img src={emptyCartImage} alt="" />
              </div>
              <p>
                Currently there are no items in your cart. You can find our
                merch in <br />
                <Link to="/shop">shop</Link>
              </p>
            </div>
          )}
        </div>
      </main>
    </Layout>
  )
}

export default Cart

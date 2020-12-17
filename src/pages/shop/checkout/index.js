import React, {useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet'
import Link from 'gatsby-link'
import {navigate} from 'gatsby'

import Layout from '../../../components/Layout'
import styles from './checkout.module.scss'
import CartItem from '../../../components/CartItem'
import emptyCartImage from '../../../img/empty-cart.png'
import successfulOrderImage from '../../../img/successful-order.png'
import PayOnArrivalForm from '../../../components/PayOnArrivalForm'
import PayWithCardForm from '../../../components/PayWithCardForm'

const CheckoutPage = () => {
  let products = useSelector((state) => state)
  const dispatch = useDispatch()
  
  const [totalPrice, setTotalPrice] = useState(0)
  const [successfulOrder, setSuccessfulOrder] = useState(undefined);

  const [productPrice, setProductPrice] = useState(products && products.reduce((a, b) => {
    return a + b.quantity * b.product.frontmatter.price
  }, 0))

  const [shippingPrice, setShippingPrice] = useState(0)  
  
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

  const successfulOrderHandler = () => {
    localStorage.setItem('cartItems', JSON.stringify([]))
    dispatch({
      type: 'ADD_FROM_LOCAL_STORAGE',
      payload: JSON.parse(localStorage.getItem('cartItems')),
    })
    setSuccessfulOrder(true)
  }

  return (
    <Layout> 
      <Helmet>
        <base target="_blank" href="/" />
        <title>Shop | RUN BGD</title>
        <meta
          name="description"
          content={`Official RUN BGD Shop. Buy anything from t-shirts to miscellaneous accessories.`}
        />
      </Helmet>
      <main className={styles.pageContainer}>
        <h1>Checkout</h1>
        <div className={styles.checkoutSection}>
          {products.length > 0 ? (
            <React.Fragment>
              <div className={styles.products}>
                <h2>You are about to buy:</h2>
                <div className={styles.columnNames}>
                  <div className={styles.product}>Product</div>
                  <div className={styles.quantity}>Quantity</div>
                  <div className={styles.price}>Price</div>
                </div>
                <div className={styles.cartItems}>
                  {products &&
                    products.map((product, index) => {
                      if (product !== undefined) {
                        return <CartItem key={index} item={product} representational/>
                      }
                    })}
                </div>
                {
                products && products.length > 0 &&
                <>
                  <h2>Payment methods</h2>
                  <div className={styles.shadowCard}>
                      <PayOnArrivalForm
                        setTotalPrice={setTotalPrice}
                        price={products &&
                          products.reduce((a, b) => {
                            console.log(a)
                            return a + b.quantity * b.product.frontmatter.price
                          }, 0)}
                        products={products}
                        totalPrice={totalPrice}
                        setShippingPriceToParent={setShippingPrice}
                        onSuccess={successfulOrderHandler}
                      />
                      {/* <PayWithCardForm
                        products={products}
                        price={products &&
                          products.reduce((a, b) => {
                            console.log(a)
                            return a + b.quantity * b.product.frontmatter.price
                          }, 0)}
                        totalPrice={totalPrice}
                        setShippingPriceToParent={setShippingPrice}
                        setTotalPrice={setTotalPrice}
                        onSuccess={successfulOrderHandler}
                      /> */}
                  </div>
                </>
                }
              </div>
              <div className={styles.totalPrice}>
                <p>
                  Products
                </p>
                <p>
                  €
                  {products &&
                    products.reduce((a, b) => {
                      console.log(a)
                      return a + b.quantity * b.product.frontmatter.price
                    }, 0)}
                </p>
                <hr/>
                <p>
                  Shipping
                </p>
                <p>
                  €
                  {
                    shippingPrice
                  }
                </p>
                <hr/>
                <p>
                  Total Price
                </p>
                <p className={styles.totalPriceAmount}>
                  €{totalPrice}
                </p>
                <div className={styles.paymentMethodsContainer}>
                  
                </div>
              </div>
            </React.Fragment>
          ) : (
            successfulOrder ?
            <div className={styles.emptyCartContainer}>
              <div className={styles.emptyCartImageContainer}>
                <img src={successfulOrderImage} alt="" />
              </div>
              <p>
                Order successfully placed, check your email for details!
              </p>
            </div>
            :
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

export default CheckoutPage
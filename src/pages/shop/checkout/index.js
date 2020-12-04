import React, {useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet'
import Link from 'gatsby-link'
import {navigate} from 'gatsby'

import Layout from '../../../components/Layout'
import styles from './checkout.module.scss'
import CartItem from '../../../components/CartItem'
import emptyCartImage from '../../../img/empty-cart.png'
import PayOnArrivalForm from '../../../components/PayOnArrivalForm'

const CheckoutPage = () => {
  let products = useSelector((state) => state)
  const dispatch = useDispatch()
  
  const [productPrice, setProductPrice] = useState(products ? products.reduce((a, b) => {
    return a + b.quantity * b.product.frontmatter.price
  }, 0) : totalPrice)

  const [shippingPrice, setShippingPrice] = useState(0)
  
  useEffect(() => {
    if(totalPrice > 0){
      setShippingPrice(Number(totalPrice) - Number(productPrice))
    }else{
      setShippingPrice(0)
    }
  }, [productPrice, totalPrice])

  
  const [totalPrice, setTotalPrice] = useState(0)
  
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


  return (
    <Layout> 
      <Helmet>
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
                <h2>Payment methods</h2>
                <div className={styles.shadowCard}>
                    <PayOnArrivalForm
                      setTotalPrice={setTotalPrice}
                      price={products &&
                        products.reduce((a, b) => {
                          console.log(a)
                          return a + b.quantity * b.product.frontmatter.price
                        }, 0)}
                      totalPrice={totalPrice}
                      onSuccess={() => {
                        localStorage.setItem('cartItems', JSON.stringify([]))
                        setTimeout(() => {
                          navigate('/shop/confirmation')
                        }, 1000)
                      }}
                    />
                </div>
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
import React, {useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import Image from 'gatsby-image'

import Layout from '../../../components/Layout'
import styles from './cart.module.scss'
import CartItem from '../../../components/CartItem'

const Cart = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        addToStateFromLocalStorage()
    }, [])

    function addToStateFromLocalStorage(){
        if(JSON.parse(localStorage.getItem('cartItems'))){
            dispatch({type:'ADD_FROM_LOCAL_STORAGE', payload:JSON.parse(localStorage.getItem('cartItems'))})
        }
    }

    let products = useSelector(state => state)

    return(
        <Layout>
            <main>
            <h1>Cart</h1>
            <div className={styles.checkoutSection}>
                <div className={styles.products}>
                    <div className={styles.columnNames}>
                        <div className={styles.product}>
                            Product
                        </div>
                        <div className={styles.quantity}>
                            Quantity
                        </div>
                        <div className={styles.price}>
                            Price
                        </div>
                    </div>
                    <div className={styles.cartItems}>
                    {products && 
                        products.map((product, index) => {
                            if(product !== undefined){
                                return <CartItem key={index} item={product}/>
                            }
                        })
                    }
                    </div>
                </div>
                <div className={styles.totalPrice}>
                    <p>Total Price</p>
                    <p className={styles.totalPriceAmount}>
                        €{products && products.reduce((a, b) => {console.log(a);return (a  + b.quantity * b.product.frontmatter.price)}, 0)}
                    </p>
                    <button>PayPal</button>
                    <button>Credit Card</button>
                </div>
            </div>
            </main>
        </Layout>
    )
}

export default Cart
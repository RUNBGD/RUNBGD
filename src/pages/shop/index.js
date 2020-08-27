import React from 'react'
import {useStaticQuery, graphql} from 'gatsby'

import Layout from '../../components/Layout'
import styles from './shop.module.scss'
import ShopProduct from '../../components/ShopProduct'

const Shop = () => {

    const data = useStaticQuery(graphql`
        query Shop{
            products:allMarkdownRemark(filter:{frontmatter:{templateKey:{eq:"shop-product"}}}){
                edges{
                    node{
                        frontmatter{
                            title
                            price
                            images{
                                image{
                                    childImageSharp{
                                        fluid(maxWidth:900, quality:64){
                                            ...GatsbyImageSharpFluid
                                        }
                                    }
                                }
                            }
                            sizes{
                                size
                                available
                            }
                        }
                    }
                }
            }
        }
    `)

    return(
        <Layout fullWidth={true}>
            <main>
                <div className={styles.productContainer}>
                    {data.products.edges.map(({node: product}) => {
                        return <div className={styles.product}>
                            <ShopProduct title={product.frontmatter.title} images={product.frontmatter.images} price={product.frontmatter.price} availableSizes={product.frontmatter.sizes}/>
                        </div>
                    })}
                </div>
            </main>
        </Layout>
    )
}

export default Shop
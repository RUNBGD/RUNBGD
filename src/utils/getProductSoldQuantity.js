export default async function getProductSoldQuantity(uid, size) {
  try {
    let response = await fetch(
      `/.netlify/functions/get-product-availability?uid=${uid}&size=${size}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }
    )
    response = await response.json()
    let quantity

    if (response.product[0]) {
      quantity = response.product[0].sold
    } else {
      quantity = 0
    }
    return quantity
  } catch (error) {
    console.log(error)
  }
}

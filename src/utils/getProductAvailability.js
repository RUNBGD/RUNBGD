export default function getProductAvailability(
  uid,
  size,
  productSizes,
  setProductSold
) {
  fetch(
    `/.netlify/functions/get-product-availability?uid=${uid}&size=${size}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    }
  )
    .then((response) => response.json())
    .then((response) => {
      if (response.product && response.product[0]) {
        let quantity = productSizes.find(
          (node) => node.size.document.data.title == response.product[0].size
        ).quantity
        if (response.product[0].sold >= quantity) {
          setProductSold(true)
        }
        console.log(response.product[0].sold, quantity)
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

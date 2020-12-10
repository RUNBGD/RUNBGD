export default function updateSoldProducts(productList, onSuccess) {
  productList.forEach((node) => {
    console.log(node)
    fetch(
      `/.netlify/functions/update-sold-products?uid=${node.id}&size=${node.size}&quantity=${node.quantity}`,
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
        onSuccess()
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
      })
  })
}

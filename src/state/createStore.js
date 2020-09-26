import { createStore } from 'redux'

function cartItems(state = [], action) {
  switch (action.type) {
    case 'ADD_FROM_LOCAL_STORAGE':
      return [...action.payload]
    case 'ADD_PRODUCT':
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'cartItems',
          JSON.stringify([...state, action.payload])
        )
      }
      return [...state, action.payload]
    case 'REMOVE_PRODUCT':
      let indexOfItem = [...state].findIndex((product) => {
        return action.payload == product.id
      })
      let newState = [...state]
      newState.splice(indexOfItem, 1)

      if (typeof window !== 'undefined') {
        localStorage.setItem('cartItems', JSON.stringify(newState))
      }

      return newState
    case 'CHANGE_QUANTITY':
      if ([...state].length > 0) {
        let changedQuantityArray = [...state].map((product) => {
          if (product.id == action.payload.id) {
            return action.payload
          } else {
            return product
          }
        })
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'cartItems',
            JSON.stringify(changedQuantityArray)
          )
        }
        return changedQuantityArray
      }
    default:
      return state
  }
}

export default (preloadedState) => {
  return createStore(cartItems, preloadedState)
}

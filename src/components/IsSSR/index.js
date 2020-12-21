import React from 'react'

const IsSSR = ({children}) => {

  const isSSR = typeof window === "undefined"
  
  return (
    !isSSR && (
      <>
        {children}
      </>
    )
  )
}

export default IsSSR
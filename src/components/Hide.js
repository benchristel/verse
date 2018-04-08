import React from 'react'

export default props => {
  if (!props.If) {
    return (<div>
      {props.children}
    </div>)
  }
  return null
}

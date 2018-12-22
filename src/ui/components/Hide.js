import React from 'react'

export default props => {
  let style = props.If ? {display: 'none'} : {}
  return (<div style={style}>
    {props.children}
  </div>)
}

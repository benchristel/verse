import React from 'react'
import './Button.css'

export default props => (
  <div className={'Button ' + props.className}
    style={{
      borderColor: props.color,
      color: props.color
    }}
    onClick={props.onClick}>

    {props.children}
  </div>
)

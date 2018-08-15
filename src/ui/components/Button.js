import React from 'react'
import './Button.css'

export default props => (
  <div className={'Button ' + props.className}
    style={{
      border: '2px solid ' + props.color,
      color: props.color
    }}
    onClick={props.onClick}>

    {props.children}
  </div>
)

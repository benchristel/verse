import React from 'react'
import './Button.css'

export default props => (
  <div className="Button"
    style={props.style}
    onClick={props.onClick}>

    {props.children}
  </div>
)

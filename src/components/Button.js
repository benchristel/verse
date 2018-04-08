import React from 'react'
import connectProps from './connectProps'
import './Button.css'

export default connectProps(props => (
  <div className="Button"
    style={props.style}
    onClick={props.onClick}
  >
    {props.children}
  </div>
))

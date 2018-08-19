import React from 'react'
import connectProps from './connectProps'
import './Pane.css'

export default connectProps(props => (
  <div className={"Pane " + props.className} style={props.style}>
    {props.children}
  </div>
))

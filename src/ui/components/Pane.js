import React from 'react'
import './Pane.css'

export default props => (
  <div className={"Pane " + props.className} style={props.style} onClick={props.onClick}>
    {props.children}
  </div>
)

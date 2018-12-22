import React from 'react'
import './Tab.css'

export default props => (
  <div className={'Tab ' + props.className}
    style={{
      borderColor: props.color,
      color: props.color
    }}
    onClick={props.onClick}>

    {props.children}
  </div>
)

import React from 'react'
import connectProps from './connectProps'
import './Backdrop.css'

export default connectProps(props => (
  <div className="Backdrop">
    {props.children}
  </div>
))

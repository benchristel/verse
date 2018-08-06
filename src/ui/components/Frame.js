import React from 'react'
import './Frame.css'

export default props => {
  return (
    <div className="Frame">
      {props.children}
    </div>
  )
}

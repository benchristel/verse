import React from 'react'
import './CenteredContainer.css'

export default props => {
  let style = {
    width: props.width,
    height: props.height,
    top: `calc(50% - ${props.height} / 2)`,
    left: `calc(50% - ${props.width} / 2)`
  }
  return (
    <div className="CenteredContainer" style={style}>
      {props.children}
    </div>
  )
}

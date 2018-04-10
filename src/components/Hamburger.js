import React from 'react'
import connectProps from './connectProps'

export default connectProps(props => {
  let barStyle = {
    position: 'absolute',
    backgroundColor: '#ddd',
    height: '14.286%',
    width: '90%',
    top: '14.286%',
  }
  return (
    <div className="Hamburger" style={props.style} onClick={props.onClick}>
      <div style={{...barStyle, top: '14.286%'}}/>
      <div style={{...barStyle, top: '42.857%'}}/>
      <div style={{...barStyle, top: '71.429%'}}/>
    </div>
  )
})

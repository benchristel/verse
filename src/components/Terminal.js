import React from 'react'
import connectProps from './connectProps'
import './Terminal.css'
import Pane from './Pane'

export default connectProps(props => {
  return (
    <Pane style={{height: '600px', width: '100%', zIndex: 10}}>
      <div className="Terminal">
      {
        props.appUi.logs.map((message, i) =>
          <div className="log" key={i}>{message}</div>)
      }
    </div>
  </Pane>)
})

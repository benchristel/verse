import React from 'react'
import connectProps from './connectProps'
import './Terminal.css'
import Pane from './Pane'

export default connectProps(props => {
  let classNames = "Terminal"
  if (props.appUi.screenLines.length) classNames += ' showScreen'
  return (
    <Pane style={{height: '600px', width: '100%', zIndex: 10}}>
      <div className={classNames}>
        <div className="logs">
          {
            props.appUi.logs.map((message, i) =>
              <div className="log" key={i}>{message}</div>)
          }
        </div>
        <div className="screen">
          {
            props.appUi.screenLines.map((line, i) =>
              <div className="screenLine" key={i}>{line}</div>)
          }
      </div>
    </div>
  </Pane>)
})

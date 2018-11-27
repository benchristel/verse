import React from 'react'
import connectProps from './connectProps'
import './Terminal.css'
import Pane from './Pane'

export default connectProps(class extends React.Component {
  screenLines() {
    return this.props.appUi.screenLines
  }

  render() {
    return (
      <Pane style={{height: '608px', width: '100%'}}>
        <div className="Terminal">
          <div className="screen">
            {
              this.screenLines()
                .map((line, i) =>
                  <div className="line" key={i}>{line}</div>)
            }
          </div>
        </div>
      </Pane>
    )
  }
})

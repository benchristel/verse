import React from 'react'
import connectProps from './connectProps'
import './Terminal.css'
import Pane from './Pane'

export default connectProps(class extends React.Component {
  bottomOfLogs = null

  componentDidMount() {
    this.scrollLogsToBottom()
  }

  componentDidUpdate() {
    this.scrollLogsToBottom()
  }

  scrollLogsToBottom() {
    if (this.bottomOfLogs) {
      this.bottomOfLogs.scrollIntoView({behavior: 'smooth'})
    }
  }

  render() {
    let classNames = "Terminal"
    if (this.props.appUi.screenLines.length) classNames += ' showScreen'
    return (
      <Pane style={{height: '608px', width: '100%', top: '32px'}}>
        <div className={classNames}>
          <div className="logs">
            {
              this.props.appUi.logs.map((message, i) =>
                <div className="line" key={i}>{message}</div>)
            }
            <div ref={e => this.bottomOfLogs = e}/>
          </div>
          <div className="screen">
            {
              this.props.appUi.screenLines.map((line, i) =>
                <div className="line" key={i}>{line}</div>)
            }
          </div>
        </div>
      </Pane>
    )
  }
})

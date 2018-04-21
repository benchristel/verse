import React from 'react'
import './Grove.css'
import connectProps from './connectProps'
import Backdrop from './Backdrop'
import CenteredContainer from './CenteredContainer'
import Button from './Button'
import Editor from './Editor'
import Hide from './Hide'
import Pane from './Pane'
import Terminal from './Terminal'
import Hamburger from './Hamburger'
import storage from '../storage'

export default connectProps(class extends React.Component {
  componentWillMount() {
    storage.onLoad(files =>
      this.props.loadFiles(files, this.props))
  }

  render() {
    return (
      <div className="Grove">
        <Backdrop>
          <CenteredContainer height="640px" width="1024px">
            <LeftPane/>
            <RightPane/>
          </CenteredContainer>
        </Backdrop>
      </div>
    )
  }
})

let LeftPane = connectProps(props => {
  return (
    <Pane style={{width: '50%'}}>
      <EditorHeaderBar/>
      <Editor/>
      <Hide If={!props.menuOpen}>
        <Pane style={{right: 0, width: '240px', backgroundColor: '#2a6', zIndex: 10}}>
          <Button onClick={props.closeMenu}>CLOSE</Button>
          woot
        </Pane>
      </Hide>
    </Pane>
  )
})

const RightPane = connectProps(props => {
  return (
    <Pane style={{width: '50%', left: '50%', backgroundColor: '#020'}}>
      <Terminal/>
      <Pane style={{height: '40px', bottom: 0, width: '100%', backgroundColor: '#888', zIndex: 10, padding: '6px'}}>
        <Button onClick={() => props.runApp(props)}>Run</Button>
      </Pane>
    </Pane>
  )
})

const EditorHeaderBar = connectProps(props => {
  return (
    <div className="EditorHeaderBar" style={props.style}>
      <div className="filename">
        main.js
      </div>
      <StatusBadge style={{position: 'absolute', top: '4px', right: '40px'}}/>
      <Hamburger
        onClick={props.openMenu}
        style={{width: '32px', height: '32px', right: 0, top: 0, position: 'absolute'}}
      />
    </div>
  )
})

const StatusBadge = connectProps(props => {
  let message = 'OK'
  let className = 'StatusBadge'
  if (props.evalError) {
    message = "Can't run"
    className += ' error'
  }
  return (
    <div
      className={className}
      style={props.style}>
      {message}
    </div>
  )
})

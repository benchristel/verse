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
import stackParser from '../stackParser'

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
      <Pane style={{top: '32px', width: '100%'}}>
        <Terminal/>
      </Pane>
      <Pane style={{height: '32px', top: 0, width: '100%', backgroundColor: '#888', zIndex: 10, padding: '4px 6px'}}>
        <Button onClick={() => props.runApp(props)}>Run</Button>
      </Pane>
      <Hide If={!props.evalError || !props.isErrorPanelShown}>
        <Pane style={{height: '100%', width: '100%', backgroundColor: '#db6', zIndex: 20, padding: '12px'}}>
          <ErrorPanel />
        </Pane>
      </Hide>
    </Pane>
  )
})

const EditorHeaderBar = connectProps(props => {
  return (
    <div className="EditorHeaderBar" style={props.style}>
      <div className="filename">
        main.js
      </div>
      <StatusBadge
        onClick={() => props.evalError && props.showErrorPanel()}
        style={{position: 'absolute', top: '4px', right: '40px'}}/>
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
      onClick={props.onClick}
      className={className}
      style={props.style}>
      {message}
    </div>
  )
})

const ErrorPanel = connectProps(props => (
  <div className="ErrorPanel">{
    props.evalError.toString()
    + '\n\n' + renderStackInfo(props.evalError)
  }</div>
))

function renderStackInfo(error) {
  console.log(error)
  if (error.verseStack) {
    return 'at function ' +
      error.verseStack.join('()\n  called from ')
      + '()'
  }
  return renderLineNumber(error.stack)
}

function renderLineNumber(stack) {
  let line = stackParser(stack).line
  if (line !== null) {
    return 'at line ' + line
  }
  return ''
}

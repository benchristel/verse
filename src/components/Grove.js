import React from 'react'
import './Grove.css'
import connectProps from './connectProps'
import Backdrop from './Backdrop'
import CenteredContainer from './CenteredContainer'
import Button from './Button'
import AceEditor from 'react-ace'
import Hide from './Hide'
import Pane from './Pane'

export default connectProps(props => (
  <div className="Grove">
    <Backdrop>
      <CenteredContainer height="640px" width="1024px">
        <LeftPane/>
        <RightPane/>
      </CenteredContainer>
    </Backdrop>
  </div>
))

let LeftPane = connectProps(props => {
  return (
    <Pane style={{width: '50%'}}>
      <AceEditor
        mode="javascript"
        theme="github"
        onChange={() => {}/*todo*/}
        name="AceEditor"
        editorProps={{$blockScrolling: true}}
        style={{width: '100%', height: '95%', top: '5%', position: 'absolute'}}
      />
      <EditorHeaderBar />
      <Hide If={props.menuOpen}>

      </Hide>
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
      <Pane style={{height: '512px', width: '100%', backgroundColor: '#020', color: '#ff0', zIndex: 10}}>
        {
          props.appUi.logs.map((message, i) =>
            <div key={i}>{message}</div>)
        }
      </Pane>
      <Pane style={{height: '128px', bottom: 0, width: '100%', backgroundColor: '#888', zIndex: 10, padding: '12px'}}>
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
      <Hamburger
        onClick={props.openMenu}
        style={{width: '32px', height: '32px', right: 0, top: 0, position: 'absolute'}}
      />
    </div>
  )
})

const Hamburger = connectProps(props => {
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

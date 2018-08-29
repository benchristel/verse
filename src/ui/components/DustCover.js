import React from 'react'
import connectProps from './connectProps'
import Pane from './Pane'
import Hide from './Hide'

import './DustCover.css'

export default connectProps(props => (
  <Hide If={props.evalAllowed}>
    <Pane style={{height: '100%'}} className="DustCover" onClick={props.allowJsToRun}>
      <div>
        START
      </div>
    </Pane>
  </Hide>
))

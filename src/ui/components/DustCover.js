import React from 'react'
import connectProps from './connectProps'
import Pane from './Pane'
import Hide from './Hide'

import './DustCover.css'

export default connectProps(props => (
  <Hide If={props.evalAllowed}>
    <Pane className="DustCover" onClick={props.allowJsToRun}>
      <div>
        START
      </div>
    </Pane>
  </Hide>
))

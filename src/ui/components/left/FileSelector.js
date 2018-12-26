import React from 'react'

import connectProps from '../connectProps'

import './FileSelector.css'

export default connectProps(props => (
  <div className="FileSelector">
    <select onChange={event => props.switchFile(event.target.value)} value={props.currentlyEditingFile}>
      {
        Object.keys(props.files).sort().map(name => (
          <option key={name}>
            {name}
          </option>
        ))
      }
    </select>
  </div>
))

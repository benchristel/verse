import React from 'react'

import Pane from '../Pane'
import Editor from './Editor'

const Left = () => (
  <Pane style={{width: '50%'}}>
    <Editor/>
  </Pane>
)

export { Left }

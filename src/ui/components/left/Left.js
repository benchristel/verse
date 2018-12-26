import React from 'react'

import Pane from '../Pane'
import Editor from './Editor'
import FileSelector from './FileSelector'

const Left = () => (
  <Pane style={{width: '50%'}}>
    <Editor/>
    <FileSelector/>
  </Pane>
)

export { Left }

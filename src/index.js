import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import './index.css'
import Grove from './components/Grove'
import registerServiceWorker from './registerServiceWorker'
import './api'

ReactDOM.render(
  <Provider store={store}>
    <Grove />
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker()

import React from 'react'
import connectProps from './connectProps'
import './Terminal.css'
import Pane from './Pane'

export default connectProps(class extends React.Component {
  screenLines() {
    return this.props.appUi.screenLines
  }

  render() {
    return (
      <Pane style={{height: '608px', width: '100%'}}>
        <div className="Terminal">
          <div className="screen">
            {
              this.screenLines()
                .map((line, i) =>
                  <div className="line" key={i}>{line}</div>)
            }
            <InputForm key={this.props.appUi.formId}/>
          </div>
        </div>
      </Pane>
    )
  }
})

const InputForm = connectProps(class extends React.Component {
  onChange = label => event => {
    this.props.changeFormField(label, event.target.value)
  }

  submit() {
    this.props.submitForm()
  }

  render() {
    let form = this.props.appUi.form
    return <div className="InputForm">{
      form.map((field, index) => {
        return <InputElement
          type={field.type}
          label={field.label}
          autofocus={index === 0}
          onChange={this.onChange(field.label).bind(this)}
          key={index}/>
      })
    }{
      form.length ?
        <div>
          <button onClick={this.submit.bind(this)}>
            [  OK  ]
          </button>
        </div>
        : null
    }</div>
  }
})

const InputElement = connectProps(class extends React.Component {
  componentDidMount() {
    if (this.props.autofocus && this.element) {
      this.element.focus()
    }
  }

  setElement(el) {
    this.element = el
  }

  render() {
    switch (this.props.type) {
      case 'line':
      return <div className="Input">
        <label htmlFor={this.props.label}>{this.props.label}</label>
        <input type="text" name={this.props.label}
          ref={this.setElement.bind(this)}
          onChange={this.props.onChange}/>
      </div>

      case 'text':
      return <div className="Input">
        <textarea
          ref={this.setElement.bind(this)}
          onChange={this.props.onChange}/>
      </div>

      default:
      return <div className="Input">
      Unknown input type: {this.props.type}
      </div>
    }
  }
})

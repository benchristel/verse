import { form, lineInput } from './forms'
import { wait, startDisplay } from './effects'
import { formSubmission, formFieldChange } from './events'
import { Process } from './Process'

describe('form', () => {
  let store, view, p
  beforeEach(() => {
    view = null
    store = {
      emit: jest.fn(),
      getState: jest.fn()
    }
    p = Process(store)
  })

  it('shows the form fields', () => {
    view = p.begin(function*() {
      yield form({
        Name: lineInput('Jimmy', () => {})
      })
      yield wait(1)
    })
    expect(view.error).toBe(null)
    expect(view.form).toEqual([
      {
        label: 'Name',
        type:  'line',
        value: 'Jimmy'
      }
    ])
  })

  it('blocks until the form is submitted', () => {
    let blocked = true
    p.begin(function*() {
      yield form({
        Name: lineInput('Jimmy', () => {})
      })
      blocked = false
    })
    expect(blocked).toBe(true)
    view = p.receive(formSubmission())
    expect(blocked).toBe(false)
  })

  it('ignores non-form-related events until the form is submitted', () => {
    let blocked = true
    p.begin(function*() {
      yield form({
        Name: lineInput('Jimmy', () => {})
      })
      blocked = false
    })
    expect(blocked).toBe(true)
    p.receive({eventType: 'some event'})
    expect(blocked).toBe(true)
    p.receive({eventType: 'some event'})
    expect(blocked).toBe(true)
    p.receive(formSubmission())
    expect(blocked).toBe(false)
  })

  it('hides the form fields once the form is submitted', () => {
    view = p.begin(function*() {
      yield form({
        Name: lineInput('Jimmy', () => {})
      })
      yield wait(1)
    })
    view = p.receive(formSubmission())
    expect(view.form).toEqual([])
  })

  it('calls a callback to set the initial data value', () => {
    let name = 'unset'
    p.begin(function*() {
      yield form({
        Name: lineInput('Jimmy', _=> name=_)
      })
      yield wait(1)
    })
    expect(name).toBe('Jimmy')
  })

  it('calls a callback when the user enters data in a form field', () => {
    let data
    p.begin(function*() {
      yield form({
        Data: lineInput('', _=> data=_)
      })
      yield wait(1)
    })
    p.receive(formFieldChange('Data', 'wow'))
    expect(data).toBe('wow')
  })

  it('rerenders the view when the user enters data', () => {
    p.begin(function*() {
      let data = ''
      yield startDisplay(() => [
        data
      ])
      yield form({
        Data: lineInput('', _=> data=_)
      })
    })
    let view = p.receive(formFieldChange('Data', 'value'))
    expect(view.displayLines).toEqual(['value'])
  })

  it('does not call the callback when some other field changes', () => {
    let data = ''
    p.begin(function*() {
      yield form({
        Data:  lineInput('', _=> data=_),
        Other: lineInput('', _=>_)
      })
      yield wait(1)
    })
    p.receive(formFieldChange('Other', 'nope'))
    expect(data).toBe('')
  })

  it('throws an error when a field is changed but the form has no fields', () => {
    // this shouldn't be possible in a running app, but can
    // happen in tests, where the programmer is manually
    // crafting formFieldChange events.
    p.begin(function*() { yield form({}) })
    let view = p.receive(formFieldChange('does not exist', ''))
    expect(view.error).toEqual(Error('Received a formFieldChange event for unrecognized field "does not exist". There are no fields in the current form.'))
  })

  it('throws an error when a nonexistent field is changed', () => {
    // this shouldn't be possible in a running app, but can
    // happen in tests, where the programmer is manually
    // crafting formFieldChange events.
    p.begin(function*() {
      yield form({
        a: lineInput('', _=>_)
      })
    })
    let view = p.receive(formFieldChange('does not exist', ''))
    expect(view.error).toEqual(Error('Received a formFieldChange event for unrecognized field "does not exist". The only field that exists is "a".'))
  })

  it('throws an error when a nonexistent field is changed and the form has many fields', () => {
    // this shouldn't be possible in a running app, but can
    // happen in tests, where the programmer is manually
    // crafting formFieldChange events.
    p.begin(function*() {
      yield form({
        a: lineInput('', _=>_),
        b: lineInput('', _=>_),
        c: lineInput('', _=>_),
      })
    })
    let view = p.receive(formFieldChange('does not exist', ''))
    expect(view.error).toEqual(Error('Received a formFieldChange event for unrecognized field "does not exist". The fields that exist are "a", "b", and "c".'))
  })
})

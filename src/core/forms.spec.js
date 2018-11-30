import { form, lineInput } from './forms'
import { wait } from './effects'
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

  it('does not call the callback when some other field changes', () => {
    let data = ''
    p.begin(function*() {
      yield form({
        Data: lineInput('', _=> data=_)
      })
      yield wait(1)
    })
    p.receive(formFieldChange('unknown', 'oh no'))
    expect(data).toBe('')
  })
})

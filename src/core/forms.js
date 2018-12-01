import { doWith } from './functionalUtils'
import { entries } from './objects'
import { map } from './sequences'
import { oneOf, satisfies } from './types'
import { isString, isFunction } from './nativeTypes'
import { checkArgs } from './checkArgs'
import { showFormFields, waitForEvent, redraw } from './effects'
import { isFormSubmission, isFormFieldChange } from './events'

const form_interface = {
  example: [{
    Search: { type: 'line', value: '', receiveValue: () => {}}
  }],
  types: [
    obj => Object.values(obj).every(satisfies({
      type: oneOf('line', 'text'),
      value: isString,
      receiveValue: isFunction
    }))
  ]
}

export function *form(fields) {
  checkArgs(form, arguments, form_interface)
  let showableFields = doWith(fields,
    entries,
    map(([key, fieldDesc]) => ({
      label: key,
      type:  fieldDesc.type,
      value: fieldDesc.value
    }))
  )

  for (let field of showableFields) {
    fields[field.label].receiveValue(field.value)
  }
  yield redraw()

  yield showFormFields(showableFields)

  while (true) {
    let event = yield waitForEvent()
    if (isFormSubmission(event)) {
      yield showFormFields([])
      break;
    } else if (isFormFieldChange(event)) {
      fields[event.label].receiveValue(event.value)
      yield redraw()
      continue;
    } else {
      // some event we don't care about
      continue;
    }
  }
}

const lineInput_interface = {
  example: ['', () => {}],
  types: [isString, isFunction]
}

export function lineInput(value, receiveValue) {
  checkArgs(lineInput, arguments, lineInput_interface)
  return {
    type: 'line',
    value,
    receiveValue
  }
}

export function textInput(value, receiveValue) {
  checkArgs(textInput, arguments, lineInput_interface)
  return {
    type: 'text',
    value,
    receiveValue
  }
}

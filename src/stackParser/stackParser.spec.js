import mozStackParser from './mozStackParser'
import webkitStackParser from './webkitStackParser'

describe('mozStackParser', () => {
  it('identifies the place where an error occurred', () => {
    let stack = `init@https://druidic.github.io/static/js/main.94ca7583.js line 1 > Function:6:21
run@https://druidic.github.io/:72:37
begin@https://druidic.github.io/:49:9
App@https://druidic.github.io/:22:7`

    expect(mozStackParser(stack)).toEqual({
      line: 4 // line numbers are adjusted to match the source
    })
  })

  it('tolerates an empty stack', () => {
    expect(mozStackParser('')).toEqual({
      line: null // line numbers are adjusted to match the source
    })
  })

  it('handles nonsense', () => {
    expect(mozStackParser('adsfsadf')).toEqual({
      line: null // line numbers are adjusted to match the source
    })
  })

  it('does not output a line number if the user script is not in the stacktrace', () => {
    // this happens e.g. on a syntax error
    let stack = `evaluateScript@http://localhost:3000/static/js/bundle.js:66477:7
loadFiles@http://localhost:3000/static/js/bundle.js:64917:5
_loop/mappedActions[action]@http://localhost:3000/static/js/bundle.js:66043:25
componentWillMount/<@http://localhost:3000/static/js/bundle.js:65394:16
onLoad@http://localhost:3000/static/js/bundle.js:66612:14
componentWillMount@http://localhost:3000/static/js/bundle.js:65393:7`

    expect(mozStackParser(stack)).toEqual({
      line: null
    })
  })
})

describe('webkitStackParser', () => {
  it('identifies the place where an error occurred', () => {
    // indentation sic
    let stack = `Error
    at init (eval at evaluateScript (sideEffects.js:23), <anonymous>:6:21)
    at init.next (<anonymous>)
    at run ((index):72)
    at Object.begin ((index):49)
    at App ((index):22)`

    expect(webkitStackParser(stack)).toEqual({
      line: 4 // line numbers are adjusted to match the source
    })
  })

  it('tolerates an empty stack', () => {
    expect(webkitStackParser('')).toEqual({
      line: null // line numbers are adjusted to match the source
    })
  })

  it('handles nonsense', () => {
    expect(webkitStackParser('adsfsadf')).toEqual({
      line: null // line numbers are adjusted to match the source
    })
  })
})

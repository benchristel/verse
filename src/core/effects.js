export function wait(seconds) {
  return {
    effectType: 'wait',
    seconds
  }
}

export function waitForever() {
  return {
    effectType: 'waitForever'
  }
}

export function waitForChar() {
  return {
    effectType: 'waitForChar'
  }
}

export function waitForInput(prompt='') {
  return function*() {
    let entered = ''
    yield startInputDisplay(() => {
      return [
        prompt,
        '> ' + entered + '_'
      ]
    })
    yield function* getOneChar() {
      let c = yield waitForChar()
      switch (c) {
        case 'Enter':
        return;

        case 'Backspace':
        entered = entered.slice(0, entered.length - 1)
        break;

        default:
        entered += c
      }
      yield retry(getOneChar)
    }
    // TODO: empty string here is a hack to work around
    // the UI's awkward display implementation.
    yield startInputDisplay(() => [''])
    return entered
  }
}

export function jump(generator) {
  return {
    effectType: 'jump',
    generator
  }
}

export function retry(generator) {
  return {
    effectType: 'retry',
    generator
  }
}

export function log(message) {
  return {
    effectType: 'log',
    message
  }
}

export function startDisplay(render) {
  return {
    effectType: 'startDisplay',
    render
  }
}

export function startInputDisplay(render) {
  return {
    effectType: 'startInputDisplay',
    render
  }
}

export function perform(action) {
  return {
    effectType: 'perform',
    action
  }
}

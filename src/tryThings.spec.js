import tryThings from './tryThings'

describe('tryThings', () => {
  it('returns an empty result list given an empty object', () => {
    expect(tryThings({})).toEqual([])
  })

  it('returns an empty result list given an object with no properties that start with "try "', () => {
    let obj = {
      foo() {},
      bar() {}
    }
    expect(tryThings(obj)).toEqual([])
  })

  it('returns the name and value of a function starting with "try "', () => {
    let obj = {
      'try something'() {
        return 1234
      }
    }
    expect(tryThings(obj)).toEqual(['try something', '1234'])
  })

  it('returns the name and value of multiple functions', () => {
    let obj = {
      'try something'() {
        return 1234
      },

      'try another thing'() {
        return 'foo'
      }
    }
    expect(tryThings(obj)).toEqual([
      'try something',
      '1234',
      'try another thing',
      'foo',
    ])
  })

  it('calls the error callback when a function blows up', () => {
    let obj = {
      'try and fail'() {
        throw 'kablooie'
      }
    }
    let error
    function handleError(e) {
      error = e
    }
    expect(tryThings(obj, handleError)).toEqual([])
    expect(error).toBe('kablooie')
  })
})

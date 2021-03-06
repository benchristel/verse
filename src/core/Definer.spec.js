import Definer from './Definer'
import { action } from '.'

describe('Definer', () => {
  let global, definer
  beforeEach(() => {
    global = {}
    definer = Definer(global)
  })

  it('adds properties to the given global object', () => {
    let define = definer.defineModule('myModule')
    define({foo: 1, bar: 2})
    expect(global.foo).toBe(1)
    expect(global.bar).toBe(2)
  })

  it('removes old definitions when a module is redefined', () => {
    let define = definer.defineModule('myModule')
    define({foo: 1})
    define({bar: 2})
    expect(global.foo).not.toBeDefined()
    expect(global.bar).toBe(2)
  })

  it('cleans up old definitions even if defineModule is called multiple times', () => {
    definer.defineModule('myModule')({foo: 1})
    definer.defineModule('myModule')({bar: 2})
    expect(global.foo).not.toBeDefined()
    expect(global.bar).toBe(2)
  })

  it('allows modules with different names to coexist', () => {
    let define1 = definer.defineModule('mod1')
    let define2 = definer.defineModule('mod2')
    define1({foo: 1})
    define2({bar: 2})
    expect(global.foo).toBe(1)
    expect(global.bar).toBe(2)
  })

  it('throws if you try to overwrite another module\'s definitions', () => {
    let define1 = definer.defineModule('mod1')
    let define2 = definer.defineModule('mod2')
    define1({foo: 1})
    expect(() => define2({foo: 2})).toThrow()
  })

  it('lets modules overwrite their own definitions', () => {
    let define = definer.defineModule('mod')
    define({foo: 1})
    define({foo: 2})
    expect(global.foo).toBe(2)
  })

  it('does not modify definitions from module2 when module1 is redefined', () => {
    definer.defineModule('mod1')({foo: 1})
    definer.defineModule('mod2')({bar: 2})
    definer.defineModule('mod1')({quux: 3})
    expect(global.foo).not.toBeDefined()
    expect(global.bar).toBe(2)
    expect(global.quux).toBe(3)
  })

  it('renames a module', () => {
    definer.defineModule('mod1')({foo: 1})
    definer.renameModule('mod1', 'mod2')
    definer.defineModule('mod2')({bar: 1})
    expect(global.foo).not.toBeDefined()
    expect(global.bar).toBe(1)
  })

  it('throws an exception if you rename a module that never existed', () => {
    expect(() => definer.renameModule('mod1', 'mod2')).toThrow()
  })

  it('does not let you rename the same name twice', () => {
    definer.defineModule('mod1')({foo: 1})
    definer.renameModule('mod1', 'mod2')
    expect(() => definer.renameModule('mod1', 'mod3')).toThrow()
  })

  it('deletes a module', () => {
    definer.defineModule('mod1')({foo: 1})
    definer.deleteModule('mod1')
    expect(global.foo).not.toBeDefined()
  })

  it('does not allow renaming a module after it is deleted', () => {
    definer.defineModule('mod1')({foo: 1})
    definer.deleteModule('mod1')
    expect(() => definer.renameModule('mod1', 'mod2')).toThrow()
  })

  it('deletes all modules', () => {
    definer.defineModule('mod1')({foo: 1})
    definer.defineModule('mod2')({bar: 2})
    definer.defineModule('mod3')({baz: 3, quux: 4})
    definer.deleteAllModules()
    expect(global.foo).not.toBeDefined()
    expect(global.bar).not.toBeDefined()
    expect(global.baz).not.toBeDefined()
    expect(global.quux).not.toBeDefined()
  })
})

describe('a function created by Definer', () => {
  let global, definer
  beforeEach(() => {
    global = {}
    definer = Definer(global)
  })

  it('has a name', () => {
    definer.defineModule('mod')({
      foo() {}
    })

    expect(global.foo.name).toBe('foo')
  })

  it('adds its name to a custom stack array on any exceptions that pass through it', () => {
    definer.defineModule('mod')({
      kaboom() {
        throw new Error('oh no')
      }
    })

    let caught
    try {
      global.kaboom()
    } catch (e) {
      caught = e
    }

    expect(caught).toBeDefined()
    expect(caught.verseStack).toEqual(['kaboom'])
  })

  it('traces the stack for multiple function calls', () => {
    definer.defineModule('mod')({
      useTheForce() {
        global.doOrDoNot()
      },
      doOrDoNot() { // no try
        global.kaboom()
      },
      kaboom() {
        throw new Error('oh no')
      }
    })

    let caught
    try {
      global.useTheForce()
    } catch (e) {
      caught = e
    }
    expect(caught).toBeDefined()
    expect(caught.verseStack).toEqual([
      'kaboom',
      'doOrDoNot',
      'useTheForce'
    ])
  })

  it('traces the stack through generators', () => {
    definer.defineModule('mod')({
      *foo() {
        yield *global.bar('yikes')
      },
      *bar(message) {
        throw new Error(message)
      }
    })

    let caught
    try {
      global.foo().next()
    } catch (e) {
      caught = e
    }
    expect(caught).toBeDefined()
    expect(caught.verseStack).toEqual([
      'bar',
      'foo'
    ])
    expect(caught.message).toEqual('yikes')
  })

  it('lets return values pass through generators', () => {
    definer.defineModule('mod')({
      *foo() {
        return yield *global.bar(1, 2)
      },
      *bar(a, b) {
        yield a
        yield b
        return a + b
      }
    })

    let fooIterator = global.foo()
    expect(fooIterator.next().value).toBe(1)
    expect(fooIterator.next().value).toBe(2)
    expect(fooIterator.next().value).toBe(3)
    expect(fooIterator.next().value).not.toBeDefined()
  })

  it('does not add stacktrace instrumentation to functions that are generated by Verse\'s own higher-order funcs', () => {
    // stacktraces that point to generated functions would
    // be pointless, since the user can do nothing to fix
    // errors that occur there.
    definer.defineModule('mod')({
      myAction: action()
    })
    expect(global.myAction().type).toBe(global.myAction)
  })
})

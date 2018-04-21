import Definer from './Definer'

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
})

/**
 * If we're running in Node, the global object is named
 * `global`. Alias it to `window` for compatibility with
 * code that assumes a browser runtime.
 */
if (typeof window === 'undefined') {
  global.window = global
}

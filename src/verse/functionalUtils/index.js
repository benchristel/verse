window.uppercase = uppercase
export function uppercase(s) {
  return ('' + s).toUpperCase()
}

window.lowercase = lowercase
export function lowercase(s) {
  return ('' + s).toLowerCase()
}

window.reverse = reverse
export function reverse(s) {
  s = '' + s
  if (s.length < 2) return s
  return reverse(restOf(s)) + firstOf(s)
}

export function firstOf(a) {
  return a[0]
}

export function restOf(a) {
  return a.slice(1)
}

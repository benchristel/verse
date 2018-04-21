export default function thunk(f, ...args) {
  window.setTimeout(() => f(...args), 1)
}

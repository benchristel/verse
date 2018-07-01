export default function nextTurn(f, ...args) {
  window.setTimeout(() => f(...args), 1)
}

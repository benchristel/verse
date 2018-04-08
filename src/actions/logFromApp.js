export function logFromApp(message) {
  return {
    type: 'logFromApp',
    message
  }
}

export function cheat(method) {
  console.log('creating cheat action')
  return {
    type: 'cheat',
    method
  }
}

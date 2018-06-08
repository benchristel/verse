export function display(view) {
  return {
    type: 'display',
    ...view
  }
}

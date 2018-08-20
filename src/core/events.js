export function animationFrame(elapsedFrames) {
  return {
    eventType: 'animationFrame',
    elapsedFrames
  }
}

export function isAnimationFrame(event) {
  return event.eventType === 'animationFrame'
}

export function keyDown(key) {
  return {
    eventType: 'keyDown',
    key
  }
}

export function isKeyDown(event) {
  return event.eventType === 'keyDown'
}

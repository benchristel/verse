export function animationFrame(elapsedFrames) {
  return {
    eventType: 'animationFrame',
    elapsedFrames
  }
}

export function isAnimationFrame(event) {
  return event.eventType === 'animationFrame'
}

define({

  /* ======================================================
   * UI TESTS
   * ====================================================== */

  'test the score display'() {
    simulate(run)
      .assertDisplay(contains, 'Score: 0')
  },

  'test keyboard input'() {
    simulate(run)
      .receive(keyDown('5'))
      .assertDisplay(contains, 'Score: 5')
  },

  'test invalid keyboard input'() {
    /* typing a key that does not indicate a valid number of points
     * does nothing */
    simulate(run)
      .receive(keyDown('f'))
      .assertDisplay(contains, 'Score: 0')
  },

  'test multiple keypresses'() {
    simulate(run)
      .receive(keyDown('5'))
      .receive(keyDown('5'))
      .assertDisplay(contains, 'Score: 10')
  },

  'test the game over screen'() {
    let sim = simulate(run)
    for (i of range(1, 20)) {
      sim.receive(keyDown('4'))
    }
    sim.assertDisplay(contains, 'Final Score: 80')
    sim.assertDisplay(contains, 'GAME OVER')
  },

  /* ======================================================
   * BUSINESS LOGIC
   * ====================================================== */

  'test pinfallForChar given a numeric string'() {
    /* pinfallForChar takes a char of keyboard input and turns
     * it into a valid pinfall number (0-10).
     */
    assert(pinfallForChar('0'), is, 0)
    assert(pinfallForChar('1'), is, 1)
  },

  'test pinfallForChar returns 10 given X'() {
    assert(pinfallForChar('X'), is, 10)
  },

  'test pinfallForChar is case-insensitive'() {
    assert(pinfallForChar('x'), is, 10)
  },

  pinfallForChar(c) {
    return uppercase(c) === 'X' ? 10 : +c
  },

  'test isValidPinfall'() {
    /* isValidPinfall checks if the character represents a valid
     * pinfall number (0-10).
     */
    assert(isValidPinfall('a'), is, false)
    assert(isValidPinfall('1'), is, true)
  },

  isValidPinfall(c) {
    return isNumber(pinfallForChar(c))
  },

  'test a perfect score is 300'() {
    twelveTens = range(1, 12).map(_ => 10)
    assert(score({bowls: twelveTens}), is, 300)
  },

  'test the score for all 5s is 150'() {
    twentyOneFives = range(1, 21).map(_ => 5)
    assert(score({bowls: twentyOneFives}), is, 150)
  },

  score(state) {
    return sum(state.bowls) + bonuses(state)
  },

  'test bonuses is 0 with no balls'() {
    assert(bonuses({bowls: []}), is, 0)
  },

  'test bonuses is 0 with no strikes or spares'() {
    assert(bonuses({bowls: [1, 2, 3, 4, 5]}), is, 0)
  },

  'test the bonus for a spare is the next ball'() {
    assert(bonuses({bowls: [5, 5, 7]}), is, 7)
  },

  'test the bonus for a spare is 0 before the next ball'() {
    assert(bonuses({bowls: [5, 5]}), is, 0)
  },

  'test the bonus for a strikes is the next two balls'() {
    assert(bonuses({bowls: [10, 7, 2]}), is, 9)
  },

  'test the bonus for a strike is 0 before the next ball'() {
    assert(bonuses({bowls: [10]}), is, 0)
  },

  bonuses(state) {
    let frames = getFrames(state)
    /* don't compute bonuses for the 10th frame; if there is
     * a strike or spare in the 10th frame, the bonus balls get
     * counted as part of that frame. */
    let allButLast = frames.slice(0, 9)
    return sum(allButLast.map((frame, index) => {
      if (isSpare(frame)) return frames[index + 1][0] || 0
      if (isStrike(frame)) return frames
        .slice(index + 1)    // sum the next two balls,
        .reduce(concat, [])  // regardless of which frame
        .slice(0, 2)         // they're in
        .reduce(add, 0)
      return 0
    }))
  },

  concat(a, b) {
    return a.concat(b)
  },

  'test isGameOver is false when you have not bowled'() {
    assert(isGameOver({bowls: []}), is, false)
  },

  'test isGameOver is false after 19 bowls'() {
    let bowls = range(1, 19).map(_ => 4)
    assert(isGameOver({bowls}), is, false)
  },

  'test isGameOver is true after 20 bowls with no bonuses'() {
    let bowls = range(1, 20).map(_ => 4)
    assert(isGameOver({bowls}), is, true)
  },

  'test isGameOver is true after 12 strikes'() {
    let bowls = range(1, 12).map(_ => 10)
    assert(isGameOver({bowls}), is, true)
  },

  'test isGameOver is false with a strike in the last frame'() {
    let bowls = [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 10,
    ]
    assert(isGameOver({bowls}), is, false)
  },

  isGameOver(state) {
    let frames = getFrames(state)
    return frames.length === 10
      && lastFrameOver(frames[9])
  },

  'test lastFrameOver is false with no balls in 10th frame'() {
    assert(lastFrameOver([]), is, false)
  },

  'test lastFrameOver is false with 1 ball in 10th frame'() {
    assert(lastFrameOver([1]), is, false)
  },

  'test lastFrameOver is true with no bonus in 10th frame'() {
    assert(lastFrameOver([1, 2]), is, true)
  },

  'test lastFrameOver is false with a spare in 10th frame'() {
    assert(lastFrameOver([4, 6]), is, false)
  },

  'test lastFrameOver is true with 3 balls'() {
    assert(lastFrameOver([4, 6, 7]), is, true)
  },

  lastFrameOver(tenthFrame) {
    if (tenthFrame.length > 2) return true
    return tenthFrame.length === 2 && !hasBonus(tenthFrame)
  },

  hasBonus(frame) {
    return isStrike(frame) || isSpare(frame)
  },

  isStrike(frame) {
    return frame[0] === 10
  },

  'test a frame with ten pins knocked down is a spare'() {
    assert(isSpare([9, 1]), is, true)
  },

  'test a isSpare given a 10th frame with a bonus'() {
    assert(isSpare([9, 1, 5]), is, true)
  },

  'test a strike is not a spare'() {
    assert(isSpare([10]), is, false)
  },

  isSpare(frame) {
    return !isStrike(frame) && sum(frame.slice(0, 2)) === 10
  },

  'test getFrames starts with an empty frame'() {
    let state = {bowls: []}
    assert(getFrames(state), equals, [[]])
  },

  'test frames records one bowl in a frame'() {
    let state = {bowls: [1]}
    assert(getFrames(state), equals, [[1]])
  },

  'test frames records two bowls in one frame'() {
    let state = {bowls: [1, 2]}
    assert(getFrames(state), equals, [[1, 2], []])
  },

  'test frames goes to the next frame after a strike'() {
    let state = {bowls: [10, 2]}
    assert(getFrames(state), equals, [[10], [2]])
  },

  'test frames puts 3 balls in the 10th frame'() {
    /* A different function will detect when the game has ended,
     * so in an actual game you won't be able to bowl three 1s in
     * the 10th frame. */
    let state = {bowls: [
      1, 1, // 1
      1, 1, // 2
      1, 1, // 3
      1, 1, // 4
      1, 1, // 5
      1, 1, // 6
      1, 1, // 7
      1, 1, // 8
      1, 1, // 9
      1, 1, 1
    ]}
    assert(getFrames(state), equals, [
      [1, 1], // 1
      [1, 1], // 2
      [1, 1], // 3
      [1, 1], // 4
      [1, 1], // 5
      [1, 1], // 6
      [1, 1], // 7
      [1, 1], // 8
      [1, 1], // 9
      [1, 1, 1]
    ])
  },

  getFrames(state) {
    let frame = []
    let frames = [frame]
    for (let bowl of state.bowls) {
      frame.push(bowl)
      if (frameIsOver()) {
        frame = []
        frames.push(frame)
      }
    }
    return frames

    function frameIsOver() {
      if (frames.length === 10) return false
      return frame.length === 2 || frame[0] === 10
    }
  },

  add(a, b) {
    return a + b
  },

  sum(list) {
    return list.reduce(add, 0)
  },

  /* ======================================================
   * MODEL
   * ====================================================== */

  getStateType() {
    return {
      bowls: isArrayOf(isNumber)
    }
  },

  reducer(state, action) {
    return {
      bowls: [...state.bowls, action.pinfall]
    }
  },

  /* ======================================================
   * ACTIONS
   * ====================================================== */

  recordScore(pinfall) {
    return {
      type: recordScore,
      pinfall
    }
  },

  /* ======================================================
   * ROUTINES
   * ====================================================== */

  *run() {
    yield startDisplay(state => [
      'Press 0-9 to record your score; X for a strike.',
      `Score: ${score(state)}`,
      ' ',
      ...scorecard(state)
    ])

    /* read and validate user input */
    let input = yield waitForChar()
    if (!isValidPinfall(input)) {
      yield retry(run)
    }
    let pinfall = pinfallForChar(input)

    /* record the score for the ball */
    let state = yield perform(recordScore(pinfall))

    if (isGameOver(state)) yield gameOverScreen()

    yield retry(run)
  },

  *gameOverScreen() {
    yield startDisplay(state => [
      `GAME OVER.`,
      `Final Score: ${score(state)}`,
      ' ',
      ...scorecard(state),
      ' ',
      'Press the RUN button to play again.'
    ])
    yield wait(Infinity)
  },

  /* ======================================================
   * VIEWS
   * ====================================================== */

  'test a blank scorecard has a caret indicating the current frame'() {
    assert(scorecard({bowls: []}), equals, ['> '])
  },

  'test a scorecard with one ball'() {
    assert(scorecard({bowls: [5]}), equals, ['> 5'])
  },

  'test a scorecard with two balls'() {
    assert(scorecard({bowls: [5, 6]}), equals, [
      '  5, 6',
      '> '
    ])
  },

  'test a scorecard with a strike'() {
    assert(scorecard({bowls: [10]}), equals, [
      '  X',
      '> '
    ])
  },

  'test a scorecard with two strikes'() {
    assert(scorecard({bowls: [10, 10]}), equals, [
      '  X',
      '  X',
      '> '
    ])
  },

  'test a scorecard with a spare'() {
    assert(scorecard({bowls: [5, 5]}), equals, [
      '  5, /',
      '> '
    ])
  },

  scorecard(state) {
    let frames = getFrames(state)
    return frames.map(viewFrame(frames))
  },

  viewFrame: (frames) => (frame, index) => {
    let caret = index === frames.length - 1 ? '> ' : '  '
    return caret + frame.map((ball, index) => {
      if (ball === 10) return 'X'
      if (isSpare(frame) && index === 1) return '/'
      return ball
    }).join(', ')
  }
})

define({
  *run() {
    let barAnimation = [
      '#_________________________',
      '##________________________',
      '######____________________',
      '########__________________',
      '########__________________',
      '###########_______________',
      '#############_____________',
      '################__________',
      '##################________',
      '###################_______',
      '########################__',
      '#########################_',
      '##########################',
    ]
    for (let frame of barAnimation) {
      let bar = frame
      yield startDisplay(() => [
        'Loading....',
        ',__________________________,',
        '|' + bar + '|'
      ])
      yield wait(0.1)
    }
    yield wait(0.1)
  },
})

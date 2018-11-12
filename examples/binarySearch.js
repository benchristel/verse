define({
  binarySearch(quest, sortedList) {
    // first index that could possibly contain the item
    let fst = 0
    // last index that could possibly contain the item
    let lst = sortedList.length - 1

    while (fst <= lst) {
      let midpoint = Math.floor(lst - fst / 2) + fst
      let atMidpoint = sortedList[midpoint]
      if (atMidpoint > quest) {
        lst = midpoint - 1
      } else if (atMidpoint < quest) {
        fst = midpoint + 1
      } else { // found it!
        assert(atMidpoint, is, quest)
        return true
      }
    }
    return false
  },

  'test binarySearch on empty'() {
    assert(binarySearch(1, []), is, false)
  },

  'test binarySearch does not find undefined in empty'() {
    assert(binarySearch(undefined, []), is, false)
  },

  'test binarySearch - array of one'() {
    assert(binarySearch(1, [1]), is, true)
  },

  'test binarySearch - array of two'() {
    let array = [1, 2]
    assert(binarySearch(0, array), is, false)
    assert(binarySearch(1, array), is, true)
    assert(binarySearch(2, array), is, true)
    assert(binarySearch(3, array), is, false)
  },

  'test binarySearch - array of three'() {
    let array = [1, 2, 3]
    assert(binarySearch(0, array), is, false)
    assert(binarySearch(1, array), is, true)
    assert(binarySearch(2, array), is, true)
    assert(binarySearch(3, array), is, true)
    assert(binarySearch(4, array), is, false)
  },

  'test binarySearch - array of four'() {
    let array = [1, 2, 3, 4]
    assert(binarySearch(0, array), is, false)
    assert(binarySearch(1, array), is, true)
    assert(binarySearch(2, array), is, true)
    assert(binarySearch(3, array), is, true)
    assert(binarySearch(4, array), is, true)
    assert(binarySearch(5, array), is, false)
  },

  'test binarySearch - array of five'() {
    let array = [1, 2, 3, 4, 5]
    assert(binarySearch(0, array), is, false)
    assert(binarySearch(1, array), is, true)
    assert(binarySearch(2, array), is, true)
    assert(binarySearch(3, array), is, true)
    assert(binarySearch(4, array), is, true)
    assert(binarySearch(5, array), is, true)
    assert(binarySearch(6, array), is, false)
  },

  'test binarySearch - duplicates'() {
    let array = [1, 3, 3, 3, 5]
    assert(binarySearch(0, array), is, false)
    assert(binarySearch(1, array), is, true)
    assert(binarySearch(2, array), is, false)
    assert(binarySearch(3, array), is, true)
    assert(binarySearch(4, array), is, false)
    assert(binarySearch(5, array), is, true)
    assert(binarySearch(6, array), is, false)
  },

  'test binarySearch via property test'() {
    let iterations = 100
    for (let _ of range(1, iterations)) {
      let length = randomInt(0, 20)
      let array = []
      let members = new Set()
      if (length > 0) for (let i of range(1, length)) {
        let value = randomInt(1, 25) * 2
        array.push(value)
        members.add(value)
      }
      array = array.sort((a, b) => a - b)
      for (let n of members) {
        assert(array, binarySearch, n)
        assert(array, not(binarySearch), n + 1)
      }
    }
  },

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
  },
})

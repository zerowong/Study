const assert = require('assert').strict
const fs = require('fs')
const rewire = require('rewire')
const { getContent } = require('./get_content')

describe('Array', function () {
  describe('#indexOf', function () {
    let arr = []
    before(function setArrValue() {
      arr = [1, 2, 3]
    })
    it('should return -1 when not present', function () {
      assert.equal(arr.indexOf(4), -1)
    })
    it('should return index when present', function () {
      assert.equal(arr.indexOf(1), 0)
      assert.equal(arr.indexOf(2), 1)
      assert.equal(arr.indexOf(3), 2)
    })
  })
})

describe('fs.readFile', function () {
  it('should no error', function (done) {
    fs.readFile(__dirname + '/example.txt', { encoding: 'utf8' }, (err, data) => {
      assert.equal(err, null)
      assert.equal(data, 'example')
      done()
    })
  })
})

describe('timeout', function () {
  it('should take less than 500ms', function (done) {
    this.timeout(500)
    setTimeout(done, 300)
  })
})

describe('getContent', function () {
  it('should no error', function () {
    const res = getContent(__dirname + '/example.txt')
    assert.equal(res, 'example')
  })
  it('should be error', function () {
    const res = getContent(__dirname + '/notexits.txt')
    assert.equal(res, '')
  })
})

describe('limit', function () {
  it('limit should return success', function () {
    const lib = rewire('./limit.js')
    const limit = lib.__get__('limit')
    assert.equal(limit(-1), 0)
    assert.equal(limit(10), 10)
  })
})

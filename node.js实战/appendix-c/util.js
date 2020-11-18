const assert = require('assert').strict

function deepEqual(obj1, obj2) {
  try {
    assert.deepEqual(obj1, obj2)
    return true
  } catch (e) {
    return false
  }
}

function emptyObj(obj) {
  const proto = Object.getPrototypeOf(obj)
  if (proto === null) {
    return Object.create(null)
  }
  return {}
}

module.exports = { deepEqual, emptyObj }

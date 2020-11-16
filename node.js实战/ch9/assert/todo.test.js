const assert = require('assert').strict
const Todo = require('./todo')

const todo = new Todo()
let testsCompleted = 0

function print(msg) {
  console.log(msg, '\u2714')
}

function deleteTest() {
  todo.add('test')
  assert.equal(todo.length, 1)
  print('1 item should exist')

  todo.deleteAll()
  assert.equal(todo.length, 0)
  print('All items should deleted')

  testsCompleted++
}

function addTest() {
  todo.deleteAll()
  todo.add('test')
  assert.notEqual(todo.length, 0)
  print('1 item should exist')

  testsCompleted++
}

function doAsyncTest(cb) {
  todo.doAsync((value) => {
    assert.ok(value)
    print('Callback shoudl be passed true')
    testsCompleted++
    cb()
  })
}

function throwTest() {
  assert.throws(todo.add)
  print('throws')
  testsCompleted++
}

deleteTest()
addTest()
throwTest()
doAsyncTest(() => console.log(`Completed ${testsCompleted} tests`))

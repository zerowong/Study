const Benchmark = require('benchmark')

const suite = new Benchmark.Suite()

const arr = new Array(100000).fill(1)
const callback = (v) => v

suite
  .add('forEach', function () {
    arr.forEach(callback)
  })
  .add('while', function () {
    let i = arr.length
    while (i--) {
      callback(arr[i])
    }
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .run()

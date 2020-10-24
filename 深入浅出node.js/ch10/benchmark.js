const Benchmark = require('benchmark')

const suite1 = new Benchmark.Suite()
const suite2 = new Benchmark.Suite()

const arr = [1, 2, 3, 4, 5, 6]

function callback(v) {
  return v
}

suite1
  .add('nativeMap', function () {
    return arr.map(callback)
  })
  .add('customMap', function () {
    const res = []
    for (let i = 0; i < arr.length; i++) {
      res.push(callback(arr[i]))
    }
    return res
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log(`Fastest is ${this.filter('fastest').map('name')}`)
  })
  .run()

const list = new Array(10000).fill(1)

suite2
  .add('for', function () {
    let sum = 0
    for (let i = 0; i < list.length; i++) {
      sum += list[i]
    }
    return sum
  })
  .add('forEach', function () {
    let sum = 0
    list.forEach((item) => (sum += item))
    return sum
  })
  .add('for + cache', function () {
    let sum = 0
    for (let i = 0, l = list.length; i < l; i++) {
      sum += list[i]
    }
    return sum
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log(`Fastest is ${this.filter('fastest').map('name')}`)
  })
  .run()

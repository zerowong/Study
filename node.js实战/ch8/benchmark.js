const prettyBytes = require('pretty-bytes')

const obj = {}
for (let i = 0; i < 200000; i++) {
  obj[i] = {
    [Math.random()]: Math.random(),
  }
}

console.time('serialies')
const jsonString = JSON.stringify(obj)
console.timeEnd('serialies')
console.log('size:', prettyBytes(Buffer.byteLength(jsonString)))
console.time('deserialies')
const _obj = JSON.parse(jsonString)
console.timeEnd('deserialies')

const obj = {}
for (let i = 0; i < 100000; i++) {
  obj[i] = {
    [Math.random()]: Math.random(),
  }
}

const objString = JSON.stringify(obj)

console.time('storage')
localStorage.setItem('obj', objString)
const _objString = localStorage.getItem('obj')
console.timeEnd('storage')

console.time('clear')
localStorage.clear()
console.timeEnd('clear')

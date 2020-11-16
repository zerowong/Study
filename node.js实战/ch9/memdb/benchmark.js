const benny = require('benny')

const test = {
  db: [],
  findFisrt_1(obj) {
    let result = null
    nextItem: for (let i = 0; i < this.db.length; i++) {
      const compObj = this.db[i]
      for (let key in obj) {
        if (obj[key] !== compObj[key]) continue nextItem
      }
      result = compObj
      break
    }
    return result
  },
  findFisrt_2(obj) {
    return this.db
      .filter((item) => {
        for (let key in obj) {
          if (obj[key] !== item[key]) return false
        }
        return true
      })
      .shift()
  },
}

for (let i = 0; i < 10000; i++) {
  const obj = { key: 'value' }
  test.db.push(obj)
}
test.db.push({ key: 'target' })

benny.suite(
  'findFisrt',
  benny.add('for', () => {
    test.findFisrt_1({ key: 'target' })
  }),
  benny.add('filter', () => {
    test.findFisrt_2({ key: 'target' })
  }),
  benny.cycle(),
  benny.complete()
)

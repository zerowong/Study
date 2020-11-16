const memdb = {
  db: [],
  async save(obj) {
    this.db.push(obj)
    return obj
  },
  findFirst(obj) {
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
  clear() {
    this.db.length = 0
  },
  saveSync(obj) {
    this.db.push(obj)
  },
  get length() {
    return this.db.length
  },
}

module.exports = memdb

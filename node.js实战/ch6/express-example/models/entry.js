const redis = require('redis')

const db = redis.createClient()

class Entry {
  constructor(obj) {
    for (let key in obj) {
      this[key] = obj[key]
    }
  }

  save(cb) {
    const entryJson = JSON.stringify(this)
    // 将参数值插入指定key的list头部
    db.lpush('entries', entryJson, (err) => {
      if (err) return cb(err)
      cb()
    })
  }

  /**
   * 以指定区间获取帖子
   * @param {number} from
   * @param {number} to
   * @param {(err: Error, entries: any[]) => void} cb
   */
  static getRange(from, to, cb) {
    // 获取list指定区间的元素
    db.lrange('entries', from, to, (err, items) => {
      if (err) return cb(err)
      const entries = []
      for (let i = 0; i < items.length; i++) {
        entries.push(JSON.parse(items[i]))
      }
      cb(null, entries)
    })
  }

  static count(cb) {
    db.llen('entries', cb)
  }
}

module.exports = Entry

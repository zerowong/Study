const redis = require('redis')
const bcrypt = require('bcrypt')

const db = redis.createClient()

class User {
  constructor(obj) {
    for (let key in obj) {
      this[key] = obj[key]
    }
  }

  /**
   * @param {(err: Error) => void} cb
   */
  save(cb) {
    // 以是否有id属性作为是否注册的区分
    if (!this.id) {
      // 为用户分配id
      db.incr('user:ids', (err, id) => {
        if (err) return cb(err)
        // 用递增后的值作为用户id
        this.id = id
        this.hashPassword((err) => {
          if (err) return cb(err)
          this.update(cb)
        })
      })
    } else {
      this.update(cb)
    }
  }

  update(cb) {
    const id = this.id
    // 以name为键索引id
    db.set(`user:id:${this.name}`, id, (err) => {
      if (err) cb(err)
      // 将用户信息存储在以'user:id'为键的哈希集中
      db.hmset(`user:${id}`, this, (err) => {
        cb(err)
      })
    })
  }

  hashPassword(cb) {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) return cb(err)
      this.salt = salt
      bcrypt.hash(this.pass, salt, (err, hash) => {
        if (err) return cb(err)
        this.pass = hash
        cb()
      })
    })
  }

  // 过滤敏感数据
  toJson() {
    return {
      id: this.id,
      name: this.name,
    }
  }

  /**
   * 通过用户名获取User实例
   * @param {string} name
   * @param {(err: Error, user: User) => void} cb
   */
  static getByName(name, cb) {
    db.get(`user:id:${name}`, (err, id) => {
      if (err) return cb(err)
      User.get(id, cb)
    })
  }

  /**
   * 用户验证
   * @param {string} name
   * @param {string} pass
   * @param {(err: Error, user: User) => void} cb
   */
  static authenticate(name, pass, cb) {
    User.getByName(name, (err, user) => {
      if (err) return cb(err)
      if (!user.id) return cb()
      bcrypt.hash(pass, user.salt, (err, hash) => {
        if (err) return cb(err)
        if (hash === user.pass) return cb(null, user)
        cb()
      })
    })
  }

  /**
   * 通过id构造User实例
   * @param {number | string} id
   * @param {(err: Error, user: User) => void} cb
   */
  static get(id, cb) {
    // 取出'user:id'哈希集中所有的字段和值，并以此构造User实例
    db.hgetall(`user:${id}`, (err, user) => {
      if (err) return cb(err)
      cb(null, new User(user))
    })
  }
}

module.exports = User

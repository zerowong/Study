const level = require('level')

const db = level('./app.db', { valueEncoding: 'json' })

const key = 'user'
const value = { name: 'a' }

db.put(key, value, (err) => {
  if (err) throw err
  db.get(key, (err, value) => {
    if (err) throw err
    console.log(key, ':', value)
    db.del(key, (err) => {
      if (err) throw err
      console.log('Value was deleted')
    })
  })
})

db.get('not-exist', (err, value) => {
  if (err && !err.notFound) throw err
  if (err && err.notFound) return console.error('Value was not found')
  console.log(value)
})

const key2 = new Uint8Array([1, 2, 3])
const options = {
  keyEncoding: 'binary',
  valueEncoding: 'hex',
}

db.put(key2, '0xFF0099', options, (err) => {
  if (err) throw err
  db.get(key2, options, (err, value) => {
    if (err) throw err
    console.log(typeof value)
  })
})

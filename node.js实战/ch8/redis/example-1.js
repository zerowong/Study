const redis = require('redis')

const db = redis.createClient()

db.on('connect', () => console.log('Redis client connected to server'))
db.on('ready', () => console.log('Redis server is ready'))
db.on('error', (err) => console.error('Redis error', err))

db.set('color', 'red', (err, reply) => {
  if (err) throw err
  console.log('color', 'red', reply)
})

db.get('color', (err, reply) => {
  if (err) throw err
  console.log('Got', reply)
})

db.exists('color', 'entries', 'user:1', 'user:2', (err, reply) => {
  if (err) throw err
  console.log(reply)
})

db.set('color', 1, redis.print)

db.get('color', (err, reply) => {
  if (err) throw err
  console.log('Got', reply, 'as', typeof reply)
})

db.set('color', {}, redis.print)

db.set('color', ['red', 'yellow'], redis.print)

db.set('color', ['red'], redis.print)

db.get('color', redis.print)

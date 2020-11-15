const redis = require('redis')

const db = redis.createClient()

db.hmset(
  'hashmap1',
  {
    a: 'somthing',
    b: 'something',
  },
  redis.print
)
db.hmget('hashmap1', 'b', redis.print)
db.hkeys('hashmap1', redis.print)

db.lpush('tasks', 'task1', 'task2', redis.print)
db.lrange('tasks', 0, -1, redis.print)

db.sadd('admins', 'a', 'b', 'c', redis.print)
db.smembers('admins', redis.print)

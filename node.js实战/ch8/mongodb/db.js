const { MongoClient, ObjectID } = require('mongodb')

const url = 'mongodb://localhost:27017'
const dbName = 'myDb'
const collectionName = 'articles2'

const client = new MongoClient(url, { useUnifiedTopology: true })

let db
async function initDb() {
  const _client = await client.connect()
  db = _client.db(dbName)
}

const Article = {
  all() {
    return db.collection(collectionName).find().sort({ title: 1 }).toArray()
  },
  find(_id) {
    if (typeof _id !== 'object') _id = ObjectID(_id)
    return db.collection(collectionName).findOne({ _id })
  },
  create(data) {
    return db.collection(collectionName).insertOne(data, { w: 1 }) // w: 写关注
  },
  delete(_id) {
    if (typeof _id !== 'object') _id = ObjectID(_id)
    return db.collection(collectionName).deleteOne({ _id }, { w: 1 })
  },
}

module.exports = { initDb, Article }

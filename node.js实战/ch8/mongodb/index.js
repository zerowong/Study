const { MongoClient } = require('mongodb')

const url = 'mongodb://localhost:27017'
const dbName = 'myDb'
const collectionName = 'articles'

const client = new MongoClient(url, { useUnifiedTopology: true })

client
  .connect()
  .then((client) => {
    console.log('Connected successfully to server')
    const db = client.db(dbName)
    const article = {
      title: 'something',
      content: 'something',
    }
    db.collection(collectionName)
      .insertOne(article)
      .then((result) => {
        console.log(result.insertedId, article._id)
        db.collection(collectionName)
          .find({})
          .toArray()
          .then((result) => {
            console.log(result)
            client.close()
          })
      })
  })
  .catch((e) => console.error(e))

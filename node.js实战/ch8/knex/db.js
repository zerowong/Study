const kenx = require('knex')

const db = kenx({
  client: 'sqlite3',
  connection: {
    filename: 'tldr.sqlite',
  },
  useNullAsDefault: true,
})

async function createTable() {
  const hasTable = await db.schema.hasTable('articles')
  if (!hasTable) {
    return db.schema.createTableIfNotExists('articles', (table) => {
      table.increments('id').primary()
      table.string('title')
      table.text('content')
    })
  }
}

const Article = {
  all() {
    return db('articles').orderBy('title')
  },
  find(id) {
    return db('articles').where({ id }).first()
  },
  create(data) {
    return db('articles').insert(data)
  },
  delete(id) {
    return db('articles').del().where({ id })
  },
}

module.exports = { createTable, Article }

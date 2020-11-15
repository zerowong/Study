const { Client } = require('pg')

const password = process.argv[2]

const db = new Client({
  user: 'postgres',
  database: 'articles',
  password: password,
})

const tableName = 'snippets'

async function connect() {
  await db.connect()
  console.log('Connected to database')
}

async function createTable(tableName) {
  await db.query(
    `CREATE TABLE IF NOT EXISTS ${tableName} (
      id SERIAL,
      PRIMARY KEY(id),
      body text
    );`
  )
  console.log('Create table', tableName)
}

async function insert(tableName, data) {
  const result = await db.query(
    `INSERT INTO ${tableName} (body) VALUES ('${data}')
    RETURNING id`
  )
  console.log('Inserted row with id', result.rows[0].id)
}

async function update(tableName, id, data) {
  const result = await db.query(`UPDATE ${tableName} SET (body) = ('${data}') WHERE id=${id};`)
  console.log('Update', result.rowCount, 'rows')
}

async function showTableData(tableName) {
  const result = await db.query(`SELECT * FROM ${tableName} ORDER BY id`)
  console.log(result.rows)
}

async function end() {
  await db.end()
  console.log('end')
}

async function run() {
  await connect()
  await createTable(tableName)
  await insert(tableName, 'hello world')
  // await update(tableName, 1, 'something')
  await showTableData(tableName)
  await end()
}

run().catch((reason) => {
  console.error(reason)
  process.exit(1)
})

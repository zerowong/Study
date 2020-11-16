const fs = require('fs')
const sinon = require('sinon')
const Database = require('./db')

const db = new Database('./sample.json')

const stub = sinon.stub(fs, 'writeFile').callsFake((path, data, cb) => {
  cb()
})
const cb = sinon.spy()

db.insert('key', 'value')
db.save(cb)

sinon.assert.calledOnce(stub)
sinon.assert.calledOnce(cb)

stub.restore()

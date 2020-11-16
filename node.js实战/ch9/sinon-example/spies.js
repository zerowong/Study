const fs = require('fs')
const sinon = require('sinon')
const Database = require('./db')

const db = new Database('./sample.json')

const fsWriteFileSpy = sinon.spy(fs, 'writeFile')
const cb = sinon.spy()

db.insert('key', 'value')
db.save(cb)

sinon.assert.calledOnce(fsWriteFileSpy)

fsWriteFileSpy.restore()

const assert = require('assert').strict
const memdb = require('..')

describe('memedb', () => {
  beforeEach(() => {
    memdb.clear()
  })

  describe('.saveSync(obj)', () => {
    it('should save the object', () => {
      const example = { key: 'value' }
      memdb.saveSync(example)
      assert.equal(memdb.length, 1)
      assert.equal(memdb.findFirst({ key: 'value' }), example)
    })
  })

  describe('.findFirst(obj)', () => {
    it('should return the first matching object', () => {
      const example1 = { key: 'value1' }
      const example2 = { key: 'value2' }
      memdb.saveSync(example1)
      memdb.saveSync(example2)
      assert.equal(memdb.findFirst({ key: 'value1' }), example1)
      assert.equal(memdb.findFirst({ key: 'value2' }), example2)
    })

    it('should return null when no object matches', () => {
      assert.equal(memdb.findFirst({ t: 't' }), null)
    })
  })

  describe('.save(obj)', () => {
    it('should save the object', async () => {
      const example = { key: 'value' }
      const result = await memdb.save(example)
      assert.equal(result, example)
    })
  })
})

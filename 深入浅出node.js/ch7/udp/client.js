const dgram = require('dgram')

const message1 = Buffer.from('test')
const message2 = Buffer.from('测试')
const client = dgram.createSocket('udp4')
client.send([message1, '/', message2], 8080, 'localhost', (err, bytes) => {
  if (err) {
    console.error(err.stack)
  }
  console.log('bytes: ', bytes)
  client.close()
})

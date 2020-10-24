const { fork } = require('child_process')
const net = require('net')

const child1 = fork('child.js')
const child2 = fork('child.js')

const server = net.createServer()

server.on('close', () => console.log('server closed'))

server.listen(8080, () => {
  console.log('server running')
  child1.send('server', server)
  child2.send('server', server)
  server.close()
})

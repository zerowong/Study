const { fork } = require('child_process')
const net = require('net')

const server = net.createServer()
const child1 = fork('child.js')
const child2 = fork('child.js')

server.on('connection', (socket) => {
  socket.end('handled by parent\n')
})

server.listen(8080, () => {
  console.log('server running')
  child1.send('server', server)
  child2.send('server', server)
})

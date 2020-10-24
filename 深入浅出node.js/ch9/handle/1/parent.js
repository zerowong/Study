const { fork } = require('child_process')
const net = require('net')

const child = fork('child.js')
const server = net.createServer()

server.on('connection', (socket) => {
  socket.end('handled by parent\n')
})

server.listen(8080, () => {
  console.log('server running')
  child.send('server', server)
})

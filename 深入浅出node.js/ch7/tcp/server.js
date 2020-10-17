const net = require('net')

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    socket.write('hello')
  })
  socket.on('end', () => console.log('disconnect'))
  socket.write('welcome to this example')
})

server.listen(8080, () => console.log('server bound'))

const http = require('http')

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end(`handled by child(pid:${process.pid})`)
})

process.on('message', (message, tcp) => {
  if (message === 'server') {
    tcp.on('connection', (socket) => {
      server.emit('connection', socket)
    })
  }
})

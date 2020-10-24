const http = require('http')

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end(`handle by child(pid:${process.pid})`)
  // test
  // throw new Error('throw exception')
})

let worker

process.on('message', (message, tcp) => {
  if (message === 'server') {
    worker = tcp
    worker.on('connection', (socket) => {
      server.emit('connection', socket)
    })
  }
})

process.on('uncaughtException', () => {
  // log here
  process.send({ act: 'suicide' })
  worker.close(() => {
    process.exit(1)
  })
  setTimeout(() => {
    process.exit(1)
  }, 5000)
})

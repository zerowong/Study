process.on('message', (message, server) => {
  if (message === 'server') {
    server.on('connection', (socket) => {
      socket.end(`handled by child(pid:${process.pid})\n`)
    })
  }
})

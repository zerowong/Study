const events = require('events')
const net = require('net')

const channel = new events.EventEmitter()

const clients = {}
const subscriptions = {}

channel.on('join', (id, client) => {
  client.write(`Guests online: ${channel.listenerCount('broadcast')}\r\n`)
  
  clients[id] = client
  subscriptions[id] = (senderId, message) => {
    if (id !== senderId) {
      clients[id].write(`${senderId} : ${message}\r\n`)
    }
  }
  channel.on('broadcast', subscriptions[id])
  console.log(`Client connected:${id}`)
})

channel.on('leave', (id) => {
  channel.removeListener('broadcast', subscriptions[id])
  channel.emit('broadcast', id, `System: ${id} has left the chatroom\r\n`)
  console.log(`Client disconnected:${id}`)
})

channel.on('shutdown', () => {
  channel.emit('broadcast', -1, 'System: The server has shut down\r\n')
  channel.removeAllListeners('broadcast')
  console.log('Everyone has been kicked out')
})

const server = net.createServer((client) => {
  const id = `${client.remoteAddress}:${client.remotePort}`
  channel.emit('join', id, client)
  client.on('data', (data) => {
    const message = data.toString()
    if (message === '/shutdown') {
      channel.emit('shutdown')
    }
    channel.emit('broadcast', id, message)
  })
  client.on('close', () => {
    channel.emit('leave', id)
  })
})
server.listen(8080)

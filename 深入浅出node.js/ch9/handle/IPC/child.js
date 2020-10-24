process.on('message', (message) => console.log('CHILD got message:', message))

process.send({ foo: 'bar' })

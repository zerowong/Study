const { fork } = require('child_process')

const cp = fork(__dirname + '/child.js')

cp.on('message', (message) => console.log('PARENT got message:', message))

cp.send({ hello: 'world' })

const { fork } = require('child_process')
const { cpus } = require('os')

const children = []
for (let i = 0; i < cpus().length; i++) {
  children.push(fork('worker.js'))
}

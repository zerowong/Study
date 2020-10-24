const cluster = require('cluster')
const numCpus = require('os').cpus().length

cluster.setupMaster({
  exec: 'server.js',
})

for (let i = 0; i < numCpus; i++) {
  cluster.fork()
}

console.log(`start ${numCpus} workers`)

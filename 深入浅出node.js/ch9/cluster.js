const cluster = require('cluster')
const numCpus = require('os').cpus().length

cluster.setupMaster({
  exec: 'worker.js',
})

for (let i = 0; i < numCpus; i++) {
  cluster.fork()
}

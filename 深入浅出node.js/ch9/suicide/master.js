const { fork } = require('child_process')
const numCpus = require('os').cpus().length
const server = require('net').createServer()

server.listen(8080, () => console.log('server running'))

const workers = new Map()
const LIMIT = 10
const DURATION = 60000
const restartQueue = []

function isTooFrequently() {
  const time = Date.now()
  const length = restartQueue.push(time)
  if (length > LIMIT) {
    restartQueue = restartQueue.slice(LIMIT * -1)
  }
  return restartQueue.length >= LIMIT && restartQueue[restartQueue.length - 1] - restartQueue[0] < DURATION
}

function createWorker() {
  if (isTooFrequently()) {
    process.emit('giveup', length, DURATION)
    return
  }
  const worker = fork('worker.js')
  const pid = worker.pid
  worker.on('message', (message) => {
    if (message.act === 'suicide') {
      createWorker()
    }
  })
  worker.on('exit', () => {
    console.log(`worker(pid:${pid} exited)`)
    workers.delete(pid)
  })
  worker.send('server', server)
  workers.set(pid, worker)
  console.log(`created worker(pid:${pid})`)
}

for (let i = 0; i < numCpus; i++) {
  createWorker()
}

process.on('exit', () => {
  workers.forEach((worker) => {
    worker.kill()
  })
})

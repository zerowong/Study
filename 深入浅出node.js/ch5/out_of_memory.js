const showMem = require('./show_memory')

function useMem(isBuffer = false) {
  const size = 200 * 1024 * 1024
  const res = isBuffer ? Buffer.alloc(size, 1) : new Array(size).fill(0)
  return res
}

const total = []

for (let i = 0; i < 15; i++) {
  total.push(useMem(true))
  console.log(i + '-'.repeat(100))
  const heapInfo = process.memoryUsage()
  showMem([
    { name: 'heapTotal', size: heapInfo.heapTotal },
    { name: 'heapUsed', size: heapInfo.heapUsed },
    { name: 'rss', size: heapInfo.rss },
  ])
}

const heapdump = require('heapdump')
const http = require('http')

const leakArray = []
const leak = () => {
  leakArray.push('leak', Math.random())
}

http
  .createServer((req, res) => {
    leak()
    res.writeHead(200, { 'Content-type': 'text/plain' })
    res.end('Hello World\n')
  })
  .listen(1337)

console.log('Server running at http://localhost:1337')

heapdump.writeSnapshot((err, filename) => {
  if (err) {
    console.error(err.message)
  }
  console.log('dump written to ', filename)
})

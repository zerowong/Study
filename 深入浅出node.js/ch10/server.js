const http = require('http')

const str = Buffer.from('a'.repeat(1024 * 10))

http
  .createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end(str)
  })
  .listen(8080, () => console.log('server running'))

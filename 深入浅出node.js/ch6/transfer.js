const http = require('http')

const testStr = 'a'.repeat(1024 * 10)

const buf = Buffer.from(testStr)

http.createServer((req, res) => {
  res.writeHead(200)
  res.end(buf)
}).listen(8001)

console.log('running at http://localhost:8001')

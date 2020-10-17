const http = require('http')

const port = 8080

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-tyep', 'text/plain')

  console.log(req.method, req.url, `HTTP/${req.httpVersion}`)
  console.log('headers: ', JSON.stringify(req.headers))

  const buffers = []
  req.on('data', (chunk) => buffers.push(chunk))
  req.on('end', () => {
    const buf = Buffer.concat(buffers)
    const str = buf.toString('utf8')
    console.log('data: ', str)
    res.end('hello world\n')
  })
})

server.listen(port, () => {
  console.log(`server running at http://localhost:${port}/`)
})

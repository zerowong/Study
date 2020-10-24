const http = require('http')

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Hello world\n')
})

const port = Math.round((1 + Math.random()) * 1000)
server.listen(port, () => console.log(`server running at http://localhost:${port}/`))

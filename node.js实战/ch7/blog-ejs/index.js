const fs = require('fs')
const path = require('path')
const ejs = require('ejs')
const http = require('http')
const entries = require('../blog-no-template/index')

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    fs.readFile(path.join(__dirname, 'blog.ejs'), { encoding: 'utf-8' }, (err, data) => {
      const output = ejs.render(data, { entries })
      res.setHeader('Content-Type', 'text/html')
      res.end(output)
    })
  } else {
    res.statusCode = 404
    res.end('Not found')
  }
})

server.listen(8081)

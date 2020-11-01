const http = require('http')
const fs = require('fs')

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    fs.readFile('./titles.json', (err, data) => {
      if (err) {
        console.error(err)
        res.end('Server Error')
      } else {
        const titles = JSON.parse(data.toString())
        fs.readFile('./template.html', (err, data) => {
          if (err) {
            console.error(err)
            res.end('Server Error')
          } else {
            const tmpl = data.toString()
            const html = tmpl.replace('%', titles.join('</li><li>'))
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.end(html)
          }
        })
      }
    })
  }
})

server.listen(8080, () => console.log('server running at http://localhost:8080/'))

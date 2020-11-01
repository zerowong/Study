const http = require('http')
const fs = require('fs')

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    getTitles(res)
  }
})

server.listen(8080)

function getTitles(res) {
  fs.readFile('./titles.json', (err, data) => {
    if (err) {
      handleError(err, res)
    } else {
      getTemplate(JSON.parse(data.toString()), res)
    }
  })
}

function getTemplate(titles, res) {
  fs.readFile('./template.html', (err, data) => {
    if (err) {
      handleError(err)
    } else {
      formatHtml(titles, data.toString(), res)
    }
  })
}

function formatHtml(titles, tmpl, res) {
  const html = tmpl.replace('%', titles.join('</li><li>'))
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end(html)
}

function handleError(err, res) {
  console.error(err)
  res.end('Server Error')
}

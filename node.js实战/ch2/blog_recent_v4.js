const http = require('http')
const fs = require('fs').promises

http.createServer(async (req, res) => {
  if (req.url === '/') {
    let titles, tmpl
    try {
      titles = await fs.readFile('./titles.json')
      tmpl = await fs.readFile('./template.html')
    } catch (e) {
      handleError(e, res)
    }
    titles = JSON.parse(titles.toString())
    tmpl = tmpl.toString()
    const html = tmpl.replace('%', titles.join('</li><li>'))
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(html)
  }
}).listen(8080)

function handleError(e, res) {
  console.error(e)
  res.end('Server Error')
}

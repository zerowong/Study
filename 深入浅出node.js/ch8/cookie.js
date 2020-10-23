const http = require('http')
const util = require('./util')

let cookies = {}

http
  .createServer((req, res) => {
    if (req.headers.cookie) {
      cookies = util.parseCookie(req.headers.cookie)
      // console.log(cookies)
    }
    if (cookies.isVisit !== 'true') {
      res.setHeader('Set-cookie', util.serialize('isVisit', 'true'))
      res.writeHead(200)
      res.end('first\n')
    } else {
      res.writeHead(200)
      res.end('not first\n')
    }
  })
  .listen(8080, () => console.log('running at http://localhost:8080'))

const http = require('http')
const util = require('./util')

const routes = []

function use(path, action) {
  routes.push([util.pathRE(path), action])
}

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i]
    const re = route[0].regexp
    const keys = route[0].keys
    const matched = re.exec(pathname)
    if (matched) {
      const params = {}
      for (let i = 0, l = keys.length; i < l; i++) {
        const value = matched[i + 1]
        if (value) {
          params[keys[i]] = value
        }
      }
      req.params = params
      route[1](req, res)
    }
  }
})

server.listen(8080, () => console.log('running at http://localhost:8080/'))

use('/example/something', (req, res) => res.end('something'))
use('/profile/:username', (req, res) => res.end(JSON.stringify(req.params.username)))
use('/user.:ext', (req, res) => res.end(JSON.stringify(req.params.ext)))

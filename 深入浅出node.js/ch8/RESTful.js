const http = require('http')
const util = require('./util')

const routes = { all: [] }

const app = {
  use(path, action) {
    routes.all.push([util.pathRE(path), action])
  },
}

const methods = ['get', 'put', 'delete', 'post']
methods.forEach((method) => {
  routes[method] = []
  app[method] = function (path, action) {
    routes[method].push([util.pathRE(path), action])
  }
})

const server = http.createServer((req, res) => {
  const match = (pathname, routes) => {
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
        return true
      }
    }
    return false
  }
  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname
  const method = req.method.toLocaleLowerCase()
  const log = () => {
    console.log(req.method, pathname)
  }
  if (Object.prototype.hasOwnProperty.call(routes, method)) {
    if (match(pathname, routes[method])) {
      log()
    } else {
      if (match(pathname, routes.all)) {
        log()
      }
    }
  } else {
    if (match(pathname, routes.all)) {
      log()
    }
  }
})

server.listen(8080, () => console.log('running at http://localhost:8080/'))

app.use('/example/something', (req, res) => res.end('something'))
app.use('/profile/:username', (req, res) => res.end(JSON.stringify(req.params.username)))
app.use('/user.:ext', (req, res) => res.end(JSON.stringify(req.params.ext)))

app.get('/profile/:username', (req, res) => res.end(JSON.stringify(req.params.username)))

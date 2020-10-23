const http = require('http')
const util = require('./util')

const PORT = 8080

class App {
  constructor() {
    this.routes = { all: [] }
  }

  use(pathOrMidw, ...args) {
    const handle = {
      path: undefined,
      stack: undefined,
    }
    if (typeof pathOrMidw === 'string') {
      handle.path = util.pathRE(pathOrMidw)
      handle.stack = args
    } else {
      handle.path = util.pathRE('/')
      handle.stack = [pathOrMidw]
    }
    this.routes.all.push(handle)
  }
}

function querystring(req, res, next) {
  req.query = new URL(req.url, `http://${req.headers.host}`).search
  next()
}

function cookie(req, res, next) {
  const cookies = {}
  const cookie = req.headers.cookie
  if (cookie) {
    cookies = util.parseCookie(cookie)
  }
  req.cookies = cookies
  next()
}

function handle(req, res, stack) {
  const next = (err) => {
    if (err) {
      return handle500(err, req, res, stack)
    }
    const middleware = stack.shift()
    if (typeof middleware === 'function') {
      try {
        middleware(req, res, next)
      } catch (e) {
        next(e)
      }
    }
  }
  next()
}

/**
 * @param {Function[]} stack
 */
function handle500(err, req, res, stack) {
  stack = stack.filter((middleware) => middleware.length === 4)
  const next = () => {
    const middleware = stack.shift()
    if (middleware) {
      middleware(err, req, res, next)
    }
  }
  next()
}

const app = new App()

const methods = ['get', 'put', 'delete', 'post']
methods.forEach((method) => {
  app.routes[method] = []
  app[method] = (path, ...args) => {
    const handle = {
      path: util.pathRE(path),
      stack: args,
    }
    app.routes[method].push(handle)
  }
})

const server = http.createServer((req, res) => {
  const match = (pathname, routes) => {
    const stacks = []
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i]
      const re = route.path.regexp
      const keys = route.path.keys
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
      }
      stacks.push(...route.stack)
    }
    return stacks
  }
  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname
  const method = req.method.toLocaleLowerCase()
  const stacks = match(pathname, app.routes.all)
  const log = () => {
    console.log(req.method, pathname)
  }
  res.statusCode = 200
  if (Object.prototype.hasOwnProperty.call(app.routes, method)) {
    stacks.push(...match(pathname, app.routes[method]))
  }
  if (stacks.length) {
    log()
    handle(req, res, stacks)
  }
})

server.listen(PORT, () => console.log(`running at http://localhost:8080/`))

const store = {
  user: new Map(),
}
store.user.set('zerowong', { age: 21 })

app.use(querystring)
app.use(cookie)
app.get('/profile/:username', (req, res) => {
  const content = JSON.stringify({
    query: req.query,
    cookies: req.cookies,
    ...store.user.get(req.params.username),
  })
  res.end(content)
})

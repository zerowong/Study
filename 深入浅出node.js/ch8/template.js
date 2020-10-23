const fs = require('fs')
const path = require('path')
const http = require('http')
const util = require('./util')

function escape(html) {
  return String(html)
    .replace(/&(?!\w+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&qout;')
    .replace(/'/g, '&#039;')
}

class Render {
  #cache = {}
  #files = {}
  constructor(viewFolder = '/') {
    this.VIEW_FOLDER = viewFolder
  }

  /**
   * @param {string} str
   */
  preCompile(str) {
    const replaced = str.replace(/<%\s+(include.*)\s+%>/g, (match, code) => {
      const partial = code.split(/\s/)[1]
      if (!this.#files[partial]) {
        this.#files[partial] = fs.readFileSync(path.join(this.VIEW_FOLDER, partial), 'utf8')
      }
      return this.#files[partial]
    })
    if (str.match(/<%\s+(include.*)\s+%>/)) {
      return this.preCompile(replaced)
    } else {
      return replaced
    }
  }

  compile(str) {
    str = this.preCompile(str)
    const tpl = str
      .replace(/\n/g, '\\n')
      .replace(/<%=([\s\S]+?)%>/g, (match, code) => {
        return `' + escape(${code}) + '`
      })
      .replace(/<%-([\s\S]+?)%>/g, (match, code) => {
        return `' + ${code} + '`
      })
      .replace(/<%([\s\S]+?)%>/g, (match, code) => {
        return `';\n${code}\ntpl += '`
      })
      .replace(/\'\n/g, "'")
      .replace(/\n\'/gm, "'")
    let funcBody = `tpl = '${tpl}'`
    funcBody = funcBody.replace(/''/g, "'\\n'")
    funcBody = `
    let tpl = '';
    with (obj) {
      ${funcBody};
    }
    return tpl.trim();
    `
    return new Function('obj', 'escape', funcBody)
  }

  /**
   *
   * @param {string} str
   * @param {string} viewname
   */
  renderLayout(str, viewname) {
    return str.replace(/<%-\s*body\s*%>/g, (match, code) => {
      if (!this.#cache[viewname]) {
        this.#cache[viewname] = fs.readFileSync(path.join(this.VIEW_FOLDER, viewname), 'utf8')
      }
      return this.#cache[viewname]
    })
  }

  render(viewname, data) {
    const layout = data.layout
    if (layout) {
      if (!this.#cache[layout]) {
        try {
          this.#cache[layout] = fs.readFileSync(path.join(this.VIEW_FOLDER, layout), 'utf8')
        } catch (e) {
          throw Error('Failed to read file')
        }
      }
    }
    const layoutContent = this.#cache[layout] || '<%-body%>'
    let replaced
    try {
      replaced = this.renderLayout(layoutContent, viewname)
    } catch (e) {
      throw Error('Failed to read file')
    }
    const key = `${viewname}:${layout || ''}`
    if (!this.#cache[key]) {
      this.#cache[key] = this.compile(replaced)
    }
    return this.#cache[key](data, escape)
  }
}

class App {
  #routes = { middlewares: [] }
  constructor() {
    const methods = ['get', 'put', 'delete', 'post']
    methods.forEach((method) => {
      this.#routes[method] = []
      this[method] = (path = '/', ...handlers) => {
        const handle = {
          path: util.pathRE(path),
          stack: handlers,
        }
        this.#routes[method].push(handle)
      }
    })
  }

  use(path = '/', ...middlewares) {
    const handle = {
      path: util.pathRE(path),
      stack: middlewares,
    }
    this.#routes.middlewares.push(handle)
  }

  get routes() {
    return this.#routes
  }
}

class Handle {
  static handle(req, res, stack) {
    const next = (err) => {
      if (err) {
        return this.handle500(err, req, res, stack)
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
   * @param {function[]} stack
   */
  static handle500(err, req, res, stack) {
    stack = stack.filter((middleware) => middleware.length === 4)
    const next = () => {
      const middleware = stack.shift()
      if (middleware) {
        middleware(err, req, res, next)
      }
    }
    next()
  }

  static match(req, res, pathname, routes) {
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
        stacks.push(...route.stack)
      }
    }
    return stacks
  }
}

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname
  const method = req.method.toLocaleLowerCase()
  const log = () => console.log(req.method, pathname)
  const stacks = Handle.match(req, res, pathname, app.routes.middlewares)
  if (Object.prototype.hasOwnProperty.call(app.routes, method)) {
    stacks.push(...Handle.match(req, res, pathname, app.routes[method]))
  }
  if (stacks.length) {
    log()
    Handle.handle(req, res, stacks)
  }
})

server.listen(8080, () => console.log('server running at http://localhost:8080/'))

const store = {
  user: new Map(),
}

store.user.set('zerowong', { name: 'zerowong', age: 21 })

const app = new App()

app.get('/profile/:username', (req, res) => {
  const arender = new Render('./views')
  try {
    const content = arender.render('user.html', store.user.get(req.params.username))
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(content)
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/html' })
    res.end('error')
    console.log(e)
  }
})

app.get('/profile', (req, res) => {
  const arender = new Render('./views')
  try {
    const content = arender.render('userShow2.html', {
      layout: 'profile.html',
      users: Array.from(store.user.values()),
    })
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(content)
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/html' })
    res.end('error')
    console.log(e)
  }
})

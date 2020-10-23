const http = require('http')
const util = require('./util')

const sessions = new Map()
const key = 'sessionId'
const EXPIRES = 20 * 60 * 1000

function generate() {
  const session = {
    id: new Date().getTime() + Math.random(),
    cookie: {
      expire: new Date().getTime() + EXPIRES,
    },
  }
  sessions.set(session.id, session)
  return session
}

function hanlde(req, res) {
  if (!req.session.isVisit) {
    req.session.isVisit = true
    res.writeHead(200)
    res.end('first\n')
  } else {
    res.writeHead(200)
    res.end('not first\n')
  }
}

const server = http.createServer((req, res) => {
  const redirect = (url) => {
    res.setHeader('Location', url)
    res.writeHead(302)
    res.end()
  }
  const id = req.headers.cookie ? req.headers.cookie[key] : null
  // check
  if (id) {
    const session = sessions.get(id)
    if (session) {
      // check time
      if (session.cookie.expire > new Date().getTime()) {
        session.cookie.expire = new Date().getTime() + EXPIRES
        req.session = session
        hanlde(req, res)
      } else {
        sessions.delete(id)
        req.session = generate()
        redirect(util.getURL(req.url, `http://${req.headers.host}`, key, req.session.id))
      }
    } else {
      req.session = generate()
      redirect(util.getURL(req.url, `http://${req.headers.host}`, key, req.session.id))
    }
  } else {
    req.session = generate()
    redirect(util.getURL(req.url, `http://${req.headers.host}`, key, req.session.id))
  }
  const writeHead = res.writeHead
  res.writeHead = function () {
    const session = util.serialize(key, req.session.id)
    let cookies = res.getHeader('Set-Cookie')
    cookies = Array.isArray(cookies) ? cookies.concat(session) : [cookies, session]
    res.setHeader('Set-Cookie', cookies)
    // cache
    // store.save(req.session)
    return writeHead.apply(this, arguments)
  }
})

server.listen(8080, () => console.log('running at http://localhost:8080'))

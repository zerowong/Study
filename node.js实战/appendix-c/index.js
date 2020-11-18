const path = require('path')
const connect = require('connect')
const cookieParser = require('cookie-parser')
const qs = require('qs')
const bodyParser = require('body-parser')
const multiparty = require('connect-multiparty')
const compression = require('compression')
const morgan = require('morgan')
const favicon = require('serve-favicon')

const app = connect()
const port = 8080
const secret = 'secret'

function veifyRequest(req, res, buf, encoding) {
  if (!buf.toString().match(/^name=/)) {
    throw new Error('bad format')
  }
}

app
  .use(favicon(path.join(__dirname, 'favicon.ico')))
  .use(morgan('combined'))
  .use(cookieParser(secret))
  .use(bodyParser.urlencoded({ extended: false, verify: veifyRequest, limit: 10 }))
  .use(bodyParser.json())
  .use(multiparty())
  .use(compression())
  .use((req, res, next) => {
    const cookies = req.cookies
    const signedCookies = req.signedCookies
    console.log('cookies:', cookies)
    console.log('signedCookies:', signedCookies)
    next()
  })
  .use((req, res, next) => {
    console.log('raw query string:', req._parsedUrl.query)
    req.query = qs.parse(req._parsedUrl.query)
    next()
  })
  .use((req, res, next) => {
    console.log('query string object:', req.query)
    next()
  })
  .use((req, res, next) => {
    console.log('string body:', req.body)
    next()
  })
  .use((req, res, next) => {
    console.log('json body:', req.body)
    next()
  })
  .use((req, res, next) => {
    console.log('files', req.files)
    next()
  })
  .use((req, res) => {
    // res.setHeader('Content-Type', '')
    res.end()
  })
  .listen(port, () => console.log(`Server running at http://localhost:${port}`))

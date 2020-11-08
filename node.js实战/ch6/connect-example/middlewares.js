/**
 * @param {string} format
 */
function createLogger(format) {
  const re = /:(\w+)/g
  return function logger(req, res, next) {
    const msg = format.replace(re, (match, proprety) => {
      return req[proprety]
    })
    console.log(msg)
    next()
  }
}

const env = process.env.NODE_ENV || 'development'

function errorHandler(err, req, res, next) {
  res.statusCode = 500
  switch (env) {
    case 'development': {
      console.error(err)
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(err))
      break
    }
    default: {
      res.setHeader('Content-Type', 'text/plain')
      res.end('Server error')
    }
  }
}

module.exports = { createLogger, errorHandler }

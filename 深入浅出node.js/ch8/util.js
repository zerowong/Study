const url = require('url')
const crypto = require('crypto')

/**
 * @param {string} cookie
 */
function parseCookie(cookie) {
  const cookies = {}
  const list = cookie.split(';')
  list.forEach((item) => {
    const pair = item.split('=')
    cookies[pair[0].trim()] = pair[1]
  })
  return cookies
}

function serialize(name, val, opt = {}) {
  const pairs = [`${name}=${encodeURI(val)}`]

  if (opt.maxAge) pairs.push(`Max-Age=${opt.maxAge}`)
  if (opt.domain) pairs.push(`Domain=${opt.domain}`)
  if (opt.path) pairs.push(`Path=${opt.path}`)
  if (opt.expires) pairs.push(`Expires=${opt.expires.toUTCString()}`)
  if (opt.httpOnly) pairs.push('HttpOnly')
  if (opt.secure) pairs.push('Secure')

  return pairs.join(';')
}

function getURL(urlArg, base, key, value) {
  const urlObj = new URL(urlArg, base)
  const params = new URLSearchParams(urlObj.search)
  params.set(key, value)
  urlObj.search = params.toString()
  return url.format(urlObj, { auth: false, fragment: false })
}

function sign(val, secret) {
  return val + '.' + crypto.createHmac('sha256', secret).update(val).digest('base64').replace(/\=+$/, '')
}

function unsign(val, secret) {
  const str = val.slice(0, val.lastIndexOf('.'))
  return sign(str, secret) === val ? str : false
}

/**
 * @param {string} path
 */
function pathRE(path, strict = false) {
  const keys = []
  const res = path
    .concat(strict ? '' : '/?')
    .replace(/\/\(/g, '(?:/')
    .replace(
      /(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g,
      (_, slash, format, key, capture, optional, star) => {
        keys.push(key)
        slash = slash || ''
        return (
          '' +
          (optional ? '' : slash) +
          '(?:' +
          (optional ? slash : '') +
          (format || '') +
          (capture || (format && '([^/.]+?)') || '([^/]+?)') +
          ')' +
          (optional || '') +
          (star ? '(/*)?' : '')
        )
      }
    )
    .replace(/([\/.])/g, '\\$1')
    .replace(/\*/g, '(.*)')
  return {
    keys: keys,
    regexp: new RegExp('^' + res + '$'),
  }
}

module.exports = {
  parseCookie,
  serialize,
  getURL,
  sign,
  unsign,
  pathRE,
}

function message(req) {
  return (msg, type) => {
    const _type = type || 'info'
    const sess = req.session
    sess.messages = sess.messages || []
    sess.messages.push({ type: _type, string: msg })
  }
}

module.exports = (req, res, next) => {
  res.message = message(req)
  res.error = (msg) => {
    return res.message(msg, 'error')
  }
  res.locals.messages = req.session.messages || []
  res.locals.removeMessages = () => {
    req.session.messages = []
  }
  next()
}

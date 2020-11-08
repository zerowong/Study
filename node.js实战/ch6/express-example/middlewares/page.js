module.exports = (cb, perpage = 10) => {
  return (req, res, next) => {
    const page = Math.max(parseInt(req.params.page || '1', 10), 1) - 1
    cb((err, total) => {
      if (err) return next(err)
      req.page = res.locals.page = {
        perpage,
        total,
        number: page,
        from: page * perpage,
        to: page * perpage + perpage - 1,
        count: Math.ceil(total / perpage),
      }
      next()
    })
  }
}

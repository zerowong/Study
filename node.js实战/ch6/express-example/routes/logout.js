const router = require('express').Router()

router.get('/', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) throw err
    res.redirect('/')
  })
})

module.exports = router

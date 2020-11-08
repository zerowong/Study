const router = require('express').Router()
const User = require('../models/user')

router.get('/', (req, res, next) => {
  res.render('login', { title: 'Login' })
})

router.post('/', (req, res, next) => {
  const data = req.body.user
  User.authenticate(data.name, data.pass, (err, user) => {
    if (err) return next(err)
    if (user) {
      req.session.uid = user.id
      res.redirect('/')
    } else {
      res.error('Sorry! invalid credentials')
      res.redirect('back')
    }
  })
})

module.exports = router

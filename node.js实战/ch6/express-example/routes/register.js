const router = require('express').Router()
const User = require('../models/user')

router.get('/', (req, res, next) => {
  res.render('register', { title: 'Register' })
})

router.post('/', (req, res, next) => {
  const data = req.body.user
  User.getByName(data.name, (err, user) => {
    if (err) return next(err)
    if (user.id) {
      res.error('Username already taken!')
      res.redirect('back')
    } else {
      const newUser = new User({
        name: data.name,
        pass: data.pass,
      })
      newUser.save((err) => {
        if (err) return next(err)
        req.session.uid = newUser.id
        res.redirect('/')
      })
    }
  })
})

module.exports = router

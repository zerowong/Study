const router = require('express').Router()
const auth = require('basic-auth')
const User = require('../models/user')
const submit = require('./post').submit
const Entry = require('../models/entry')
const page = require('../middlewares/page')

router.use((req, res, next) => {
  const { name, pass } = auth(req)
  User.authenticate(name, pass, (err, user) => {
    if (user) req.remoteUser = user
    next(err)
  })
})

router.get('/user/:id', (req, res, next) => {
  User.get(req.params.id, (err, user) => {
    if (err) return next(err)
    if (!user.id) res.sendStatus(404)
    res.json(user.toJson())
  })
})

router.post('/post', submit)

router.get('/post/:page?', page(Entry.count), (req, res, next) => {
  const page = req.page
  Entry.getRange(page.from, page.to, (err, entries) => {
    if (err) return next(err)
    res.format({
      json: () => {
        res.send(entries)
      },
      xml: () => {
        res.render('entries/xml', { entries: entries })
      },
    })
  })
})

module.exports = router

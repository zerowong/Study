const express = require('express')
const Entry = require('../models/entry')

const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('post', { title: 'Post' })
})

const submit = (req, res, next) => {
  const data = req.body.entry
  const user = res.locals.user
  const username = user ? user.name : null
  const entry = new Entry({
    username,
    title: data.title,
    body: data.body,
  })
  entry.save((err) => {
    if (err) return next(err)
    if (req.remoteUser) {
      res.json({ message: 'Post added' })
    } else {
      res.redirect('/')
    }
  })
}

router.post('/', submit)

module.exports = { router, submit }

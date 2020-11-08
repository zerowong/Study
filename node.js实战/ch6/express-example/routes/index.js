const express = require('express')
const Entry = require('../models/entry')

const router = express.Router()

// 帖子列表页面
router.get('/', (req, res, next) => {
  // 0:list的第一个元素，-1:list的最后一个元素
  Entry.getRange(0, -1, (err, entries) => {
    if (err) return next(err)
    res.render('index', {
      entries,
      title: 'Index',
    })
  })
})

module.exports = router

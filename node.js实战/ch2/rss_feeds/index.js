const fs = require('fs')
const request = require('request')
const htmlparser = require('htmlparser')

const configFileName = './rss_feeds.txt'

function readRSSFile() {
  fs.readFile(configFileName, (err, data) => {
    if (err) return next(err)
    const feedList = data
      .toString()
      .replace(/^\s+|\s+$/g, '')
      .split('\n')
    const random = Math.floor(Math.random() * feedList.length)
    next(null, feedList[random])
  })
}

function downloadRSSFeed(feedUrl) {
  request({ uri: feedUrl }, (err, res, body) => {
    if (err) return next(err)
    if (res.statusCode !== 200) {
      return next(new Error('Abnormal response status code'))
    }
    next(null, body)
  })
}

function parseRSSFeed(rss) {
  const handle = new htmlparser.RssHandler()
  const parser = new htmlparser.Parser(handle)
  parser.parseComplete(rss)
  if (!handle.dom.items.length) {
    return next(new Error('no RSS items found'))
  }
  const item = handle.dom.items.shift()
  console.log(item.title)
  console.log(item.link)
}

const tasks = [readRSSFile, downloadRSSFeed, parseRSSFeed]

function next(err, result) {
  if (err) throw err
  const currentTask = tasks.shift()
  if (currentTask) {
    currentTask(result)
  }
}

next()

const express = require('express')
const bodyParser = require('body-parser')
const read = require('node-readability')
const { Article } = require('./db')

const app = express()

app.set('port', 8080)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/css/bootstrap.css', express.static('node_modules/bootstrap/dist/css/bootstrap.css'))

app.get('/articles', (req, res, next) => {
  Article.all((err, articles) => {
    if (err) return next(err)
    res.format({
      html: () => {
        res.render('articles.ejs', { articles })
      },
      json: () => {
        res.send(articles)
      },
    })
    console.log('GET /articles')
  })
})

app.post('/articles', (req, res, next) => {
  const url = req.body.url
  read(url, (err, result) => {
    if (err || !result) res.status(500).send('Error downloading article')
    Article.create({ title: result.title, content: result.content }, (err, article) => {
      if (err) return next(err)
      res.send('OK')
      console.log('POST /articles')
    })
  })
})

app.get('/articles/:id', (req, res, next) => {
  const id = req.params.id
  Article.find(id, (err, article) => {
    if (err) return next(err)
    res.format({
      html: () => {
        res.render('article.ejs', { article })
      },
      json: () => {
        res.send(article)
      },
    })
    console.log(`GET /articles/${id}`)
  })
})

app.delete('/articles/:id', (req, res, next) => {
  const id = req.params.id
  Article.delete(id, (err) => {
    if (err) return next(err)
    res.send({ message: 'Delete' })
    console.log(`DELETE /articles/${id}`)
  })
})

app.listen(app.get('port'), () => {
  console.log('App started on port ', app.get('port'))
})

module.exports = app

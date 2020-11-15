const { createTable, Article } = require('./db')

createTable()
  .then(() => {
    Article.create({
      title: 'something',
      content: 'something',
    }).then(() => {
      Article.all().then((articles) => {
        console.log(articles)
        process.exit()
      })
    })
  })
  .catch((e) => console.error(e))

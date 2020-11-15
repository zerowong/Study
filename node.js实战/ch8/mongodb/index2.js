const { initDb, Article } = require('./db')

;(async () => {
  await initDb()
  await Article.create({ title: 'something' })
  const articles = await Article.all()
  console.log(articles)
  process.exit()
})()

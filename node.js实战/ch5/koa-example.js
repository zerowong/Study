const Koa = require('koa')
const Router = require('@koa/router')

const app = new Koa()
const router = new Router()

router
  .get('/', (ctx, next) => {
    ctx.body = 'Hello World'
    return next()
  })
  .get('/pages', (ctx, next) => {
    ctx.body = 'Pages'
    return next()
  })
  .get('/pages/:id', (ctx, next) => {
    ctx.body = 'A page'
    return next()
  })
  .put('pages-update', '/pages/:id', (ctx, next) => {
    ctx.body = 'Pages updated'
    return next()
  })

app.use(router.routes())

app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
})

app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// app.use(async (ctx) => {
//   ctx.body = 'Hello World'
// })

app.listen(8080, () => console.log('Server running...'))

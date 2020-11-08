const connect = require('connect')
const { createLogger, errorHandler } = require('./middlewares')

const app = connect()

function hello(req, res, next) {
  next(new Error('Intentional error'))
}

app.use(createLogger(':method :url'))
app.use(hello)
app.use(errorHandler)
app.listen(8080, () => console.log('server running...'))

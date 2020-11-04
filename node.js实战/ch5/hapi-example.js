const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')

const server = Hapi.server({
  port: 8080,
  host: 'localhost',
})

server.route({
  method: 'GET',
  path: '/',
  handler: (req, h) => {
    return 'Hello World'
  },
})

server.route({
  method: 'GET',
  path: '/{name}',
  handler: (req, h) => {
    return `Hello ${encodeURIComponent(req.params.name)}`
  },
})

const init = async () => {
  await server.register(Inert)
  server.route({
    method: 'GET',
    path: '/hello',
    handler: (req, h) => {
      return h.file('./public/hello.html')
    },
  })
  await server.start()
  console.log(`Server running at ${server.info.uri}`)
}

process.on('unhandledRejection', (err) => {
  console.error(err)
  process.exit(1)
})

init()

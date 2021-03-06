const tls = require('tls')
const fs = require('fs')

const options = {
  requestCert: true,
  key: fs.readFileSync('./keys/server.key'),
  cert: fs.readFileSync('./keys/server.crt'),
  ca: [fs.readFileSync('./keys/ca.crt')],
}

const server = tls.createServer(options, (stream) => {
  console.log('server connected', stream.authorized ? 'authorized' : 'unauthorized')
  stream.write('welcome\n')
  stream.setEncoding('utf8')
  stream.pipe(stream)
})

server.listen(8080, () => console.log('server bound'))

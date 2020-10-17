const https = require('https')
const fs = require('fs')

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/',
  method: 'GET',
  key: fs.readFileSync('./keys/client.key'),
  cert: fs.readFileSync('./keys/client.crt'),
  ca: [fs.readFileSync('./keys/ca.crt')],
}

options.agent = new https.Agent(options)

const req = https.request({ ...options, rejectUnauthorized: false }, (res) => {
  res.setEncoding('utf8')
  res.on('data', (data) => console.log(data))
})
req.end()

req.on('error', (e) => console.error(e))

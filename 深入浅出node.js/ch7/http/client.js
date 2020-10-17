const http = require('http')

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/',
  method: 'GET',
}

const req = http.request(options, (res) => {
  console.log(`HTTP/${res.httpVersion} ${res.statusCode}`)
  console.log(`headers: ${JSON.stringify(res.headers)}`)
  res.setEncoding('utf8')
  res.on('data', (chunk) => console.log(chunk))
})

console.log('req:', req)

req.end()

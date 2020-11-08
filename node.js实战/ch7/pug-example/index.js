const path = require('path')
const pug = require('pug')
const http = require('http')

const filename = path.join(__dirname, 'contacts.pug')
const context = {
  title: 'Contacts',
  contacts: [
    {
      firstName: 'zero',
      lastName: 'wong',
      isEditable: true,
      id: 0,
      status: 'Active',
    },
    {
      firstName: 'a',
      lastName: 'b',
      isEditable: false,
      id: 1,
      status: 'Inactive',
    },
  ],
}

const fn = pug.compileFile(filename)
const result = fn(context)

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end(result)
})

server.listen(8080)

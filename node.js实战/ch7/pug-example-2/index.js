const path = require('path')
const pug = require('pug')

const filename = path.join(__dirname, 'templates', 'page.pug')
const context = { messages: ['You have logged in successfully.', 'Welcome back!'] }
const fn = pug.compileFile(filename)
const result = fn(context)

console.log(result)

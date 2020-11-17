const fs = require('fs')
const { JSDOM } = require('jsdom')

const html = fs.readFileSync('./example.html')
const dom = new JSDOM(html, { runScripts: 'dangerously' })

const book = {
  title: dom.window.document.querySelector('h2').textContent,
  author: dom.window.document.querySelector('h3').textContent,
}

console.log(book)

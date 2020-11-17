const fs = require('fs')
const cheerio = require('cheerio')

const html = fs.readFileSync('./example.html', 'utf-8')
const $ = cheerio.load(html)

const book = {
  title: $('table tr td a').first().text(),
  href: $('table tr td a').first().attr('href'),
  desc: $('table tr td').eq(1).text(),
}

console.log(book)

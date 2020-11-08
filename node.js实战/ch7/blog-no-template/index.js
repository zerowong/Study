const fs = require('fs')
const http = require('http')
const path = require('path')

function getEntries(filename) {
  const entries = []
  let entriesRaw = fs.readFileSync(path.join(__dirname, filename), { encoding: 'utf-8' })
  entriesRaw = entriesRaw.split('---')
  for (let i = 0; i < entriesRaw.length; i++) {
    const entry = {}
    const lines = entriesRaw[i].split('\n')
    for (let j = 0; j < lines.length; j++) {
      if (lines[j].indexOf('title: ') === 0) {
        entry.title = lines[j].replace('title: ', '')
      } else if (lines[j].indexOf('date: ') === 0) {
        entry.date = lines[j].replace('date: ', '')
      } else {
        if (!entry.body) entry.body = ''
        entry.body += lines[j]
      }
    }
    entries.push(entry)
  }
  return entries
}

/**
 * @param {{}[]} entries
 */
function blogPage(entries) {
  let output = `
  <html>
  <head>
    <style type="text/css">
      .entry_title { font-weight: bold; }
      .entry_date { font-style: italic; }
      .entry_body { margin-bottom: 1em; }
    </style>
  </head>
  <body>
  `
  for (let i = 0; i < entries.length; i++) {
    output += `
    <div class="entry_title">${entries[i].title}</div>
    <div class="entry_date">${entries[i].date}</div>
    <div class="entry_body">${entries[i].body}</div>
    `
  }
  output += '</body></html>'
  return output
}

const entries = getEntries('entries.txt')

const server = http.createServer((req, res) => {
  const output = blogPage(entries)
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end(output)
})

server.listen(8080)

module.exports = entries

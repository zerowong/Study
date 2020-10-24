const fs = require('fs')

function getContent(filename) {
  try {
    return fs.readFileSync(filename, 'utf8')
  } catch (e) {
    return ''
  }
}

module.exports = { getContent }

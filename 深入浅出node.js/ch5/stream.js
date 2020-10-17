const fs = require('fs')

const reader = fs.createReadStream('in.txt')
const writer = fs.createWriteStream('out.txt')
try {
  reader.pipe(writer)
  console.log('done')
} catch (e) {
  console.error(e.message)
}

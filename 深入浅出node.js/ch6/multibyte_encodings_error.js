const fs = require('fs')

const rs = fs.createReadStream('test.md', { highWaterMark: 11 })
let data = ''

// fix
rs.setEncoding('utf8')

rs.on('data', (chunk) => (data += chunk))
rs.on('end', () => console.log(data))

const iconv = require('iconv-lite')

const str = iconv.decode(Buffer.from([0x68, 0x65, 0x6c, 0x6c, 0x6f]), 'win1251')

const buf = iconv.encode('example', 'win1251')

console.log(str, buf)

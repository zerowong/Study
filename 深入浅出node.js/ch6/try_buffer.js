const str = '深入浅出node.js'
const buf1 = Buffer.from(str, 'utf8')
console.log(buf1, buf1.length)

const buf2 = Buffer.alloc(100, 0)
console.log(buf2.length)

buf2[0] = 10
console.log(buf2[0])
buf2[1] = -1
console.log(buf2[1])
buf2[2] = 256
console.log(buf2[2])
buf2[3] = 3.1415
console.log(buf2[3])

console.log(Buffer.poolSize)

let len = buf2.write('\u00bd + \u00bc = \u00be', 4)
console.log(buf2.toString('utf8', 4, len + 4))

console.log(Buffer.isEncoding('GBK'))

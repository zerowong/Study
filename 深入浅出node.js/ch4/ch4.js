const fs = require('fs')
const fsp = require('fs').promises
const path = require('path')
const os = require('os')

const getFile = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) {
        reject(err)
        return
      }
      resolve(data)
    })
  })
}

const showFile = async (filename) => {
  try {
    const result = await getFile(filename)
    process.stdout.write(result)
  } catch (e) {
    console.error(e)
  }
}

showFile('./example.txt')

try {
  const fd = fs.openSync('./example.txt', 'r')
  console.log(fd)
} catch (e) {
  console.error(e)
}

fs.stat('./example.txt', (err, stats) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(stats.isFile())
  console.log(stats.isSymbolicLink())
  console.log(stats.size)
})

const examplePath = path.resolve('./example.txt')
const info = []
info.push(path.dirname(examplePath))
info.push(path.basename(examplePath))
info.push(path.basename(examplePath, path.extname(examplePath)))
info.push(path.extname(examplePath))
console.log(info)

class Foo {
  static mkdirSyncInCwd(folderName) {
    const target = process.cwd() + '\\' + folderName
    try {
      if (!fs.existsSync(target)) {
        fs.mkdirSync(target)
        console.log('Folder created successfully')
      } else {
        console.log(`"${target}" already exists`)
      }
    } catch (e) {
      console.log('Folder creation failed')
    }
  }

  static readDirSync(folderPath) {
    try {
      if (fs.existsSync(folderPath)) {
        const result = fs.readdirSync(folderPath)
          .map((filename) => path.join(folderPath, filename))
        console.log(result)
      } else {
        console.log(`${folderPath} not exists`)
      }
    } catch (e) {
      console.log('Folder read failed')
    }
  }
}

Foo.mkdirSyncInCwd('newFolder')
Foo.readDirSync('D:/Code/Web Dev/src')

console.log(
  os.EOL,
  os.arch(),
  os.cpus(),
  os.endianness(),
  os.freemem(),
  os.totalmem(),
  os.homedir(),
  os.hostname(),
  os.networkInterfaces(),
  os.platform(),
  os.release(),
  os.uptime(),
  os.userInfo()
)

process.nextTick(() => console.log('nextTick1'))
process.nextTick(() => console.log('nextTick2'))
setImmediate(() => {
  console.log('setImmediate1')
  process.nextTick(() => console.log('insert'))
})
setImmediate(() => {
  console.log('setImmediate2')
})
console.log('normal')

class MyPromise {
  constructor() {
    this.queue = []
    this.isPromise = true
  }

  then(fulfilledHandler, errorHandler) {
    const handler = {}
    if (typeof fulfilledHandler === 'function') {
      handler.fulfilled = fulfilledHandler
    }
    if (typeof errorHandler === 'function') {
      handler.error = errorHandler
    }
    this.queue.push(handler)
    return this
  }
}

class Deferred {
  constructor() {
    this.promise = new MyPromise()
  }

  resolve(obj) {
    const _pormise = this.promise
    let handler
    while ((handler = _pormise.queue.shift())) {
      if (handler && handler.fulfilled) {
        const ret = handler.fulfilled(obj)
        if (ret && ret.isPromise) {
          ret.queue = _pormise.queue
          this.promise = ret
          return
        }
      }
    }
  }

  reject(err) {
    const _pormise = this.promise
    let handler
    while ((handler = _pormise.queue.shift())) {
      if (handler && handler.error) {
        const ret = handler.error(err)
        if (ret && ret.isPromise) {
          ret.queue = _pormise.queue
          this.promise = ret
          return
        }
      }
    }
  }

  callback() {
    const that = this
    return function(err, data) {
      if (err) {
        return that.reject(err)
      }
      that.resolve(data)
    }
  }
}

const readFile1 = (file, encoding) => {
  const deferred = new Deferred()
  fs.readFile(file, encoding, deferred.callback())
  return deferred.promise
}

const readFile2 = (file, encoding) => {
  const deferred = new Deferred()
  fs.readFile(file, encoding, deferred.callback())
  return deferred.promise
}

readFile1('./file1.txt', 'utf8')
  .then((file1) => readFile2(file1, 'utf8'))
  .then((file2) => console.log(file2))

;(async (path) => {
  try {
    const result = await fsp.readFile(path, 'utf8')
    console.log(result)
  } catch (e) {
    console.error('something wrong', e.message)
  }
})('./example.txt')

;(async (path) => {
  try {
    const file1 = await fsp.readFile(path, 'utf8')
    const file2 = await fsp.readFile(file1, 'utf8')
    console.log(file2)
  } catch (e) {
    console.error('something wrong', e.message)
  }
})('./file1.txt')

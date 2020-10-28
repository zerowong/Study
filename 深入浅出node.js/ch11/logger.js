const fs = require('fs')
const os = require('os')
const moment = require('moment')

const infoLog = fs.createWriteStream('./info.log', { flags: 'a' })
const errorLog = fs.createWriteStream('./error.log', { flags: 'a' })

const logger = new console.Console(infoLog, errorLog)

function format(msg) {
  let res = ''
  if (!msg) {
    return res
  }
  const time = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
  if (msg instanceof Error) {
    res = `${time}\n${msg.stack}\nHost: ${os.hostname()}\nMessage: ${msg.message}\n`
  } else {
    res = `${time}\n${Array.from(arguments).join(' ')}\n`
  }
  return res
}

// test
logger.error(format(new Error()))
const input = '{error:format}'
try {
  JSON.parse(input)
} catch (e) {
  e.message = input
  logger.error(format(e))
}

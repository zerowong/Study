function format(bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + 'MB'
}

function showMem(...args) {
  const _args = args.flat(Infinity)
  let message = ''
  _args.forEach((arg) => {
    message += `${arg.name} ${format(arg.size)} `
  })
  console.log(message)
}

module.exports = showMem

const signature = require('cookie-signature')

const result = signature.sign('zero', 'secret')
console.log(result)

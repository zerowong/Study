const currency = require('./currency')
const Currency = require('./currency_class')

function handle(list, fn) {
  const res = []
  for (let i = 0; i < list.length; i++) {
    res.push(String(fn(list[i])))
  }
  return res.join(', ')
}

const example = [0.1, 1, 10, 100, 500, 999, 1000, 1999]

const res1 = handle(example, currency.canadianToUs)
const res2 = handle(example, currency.usToCanadian)

console.log(res1)
console.log(res2)

const currencyInstance = new Currency()

const res3 = handle(example, currencyInstance.canadianToUs.bind(currencyInstance))
const res4 = handle(example, currencyInstance.usToCanadian.bind(currencyInstance))

console.log(res3)
console.log(res4)

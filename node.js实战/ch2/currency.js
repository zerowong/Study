const canadianDollar = 0.751

function roundTwo(amount) {
  return Math.round(amount * 1000) / 1000
}

exports.canadianToUs = (canadian) => roundTwo(canadian * canadianDollar)

exports.usToCanadian = (us) => roundTwo(us / canadianDollar)

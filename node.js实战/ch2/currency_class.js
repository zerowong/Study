class Currency {
  #canadianDollar
  #precision
  constructor(canadianDollar = 0.751, precision = 3) {
    this.#canadianDollar = canadianDollar
    this.#precision = 10 ** precision
  }

  [Symbol.roundTwoDecimals](amount) {
    return Math.round(amount * this.#precision) / this.#precision
  }

  canadianToUs(canadian) {
    return this[Symbol.roundTwoDecimals](canadian * this.#canadianDollar)
  }

  usToCanadian(us) {
    return this[Symbol.roundTwoDecimals](us / this.#canadianDollar)
  }
}

module.exports = Currency

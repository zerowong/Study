/**
 * 定义一个属性
 * @param {object} obj
 * @param {string} key
 * @param {any} val
 * @param {boolean} enumerable
 */
export function def(obj, key, val, enumerable = false) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: enumerable,
    writable: true,
    configurable: true,
  })
}

const bailRE = /[^\w.$]/
/**
 * 解析简单路径
 * @param {string} path
 */
export function parsePath(path) {
  if (bailRE.test(path)) {
    return
  }
  const segments = path.split('.')
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) {
        return
      }
      obj = obj[segments[i]]
    }
    return obj
  }
}

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

/**
 * 用于解析html标签、组件名称和属性路径的unicode字母
 */
export const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/

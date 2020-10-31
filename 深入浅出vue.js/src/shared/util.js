// 这些帮助函数由于其明确性和函数内联，在JS引擎中能产生更好的VM代码。
export function isUndef(val) {
  return val === undefined || val === null
}

export function isDef(val) {
  return val !== undefined || val !== null
}

export function isTrue(v) {
  return v === true
}

export function isFalse(v) {
  return v === false
}

/**
 * 检查值是否是基本值
 */
export function isPrimitive(val) {
  const primitiveTypes = new Set(['number', 'string', 'symbol', 'boolean'])
  return primitiveTypes.has(typeof val)
}

/**
 * 快速对象检查 - 当我们知道值是符合JSON标准的类型时，这主要用于区分对象和基本值。
 */
export function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * 获取一个值的原始类型字符串
 */
const _toString = Object.prototype.toString

/**
 * 严格的对象类型检查。仅对普通JavaScript对象返回true
 */
export function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]'
}

/**
 * 检查该值是否为有效的数组索引
 */
export function isValidArrayIndex(val) {
  const n = parseFloat(String(val))
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/**
 * 检查对象是否具有属性
 */
export function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

/**
 * 移除数组中的一项数据
 * @param {any[]} arr
 * @param {any} item
 */
export function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * 不进行任何操作
 */
export function noop() {}

/**
 * 始终返回false
 */
export const no = () => false

/**
 * 返回相同的值
 */
export const identity = (_) => _

/**
 * 生成一个Map并返回一个函数以检查键是否在该Map中
 * @param {string} str
 * @param {boolean} expectsLowerCase
 * @returns {(val:string) => true | void}
 */
export function makeMap(str, expectsLowerCase = false) {
  const map = Object.create(null)
  const list = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase ? (val) => map[val.toLowerCase()] : (val) => map[val]
}

import { isObject } from '../util/index'
import VNode from '../vdom/vnode'

const seenObjects = new Set()

/**
 * 递归地遍历一个对象以唤起所有已转换的getter，以便将该对象内的每个嵌套属性收集为“deep”依赖项
 */
export function traverse(val) {
  _traverse(val, seenObjects)
  seenObjects.clear()
}

/**
 * @param {Set<any>} seen
 */
function _traverse(val, seen) {
  const isA = Array.isArray(val)
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    const depId = val.__ob__.dep.id
    // 防止重复收集依赖
    if (seen.has(depId)) {
      return
    }
    seen.add(depId)
  }
  let i, keys
  if (isA) {
    i = val.length
    while (i--) {
      _traverse(val[i], seen)
    }
  } else {
    keys = Object.keys(val)
    i = keys.length
    while (i--) {
      _traverse(val[keys[i]], seen)
    }
  }
}

import Dep from './dep'
import VNode from '../vdom/vnode'
import { arrayMethods } from './array'
import {
  def,
  warn,
  hasOwn,
  hasProto,
  hasSetProto,
  isObject,
  isPlainObject,
  isPrimitive,
  isUndef,
  isValidArrayIndex,
  isServerRendering,
} from '../util/index'

const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

/**
 * 在某些情况下，我们可能希望在组件的更新计算中禁用侦测
 */
export let shouldObserve = true

/**
 * @param {boolean} value
 */
export function toggleObserving(value) {
  shouldObserve = value
}

/**
 * 附加到每个观察对象的Observer类。 附加后，Observer类会将目标对象的属性键转换为收集依赖项并调度更新的getter/setter
 */
export class Observer {
  constructor(value) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      if (hasSetProto || hasProto) {
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  /**
   * 遍历所有属性并将它们转换为getter/setter。 仅当值类型为Object时才应调用此方法
   * @param {object} obj
   */
  walk(obj) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }

  /**
   * 侦测数组的每一项
   * @param {any[]} items
   */
  observeArray(items) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}

/**
 * 通过使用截取原型链来增强目标对象或数组
 * @param {object} target 目标对象
 * @param {object} src 被用作原型的对象
 */
function protoAugment(target, src) {
  if (hasSetProto) {
    Object.setPrototypeOf(target, src)
  } else if (hasProto) {
    target.__proto__ = src
  }
}

/**
 * 通过定义隐藏属性来增强目标对象或数组
 * @param {object} target 目标对象
 * @param {object} src 源对象
 * @param {string[]} keys 对象属性数组
 */
function copyAugment(target, src, keys) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}

/**
 * 尝试为某个值创建一个观察者实例，如果成功观察到该观察者，则返回新的观察者，如果该值已经具有一个观察者，则返回现有的观察者
 * @param {any} value
 * @param {boolean} asRootData
 * @returns {Observer} 观察者实例
 */
export function observe(value, asRootData = false) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}

/**
 * 定义一个响应式数据
 * @param {object} obj
 * @param {string} key
 * @param {any} val
 * @param {function} customSetter
 * @param {boolean} shallow
 */
export function defineReactive(obj, key, val, customSetter = null, shallow = false) {
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // 满足预先定义的getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set(newVal) {
      const value = getter ? getter.call(obj) : val
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      if (getter && !setter) {
        return
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    },
  })
}

/**
 * 在对象上设置属性。添加新属性，如果该属性尚不存在，则触发更改通知
 * @param {object | any[]} target
 * @param {any} key
 * @param {any} val
 */
export function set(target, key, val) {
  if (process.env.NODE_ENV !== 'production' && (isUndef(target) || isPrimitive(target))) {
    warn(`Cannot set reactive property on undefined, null, or primitive value: ${target}`)
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  const ob = target.__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' &&
      warn(
        'Avoid adding reactive properties to a Vue instance or its root $data at runtime - declare it upfront in the data option.'
      )
    return val
  }
  if (!ob) {
    target[key] = val
    return val
  }
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}

/**
 * 删除属性并在必要时触发更改
 * @param {object | any[]} target
 * @param {any} key
 */
export function del(target, key) {
  if (process.env.NODE_ENV !== 'production' && (isUndef(target) || isPrimitive(target))) {
    warn(`Cannot delete reactive property on undefined, null, or primitive value: ${target}`)
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1)
    return
  }
  const ob = target.__ob__
  if (target._isVue && ob && ob.vmCount) {
    process.env.NODE_ENV !== 'production' &&
      warn('Avoid deleting properties on a Vue instance or its root $data - just set it to null.')
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key]
  if (!ob) {
    return
  }
  ob.dep.notify()
}

/**
 * 当值为数组时，收集数组元素的依赖关系，因为我们不能像属性获取者那样拦截数组元素的访问。
 * @param {any[]} value
 */
function dependArray(value) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i]
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}

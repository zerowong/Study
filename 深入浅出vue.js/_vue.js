/**
 * 快速对象检查-当我们知道值是JSON兼容类型时，主要用于从原始值告诉对象
 */
function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * 检查该值是否为有效的数组索引
 */
function isValidArrayIndex(val) {
  const n = parseFloat(String(val))
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isUndef(val) {
  return val === undefined || val === null
}

function isDef(val) {
  return val !== undefined || val !== null
}

function isPrimitive(val) {
  const primitiveTypes = new Set(['number', 'string', 'symbol', 'boolean'])
  return primitiveTypes.has(typeof val)
}

/**
 * 检查对象是否具有属性
 */
function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

function warn(msg, vm) {}

/**
 * 尝试为某个值创建一个观察者实例，如果成功观察到该观察者，则返回新的观察者，如果该值已经具有一个观察者，则返回现有的观察者
 * @returns {Observer} 观察者实例
 */
function observe(value, asRootData) {
  if (!isObject(value)) {
    return
  }
  let ob
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else {
    ob = new Observer(value)
  }
  return ob
}

const seenObjects = new Set()

/**
 * 递归地遍历一个对象以唤起所有已转换的getter，以便将该对象内的每个嵌套属性收集为“deep”依赖项
 */
function traverse(val) {
  _traverse(val, seenObjects)
  seenObjects.clear()
}

/**
 * @param {Set<any>} seen 
 */
function _traverse(val, seen) {
  const isA = Array.isArray(val)
  if ((!isA && !isObject(val)) || Object.isFrozen(val)) {
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
  if (isA) {
    val.forEach((item) => _traverse(item, seen))
  } else {
    Object.keys(val).forEach((key) => _traverse(val[key], seen))
  }
}

/**
 * 定义一个响应式数据
 * @param {object} data
 * @param {string | number | symbol} key
 * @param {any} val
 */
function defineReactive(data, key, val) {
  let childOb = observe(val)
  let dep = new Dep()
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get() {
      dep.depend()
      if (childOb) {
        childOb.dep.depend()
      }
      return val
    },
    set(newVal) {
      if (val === newVal) {
        return
      }
      val = newVal
      dep.notify()
    },
  })
}

/**
 * 在对象上设置属性。添加新属性，如果该属性尚不存在，则触发更改通知
 */
function set(target, key, val) {
  if (isUndef(target) || isPrimitive(target)) {
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
    warn('Avoid adding reactive properties to a Vue instance or its root $data at runtime - declare it upfront in the data option.')
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
 */
function del(target, key) {
  if (isUndef(target) || isPrimitive(target)) {
    warn(`Cannot delete reactive property on undefined, null, or primitive value: ${target}`)
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1)
    return
  }
  const ob = target.__ob__
  if (target._isVue && (ob && ob.vmCount)) {
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

let uid = 0

/**
 * 依赖管理
 */
class Dep {
  constructor() {
    this.id = uid++
    this.subs = []
  }

  addSub(sub) {
    this.subs.push(sub)
  }

  removeSub(sub) {
    remove(this.subs, sub)
  }

  /**
   * 收集依赖
   */
  depend() {
    if (window.target) {
      window.target.addDep(this)
    }
  }

  notify() {
    const subs = [...this.subs]
    subs.forEach((sub) => sub.update())
  }
}

/**
 * 移除数组中的一项数据
 * @param {any[]} arr
 * @param {any} item
 */
function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * 侦听器解析表达式，收集依赖项，并在表达式值更改时触发回调。 这用于$watch()API和指令
 */
class Watcher {
  constructor(vm, expOrFn, cb, options) {
    this.vm = vm
    if (options) {
      this.deep = !!options.deep
    } else {
      this.deep = false
    }
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
    }
    this.deps = []
    this.depIds = new Set()
    this.cb = cb
    this.value = this.get()
  }

  get() {
    window.target = this
    let value = this.getter.call(this.vm, this.vm)
    if (this.deep) {
      traverse(value)
    }
    window.target = undefined
    return value
  }

  update() {
    const oldValue = this.value
    this.value = this.get()
    this.cb.call(this.vm, this.value, oldValue)
  }

  /**
   * @param {Dep} dep
   */
  addDep(dep) {
    const id = dep.id
    if (!this.depIds.has(id)) {
      this.depIds.add(id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }

  /**
   * 从所有依赖项的Dep列表中删除自己
   */
  teardown() {
    this.deps.forEach((dep) => dep.removeSub(this))
  }
}

/**
 * 解析简单路径
 * @param {string} path
 */
function parsePath(path) {
  const bailRE = /[^\w.$]/
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
 * 定义一个属性
 */
function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true,
  })
}

const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)
const methodsToPatch = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']

/**
 * 拦截数组方法并发出通知
 */
methodsToPatch.forEach(function (method) {
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator(...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'shift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) {
      ob.observeArray(inserted)
    }
    ob.dep.notify()
    return result
  })
})

const hasProto = '__proto__' in {}
const hasSetProto = 'setPrototypeOf' in Object
const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

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
  keys.forEach((key) => def(target, key, src[key]))
}

/**
 * 附加到每个观察对象的Observer类。 附加后，Observer类会将目标对象的属性键转换为收集依赖项并调度更新的getter/setter
 */
class Observer {
  constructor(value) {
    this.value = value
    this.dep = new Dep()
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
   */
  walk(obj) {
    const keys = Object.keys(obj)
    keys.forEach((key) => defineReactive(obj, key, obj[key]))
  }

  /**
   * 侦测数组的每一项
   * @param {any[]} items
   */
  observeArray(items) {
    items.forEach((item) => observe(item))
  }
}

class VNode {
  constructor(tag, data, children, text, elem, context, componentOptions, asyncFactory) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elem = elem
    this.context = context
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.ns = undefined
    this.fnContext = undefined
    this.fnOptions = undefined
    this.fnScopeId = undefined
    this.key = data && data.key
    this.parent = undefined
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    this.isComment = false
    this.isCloned = false
    this.isOnce = false
    this.isAsyncPlaceholder = false
  }

  get child() {
    return this.componentInstance
  }
}

const createEmptyNode = (text) => {
  if (text === undefined) {
    text = ''
  }
  const node = new VNode()
  node.text = text
  node.isComment = true
  return node
}

function createTextNode(val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

/**
 * 用于静态节点和插槽节点的优化浅克隆，因为它们可以在多个渲染中重复使用，克隆它们可以避免在DOM操作依赖于它们的元素引用时出错
 * @param {VNode} vnode 
 */
function cloneVNode(vnode) {
  const cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  )
  cloned.ns = vnode.ns
  cloned.isStatic = vnode.isStatic
  cloned.key = vnode.key
  cloned.isComment = vnode.isComment
  cloned.fnContext = vnode.fnContext
  cloned.fnOptions = vnode.fnOptions
  cloned.fnScopeId = vnode.fnScopeId
  cloned.asyncMeta = vnode.asyncMeta
  cloned.isCloned = true
  return cloned
}

function removeChild(node, child) {
  node.removeChild(child)
}

function parentNode(node) {
  return node.parentNode
}

const nodeOps = Object.freeze({
  removeChild,
  parentNode
})

function removeNode(el) {
  const parent = nodeOps.parentNode(el)
  if (isDef(parent)) {
    nodeOps.removeChild(parent, el)
  }
}

function removeVnodes(vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; startIdx++) {
    const ch = vnodes[startIdx]
    if (isDef(ch)) {
      // Text node
      removeNode(ch.elem)
    }
  }
}

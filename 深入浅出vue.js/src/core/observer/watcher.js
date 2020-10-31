import { pushTarget, popTarget } from './dep'
import { traverse } from './tarverse'
import { warn, remove, isObject, parsePath, handleError, noop } from '../util/index'

let uid = 0

/**
 * 侦听器解析表达式，收集依赖项，并在表达式值更改时触发回调。这用于$watch()API和指令
 */
export default class Watcher {
  /**
   * @param {Component} vm
   * @param {string | function} expOrFn
   * @param {function} cb
   * @param {object} options
   */
  constructor(vm, expOrFn, cb, options = null, isRenderWatcher = false) {
    this.vm = vm
    if (isRenderWatcher) {
      vm._watcher = this
    }
    vm._watchers.push(this)
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
      this.before = options.before
    } else {
      this.deep = this.user = this.sync = this.lazy = false
    }
    // 解析表达式为getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        process.env.NODE_ENV !== 'production' &&
          warn(
            `Failed watching path: "${expOrFn}" Watcher only accepts simple dot-delimited paths. For full control, use a function instead.`,
            vm
          )
      }
    }
    this.cb = cb
    this.id = ++uid
    this.active = true
    this.dirty = this.lazy
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepsIds = new Set()
    this.expression = process.env.NODE_ENV !== 'production' ? expOrFn.toString() : ''
    this.value = this.lazy ? undefined : this.get()
  }

  /**
   * 取getter的值，然后重新收集依赖项
   */
  get() {
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // “触碰”每个属性，以便将它们作为深度侦测的依赖项进行跟踪
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      this.cleanupDeps()
    }
    return value
  }

  /**
   * 订阅者界面，依赖项更改时将被调用
   */
  update() {
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      this.run()
    } else {
      // TODO
    }
  }

  /**
   * 向此指令添加依赖项
   * @param {Dep} dep
   */
  addDep(dep) {
    const id = dep.id
    if (!this.newDepsIds.has(id)) {
      this.newDepsIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }

  /**
   * 清理依赖项收集
   */
  cleanupDeps() {
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepsIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    // swap
    ;[this.depIds, this.newDepsIds] = [this.newDepsIds, this.depIds]
    this.newDepsIds.clear()
    ;[this.deps, this.newDeps] = [this.newDeps, this.deps]
    this.newDeps.length = 0
  }

  /**
   * 调度器的作业界面。将被调度器调用
   */
  run() {
    if (this.active) {
      const value = this.get()
      // 即使值相同，Deep Watchers和对象/数组上的Watcher也应触发，因为该值可能已突变
      if (value !== this.value || isObject(value) || this.deep) {
        const oldValue = this.value
        this.value = value
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue)
          } catch (e) {
            handleError(e, this.vm, `callback for watcher "${this.expression}"`)
          }
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }

  /**
   * 计算watcher的值。 只有lazy watcher才需要
   */
  evaluate() {
    this.value = this.get()
    this.dirty = false
  }

  /**
   * 从所有依赖项的订阅者列表中删除自己
   */
  teardown() {
    if (this.active) {
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this)
      }
      let i = this.deps.length
      while (i--) {
        this.deps[i].removeSub(this)
      }
      this.active = false
    }
  }
}

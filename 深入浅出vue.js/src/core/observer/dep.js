import { remove } from '../util/index'
import config from '../config'

let uid = 0

/**
 * 依赖管理
 */
export default class Dep {
  static target

  constructor() {
    this.id = uid++
    this.subs = []
  }

  /**
   * @param {Watcher} sub
   */
  addSub(sub) {
    this.subs.push(sub)
  }

  /**
   * @param {Watcher} sub
   */
  removeSub(sub) {
    remove(this.subs, sub)
  }

  /**
   * 收集依赖
   */
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify() {
    // 使用订阅者列表的浅克隆
    const subs = [...this.subs]
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // 如果不是异步运行，subs在调度器中没有排序，因此需要对它们进行排序，以确保它们以正确的顺序启动。
      subs.sort((a, b) => a.id - b.id)
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// 当前正在计算的目标观察者。这是全局唯一的，因为一次只能计算一个观察者。
Dep.target = null
const targetStack = []

/**
 * @param {Watcher | null} target
 */
export function pushTarget(target) {
  targetStack.push(target)
  Dep.target = target
}

export function popTarget() {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}

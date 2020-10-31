import config from '../config'
import { warn } from './debug'
import { inBrowser, inWeex } from './env'
import { pushTarget, popTarget } from '../observer/dep'

function logError(err, vm, info) {
  if (process.env.NODE_ENV !== 'production') {
    warn(`Error in ${info}: "${err.toString()}"`, vm)
  }
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err)
  } else {
    throw err
  }
}

function golbalHandleError(err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // 如果用户有意在handler中抛出原始错误，避免log两次
      if (e !== err) {
        logError(e, null, 'config.errorHandler')
      }
    }
  }
  logError(err, vm, info)
}

/**
 * @param {Error} err
 * @param {any} vm
 * @param {string} info
 */
export function handleError(err, vm, info) {
  // 在处理错误处理程序时停用deps跟踪，以避免可能的无限渲染
  pushTarget()
  try {
    if (vm) {
      let cur = vm
      while ((cur = cur.$parent)) {
        const hooks = cur.$options.errorCaptured
        if (hooks) {
          for (let i = 0; i < hooks.length; i++) {
            try {
              const capture = hooks[i].call(cur, err, vm, info) === false
              if (capture) return
            } catch (e) {
              golbalHandleError(e, cur, 'errorCaptured hook')
            }
          }
        }
      }
    }
    golbalHandleError(err, vm, info)
  } finally {
    popTarget()
  }
}

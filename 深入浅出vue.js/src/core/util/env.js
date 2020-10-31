/**
 * 是否具有__proto__属性
 */
export const hasProto = '__proto__' in {}

/**
 * 是否具有setPrototypeOf方法
 */
export const hasSetProto = 'setPrototypeOf' in Object

// 浏览器环境检测
export const inBrowser = typeof window !== 'undefined'
export const inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform

// 因为在vue-server-renderer设置VUE_ENV之前可能需要vue，所以需要进行lazy-evaled
let _isServer
export const isServerRendering = () => {
  if (_isServer === undefined) {
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // 检测vue-server-renderer的存在并避免Webpack修改process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server'
    } else {
      _isServer = false
    }
  }
  return _isServer
}

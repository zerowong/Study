export default class VNode {
  /**
   * @param {string} tag
   * @param {VNodeData} data
   * @param {VNode[]} children
   * @param {string} text
   * @param {Node} elem
   * @param {Component} context
   * @param {VNodeComponentOptions} componentOptions
   * @param {function} asyncFactory
   */
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

  /**
   * @deprecated 组件实例的别名，以便向后兼容
   * @returns {Component}
   */
  get child() {
    return this.componentInstance
  }
}

/**
 * @param {string} text
 */
export const createEmptyNode = (text) => {
  if (text === undefined) {
    text = ''
  }
  const node = new VNode()
  node.text = text
  node.isComment = true
  return node
}

/**
 * @param {string | number} val
 */
export function createTextNode(val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

/**
 * 用于静态节点和插槽节点的优化浅克隆，因为它们可以在多个渲染中重复使用，克隆它们可以避免在DOM操作依赖于它们的元素引用时出错
 * @param {VNode} vnode
 */
export function cloneVNode(vnode) {
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

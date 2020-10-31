import { no, noop, identity } from '../shared/util'
import { LIFECYCLE_HOOKS } from '../shared/constants'

export default {
  /**
   * 选项合并策略(在core/util/options中使用)
   */
  optionMergeStrategies: Object.create(null),

  /**
   * 是否禁止警告
   */
  silent: false,

  /**
   * 启动时显示生产模式提示信息?
   */
  productionTip: process.env.NODE_ENV !== 'production',

  /**
   * 是否启用devtools
   */
  devtools: process.env.NODE_ENV !== 'production',

  /**
   * 是否记录性能信息
   */
  performance: false,

  /**
   * 观察到错误时的处理方法
   */
  errorHandler: null,

  /**
   * 观察到警告时的处理方法
   */
  warnHandler: null,

  /**
   * 忽略某些自定义元素
   */
  ignoredElements: [],

  /**
   * v-on的自定义用户键别名
   */
  keyCodes: Object.create(null),

  /**
   * 检查标记是否被保留，以便不能作为组件注册。这取决于平台，可能会被覆盖
   */
  isReservedTag: no,

  /**
   * 检查一个属性是否被保留，以便它不能作为组件属性使用。这取决于平台，可能会被覆盖。
   */
  isReservedAttr: no,

  /**
   * 检查标签是否为未知元素。依赖平台
   */
  isUnknownElement: no,

  /**
   * 获取元素的命名空间
   */
  getTagNamespace: noop,

  /**
   * 解析特定平台的实际标签名称
   */
  parsePlatformTagName: identity,

  /**
   * 检查一个属性是否必须使用属性绑定，例如：平台依赖的值
   */
  mustUseProp: no,

  /**
   * 异步执行更新。打算由Vue Test Utils使用，如果设置为false，将显著降低性能
   */
  async: true,

  /**
   * 因遗留问题而暴露
   */
  _lifecycleHooks: LIFECYCLE_HOOKS,
}

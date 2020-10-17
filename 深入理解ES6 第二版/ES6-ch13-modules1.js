/* 第十三章 用模块封装代码 */

/* 
模块(Modules)：是使用不同方式加载的JS文件(与JS原先的脚本加载方式相对)
特性：
1. 模块代码自动运行在严格模式下，且无法退出
2. 在模块顶级作用域下创建的变量，不会被自动添加到全局的作用域，只会在模块顶级作用域的内部存在
3. 模块顶级作用域的 this 值为 undefined
4. 模块不允许在代码中使用 HTML 风格的注释
5. 对于需要让模块外部代码访问的内容，模块必须导出它们
6. 允许模块从其它模块导入绑定
*/

// 基本的导出。导出的函数和类必须要有名称，除非使用 default 关键字

// 导出数据
export var color = 'red';
export let name = 'zero';
export const magicNumber = 7;

// 导出函数
export function sum(a, b) {
  return a + b;
}

// 导出类
export class Rectangle {
  constructor(length, width) {
    this.length = length;
    this.width = width;
  }
}

// 私有
function privateFn() {}

// 定义一个函数...
function multiply(a, b) {
  return a * b;
}

// ...稍后导出(导出引用)
export { multiply };

export function setName(value) {
  name = value;
}

const rename = 'rename';
// 导出重命名：前者是本地名称(local name)，后者是导出名称(exported name)，导入模块必须使用导出名称
export { rename as rn };

// 默认导出：默认导出可以没有名称，一个模块只能有一个默认导出
export default 'default';
// 另一种默认导出语法，可以加上别的导出
// exprot { name as default, ... };

export const example1 = 'example1';
export const example2 = 'example2';

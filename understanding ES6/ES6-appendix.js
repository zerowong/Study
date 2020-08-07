/* 附录 */

// 识别整型：JS使用 IEEE 754 编码系统来同时表示整型和浮点两种类型，但它们的存储方式仍有差异
console.log(Number.isInteger(25));
console.log(Number.isInteger(25.0)); // 被存储为整型
console.log(Number.isInteger(25.1));

// IEEE 754 只能精确表示 -2的53次方 到 2的53次方 之间的整型数，称为‘安全范围’
console.log(Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);
let inside = Number.MAX_SAFE_INTEGER;
let outside = inside + 1;
console.log(Number.isSafeInteger(inside));
console.log(Number.isSafeInteger(outside));

// 新的数学方法：略

// Unicode 标识符：略

// 规范化的 __porto__ 属性
// 特性：1.在对象字面量中只能指定一次，指定多个会抛出错误；2.对象字面量的计算属性['__proto__'] 与 __proto__ 不等价
{
  let a = {
    name: 'a',
  };
  let b = {
    __proto__: a,
  };
  let c = {
    ['__proto__']: a,
  };
  console.log(Object.getPrototypeOf(b) === a);
  console.log(Object.getPrototypeOf(c) === a);
  b.__proto__ = c;
  console.log(Object.getPrototypeOf(b) === c);
}

// ES7(ES2016)

// 幂运算符：**。在二元运算符中优先级最高，但低于一元运算符；运算符左侧不能是除了++或--以外的任何一元运算符
{
  console.log(2 ** 10);
  console.log((-5) ** 2);
}
// Array.prototype.includes()：接受参数：1.要搜索的值；2.（可选）搜索起始位置
// 特性：1.使用 === 比较，但 NaN 被认为与自身相等；2.+0 和 -0 被认为相等
{
  let arr = [1, NaN, +0];
  console.log(arr.includes(1), arr.indexOf(1));
  console.log(arr.includes(NaN), arr.indexOf(NaN));
  console.log(arr.includes(-0), arr.indexOf(-0));
}
// 函数作用域严格模式的改动：ES2016规定如果函数的参数被进行解构或具有默认值，则在该函数内使用 'use strict' 指令是违法的

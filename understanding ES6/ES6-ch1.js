/* 第一章 块级绑定 */

// var声明：其声明的变量被提升到了作用域顶部，而初始化保留在原处
// let声明：块级作用域，没有变量提升
// const声明：声明常量，其余同let
{
  let foo = (condition) => {
    if (condition) {
      var a = 0;
      let b = 0;
      const c = 0;
      // 可访问 a(0), b(0), c(0)
    } else {
      // 可访问 a(undefined)
    }
    // 可访问 a(undefined)
  };
  foo(true);
  foo(false);
}
console.log(typeof foo);

// var 允许重复声明，let，const 禁止重复声明

// const 声明阻止修改变量绑定或变量自身值，但声明对象时不阻止对变量成员的修改
const person = {
  name: 'a',
};
person.name = 'b';

const arr = [1, 2, 3];
arr[0] = 2;

// 在 for，for-in，for-of 中，let、const 在每次迭代都创建一个新的绑定，而 var 不会

// TDZ(temporal dead zone)：暂时性死区

// IIFE(Immediately Invoked Function Expression)：立即调用(执行)函数表达式

// 在全局作用域上，var声明的变量会成为全局对象(window)的一个属性，而let，const不会
var a = 0;
let b = 0;
const c = 0;
console.log('a' in window, 'b' in window, 'c' in window);

// 最佳实践：默认情况都用 const，变量需要被修改时用 let

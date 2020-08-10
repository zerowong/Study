/* 第十七章 错误处理与调试 */

// 17.1 浏览器报告的错误：略

// 17.2 错误处理

// 17.2.1 try-catch 语句
try {
  foo();
} catch (error) {
  // messages 属性保存错误信息，所有浏览器都支持
  console.log(error.message);
}
// 1.finally 子句：无论 try 语句块里是否抛出错误，该子句都会执行。如果提供了该子句，则 catch 子句变为可选
// try 和 catch 语句块里 return 被忽略，函数只能返回2
function testFinally() {
  try {
    return 0;
  } catch (error) {
    return 1;
  } finally {
    return 2;
  }
}
console.log(testFinally());
// 2.错误类型。7中错误类型详见书或MDN
// 处理特定类型错误
function catchError(error) {
  if (error instanceof TypeError) {
    console.log(`${error.name} | ${error.message} | ${error.stack}`);
  } else if (error instanceof ReferenceError) {
    console.log(`${error.name} | ${error.message} | ${error.stack}`);
  } else {
    console.log('hi');
  }
}
try {
  let o = new 10();
} catch (error) {
  catchError(error);
}
try {
  a;
} catch (error) {
  catchError(error);
}

// 17.2.2 抛出错误：throw 后跟任意值
try {
  throw 'hi';
} catch (error) {
  console.log(error);
}
try {
  throw new Error('hi');
} catch (error) {
  if (error instanceof Error) {
    console.log(error.stack);
  }
}
// 自定义错误类型
class MyError extends Error {
  constructor(value) {
    super();
    this.name = 'MyError';
    this.message = value;
  }
}
try {
  throw new MyError('hi');
} catch (error) {
  if (error instanceof MyError) {
    console.log(error.stack);
  }
}

// 17.2.3 error 事件：任何没有通过 try-catch 处理的错误都会触发该事件
// 模拟默认错误处理，并添加列号显示
window.addEventListener('error', (event) => {
  event.preventDefault();
  console.log(
    `${event.message}\n    at ${decodeURI(event.filename)}:${event.lineno}:${event.colno}`
  );
});
foo();

/*
17.2.5 常见的错误类型
1.类型转换错误：常见于比较或流控制语句的自动类型转换。解决方案：使用 === 和 !==，流控制语句显式使用布尔值
2.数据类型错误：要使用的数据类型不符合预期，导致引用错误的属性或方法。解决方案：添加类型检测语句，基本类型值使用 typeof，对象使用 instanceof
3.通信错误：URL格式错误，资源不存在等。解决方法：使用encodeURI()或者encodeURIComponent()方法
*/

/*
17.2.6 区分致命错误和非致命错误
非致命错误：不影响用户的主要任务，只影响页面的一部分，可以恢复，重复相同操作可以消除错误。对于此类错误可以采用静默处理
致命错误：应用崩溃，影响了用户的操作，导致其它连带错误。对于此类错误应提示用户采取相关措施
*/

// 17.2.7 把错误记录到服务器：对错误日志集中分类保存到服务器中，并提供必要的信息

// 17.3 调试技术

// 17.3.1 把消息记录到控制台：console 对象的使用

// 17.3.2 把消息记录到当前页面：查看一些动态的数据

// 17.3.2 抛出错误

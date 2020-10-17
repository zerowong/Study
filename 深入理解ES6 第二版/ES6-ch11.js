/* 第十一章 Promise和异步编程 */

// JS是单线程(Single-threaded)语言，同一时刻只能执行一段代码，而Java和C++是多线程语言

// 常见的两种异步模式：1.事件模型；2.回调模式(Node.js普及)

// 作业队列(job queue)：一段代码准备被执行时，添加到作业队列中

// 事件循环(event loop)：JS引擎的一个内部处理线程，能监视代码的执行并管理作业队列

// 错误优先(error-first)：Node.js 的回调函数风格

// 回调地狱(callback hell)：嵌套过多回调函数导致代码难以理解和调试

// Promise 基础：Promise是为异步操作的结果所准备的占位符，函数可以返回一个Promise，而不必订阅一个事件或传递一个回调函数
{
  let method = function () {};
  // method 承诺会在将来某个时间点完成
  let promise = method();
}

/* 
Promise 的生命周期：
异步操作未完成：挂起态(pending state)/未决的(unsettled)
异步操作完成：已决的(settled)
完成进入两种可能状态：1.已完成(fulfilled)：Promise 的异步操作成功结束
                  2.已拒绝(rejected)：Promise 的异步操作未成功结束
*/

// then()：接受两个参数：1.成功时执行的回调函数；2.失败时执行的回调函数
// catch()：只接受失败时回调函数，相当于 then(null, callbackfn);
{
  let method = function (flag, msg) {
    return new Promise((resolve, reject) => {
      console.log(`${msg} init`);
      if (!flag) {
        reject(msg);
      }
      resolve(msg);
    });
  };
  let promise1 = method(true, 'promise1');
  promise1.then(
    (msg) => console.log(`${msg} success`),
    (msg) => console.log(`${msg} failure`)
  );
  let promise2 = method(false, 'promise2');
  promise2
    .then((msg) => console.log(`${msg} success`))
    .catch((msg) => console.log(`${msg} failure`));
}

// 创建未决的 Promise
/*
接受单个参数：一个被称为执行器(executor)的函数，包含初始化Promise的代码。
该执行器会被传递两个名为 resolve() 和 reject() 的函数作为参数。前者在执行器成功时调用，后者在执行器失败时调用
执行器会立即执行，早于源代码中在其之后的任何代码
*/
// 作用调度(job scheduling)：当 resolve() 或 reject() 在执行器内部被调用时，一个作业被添加到作业队列，以便决议(resolve)这个 Promise

{
  let promise = new Promise((resolve, reject) => {
    console.log('promise');
    resolve();
  });
  promise.then(() => {
    console.log('resolved');
  });
  console.log('hi');
}

// 创建已决的 Promise

// 使用 Promise.resolve()：接受单个参数并返回一个处于完成态的 Promise。这意味没有任何作用调度发生，并且需要向 Promise 添加完成处理函数来提取该参数
{
  let promise = Promise.resolve(1);
  promise.then((value) => {
    console.log(value);
  });
  // 拒绝处理函数永远不会执行
  promise.catch((value) => {
    console.log(-value);
  });
}

// 使用 Promise.reject()
{
  let promise = Promise.reject(2);
  promise.catch((value) => {
    console.log(value);
  });
}

// 非 Promise 的 thenable：当一个对象有一个能接受 resolve 和 reject 参数的 then() 方法，该对象就被认为是一个非 Promise 的 thenable。
// Promise.resolve() 和 Promise.reject() 都接受这种 thenable 作为参数，并创建一个新的 Promise
{
  let thenable1 = {
    then(resolve, reject) {
      resolve('thenable1');
    },
  };
  let p1 = Promise.resolve(thenable1);
  p1.then((value) => console.log(value));
  // 创建已拒绝的 Promise
  let thenable2 = {
    then(resolve, reject) {
      reject('thenable2');
    },
  };
  let p2 = Promise.resolve(thenable2);
  p2.catch((value) => console.log(value));
}

// 如果执行器抛出错误，那么 Promise 拒绝处理函数就会被调用
{
  let promise = new Promise((resolve, reject) => {
    throw new Error('Boom');
  });
  promise.catch((error) => {
    console.log(error.message);
  });
}

// 当一个 Promise 被拒绝时若没有拒绝处理函数时，就会静默失败，错误被隐瞒

// Node.js 的拒绝处理

// 浏览器的拒绝处理
{
  let rejected;
  window.addEventListener('unhandledrejection', (event) => {
    console.log(event.type);
    console.log(event.reason.message);
    console.log(rejected == event.promise);
  });
  window.addEventListener('rejectionhandled', (event) => {
    console.log(event.type);
    console.log(event.reason.message);
    console.log(rejected == event.promise);
  });
  // rejected = Promise.reject(new Error('Explosion'));
}

// Promise 的链式调用
{
  let promise = new Promise((resolve, reject) => {
    resolve('first');
  });
  promise.then((value) => console.log(value)).then(() => console.log('seconde'));
}

// 捕获错误：Promise链允许你捕获前一个 Promise 的完成或拒绝处理函数抛出的错误。为了确保正确处理错误，应该在 Promise链的尾部添加拒绝处理函数
{
  let promise = new Promise((resolve, reject) => {
    throw new Error('Error 1');
  });
  promise
    .catch((error) => {
      console.log(error.message);
      throw new Error('Error 2');
    })
    .catch((error) => console.log(error.message));
}

// 在 Promise链中返回值：从一个 Promise 传递数据到下一个 Promise
{
  let promise = new Promise((resolve, reject) => {
    resolve(10);
  });
  promise
    .then((value) => {
      console.log(value);
      return value * 2;
    })
    .then((value) => {
      console.log(value);
    });

  let promise2 = new Promise((resolve, reject) => {
    reject(-10);
  });
  promise2
    .catch((value) => {
      console.log(value);
      // 幂运算符
      return value ** 2;
    })
    .then((value) => {
      console.log(value);
    });
}

// 在 Promise链中返回 Promise
{
  let p1 = new Promise((resolve, reject) => {
    resolve(42);
  });
  let p2 = new Promise((resolve, reject) => {
    resolve(43);
  });
  p1.then((value) => {
    console.log(value);
    // 自动附加一个 Promise
    return p2;
  }).then((value) => console.log(value));
}

// 在完成/失败处理函数中创建一个新的 Promise，来推迟完成/失败处理函数的执行
{
  let p1 = new Promise((resolve, reject) => {
    resolve(-42);
  });
  p1.then((value) => {
    console.log(value);
    let p2 = new Promise((resolve, reject) => {
      resolve(-43);
    });
    return p2;
  }).then((value) => console.log(value));
}

// 相应多个 Promise
// Promise.all()：接受一个元素都是 Promise 的可迭代对象参数，返回一个 Promise，只有可迭代对象里的 Promise 都完成后，返回的 Promise 才完成。若其中的任意 Promise 被拒绝，方法返回的 Promise 会被立即拒绝，不等待其它的 Promise 结束
{
  let p1 = new Promise((resolve, reject) => {
    resolve('resolve p1');
  });
  let p2 = new Promise((resolve, reject) => {
    reject('reject p2');
  });
  let p3 = new Promise((resolve, reject) => {
    resolve('resolve p3');
  });
  let p4 = Promise.all([p1, p3]);
  p4.then((value) => {
    console.log(Array.isArray(value));
    value.forEach((v) => console.log(v));
  });
  let p5 = Promise.all([p2]);
  p5.catch((value) => {
    console.log(Array.isArray(value));
    console.log(value);
  });
}

// Promise.race()：同上，但若其中任意的 Promise 被完成，方法返回的 Promise 会被立即完成，不等待其它的 Promise
{
  let p1 = Promise.resolve('race resovle p1');
  let p2 = new Promise((resolve, reject) => {
    resolve('p2');
  });
  let p3 = new Promise((resolve, reject) => {
    resolve('p3');
  });
  let p4 = Promise.race([p1, p2, p3]);
  p4.then((value) => console.log(value));
}

// 继承 Promise
{
  class MyPromise extends Promise {
    success(resolve, reject) {
      return this.then(resolve, reject);
    }
    failure(reject) {
      return this.catch(reject);
    }
  }
  let p1 = new MyPromise((resolve, reject) => {
    resolve('MyPromise p1');
  });
  p1.success((value) => console.log(value));
}

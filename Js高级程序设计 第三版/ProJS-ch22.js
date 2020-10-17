/* 第二十二章 高级技巧 */

// 22.1 高级函数

// 22.1.1 安全的类型检测：检测是否是原生对象
{
  const isNativeJSON = (value) => {
    return Object.prototype.toString.call(value) === '[object JSON]';
  };
  console.log(isNativeJSON(JSON));
}

// 22.1.2 作用域安全的构造函数：建议用 Class
{
  const Person = function (a, b, c) {
    if (this instanceof Person) {
      this.a = a;
      this.b = b;
      this.c = c;
    } else {
      return new Person();
    }
  };
  // 不用 new 调用也不会污染全局对象
  let p = Person(1, 2, 3);
  console.log('a' in window);
}

// 22.1.3 惰性载入函数
// 方法1：
{
  let createXHR = function () {
    if (typeof XMLHttpRequest != 'undefined') {
      createXHR = function () {
        return new XMLHttpRequest();
      };
    } else if (typeof ActiveXObject != 'undefined') {
      createXHR() = function () {
        if (typeof arguments.callee.activeXstring != 'string') {
          const vers = ['MSXML2.XMLHttp.6.0', 'MSXML2.XMLHttp.3.0', 'MSXML.XMLHttp'];
          for (let i = 0, len = vers.length; i < len; ++i) {
            try {
              new ActiveXObject(vers[i]);
              arguments.callee.activeXstring = vers[i];
              break;
            } catch (ex) {}
          }
          return new ActiveXObject(arguments.callee.activeXstring);
        }
      };
    } else {
      createXHR = function () {
        throw new Error('No XHR object available');
      };
    }
    return createXHR();
  };
  const foo = createXHR();
  console.log(createXHR);
}
// 方法2：
{
  let createXHR = (function () {
    if (typeof XMLHttpRequest != 'undefined') {
      return function () {
        return new XMLHttpRequest();
      };
    } else if (typeof ActiveXObject != 'undefined') {
      return function () {
        if (typeof arguments.callee.activeXstring != 'string') {
          const vers = ['MSXML2.XMLHttp.6.0', 'MSXML2.XMLHttp.3.0', 'MSXML.XMLHttp'];
          for (let i = 0, len = vers.length; i < len; ++i) {
            try {
              new ActiveXObject(vers[i]);
              arguments.callee.activeXstring = vers[i];
              break;
            } catch (ex) {}
          }
          return new ActiveXObject(arguments.callee.activeXstring);
        }
      };
    } else {
      return function () {
        throw new Error('No XHR object available');
      };
    }
  })();
  let foo = createXHR();
  console.log(createXHR);
}

// 22.1.4 函数绑定。建议用内置的 bind()
// 一个 bind() 的简单实现
{
  let myBind = function (fn, context) {
    return function () {
      return fn.apply(context, arguments);
    };
  };
  this.bar = 'bar';
  const foo = {
    bar: 'foo',
    getBar() {
      return this.bar;
    },
  };
  console.log(foo.getBar());
  const wd = foo.getBar;
  console.log(wd());
  const boundFoo = myBind(foo.getBar, foo);
  console.log(boundFoo());
}

// 22.1.5 函数柯里化(function currying)。内置 bind() 函数也具有此能力。用于创建具有预设参数的函数
{
  const curry = function (fn) {
    const args = Array.prototype.slice.call(arguments, 1);
    return function () {
      const innerArgs = Array.prototype.slice.call(arguments);
      const finalArgs = args.concat(innerArgs);
      return fn.apply(null, finalArgs);
    };
  };
  const add = (a, b) => a + b;
  const curriedAdd = curry(add, 3);
  console.log(curriedAdd(5));
}
// 函数绑定和函数柯里化的原理都是闭包

// 22.2 防篡改对象(tamper-proof object)。ES5引入，防篡改是不可撤销的

// 22.2.1 不可扩展对象
{
  const foo = {
    name: 'foo',
  };
  Object.preventExtensions(foo);
  // 此时无法再为该对象添加属性或方法，非严格模式下会静默失败，严格模式下抛出错误
  foo.age = 21;
  console.log(foo.age); // undefined
  // 检测对象是否是可扩展
  console.log(Object.isExtensible(foo));
}

// 22.2.2 密封对象
{
  const foo = {
    name: 'foo',
  };
  Object.seal(foo);
  // 对象变为不可扩展的同时，也不能删除属性或方法，非严格模式下会静默失败，严格模式下抛出错误
  foo.age = 21;
  delete foo.name;
  console.log(foo);
  // 检测对象是否密封
  console.log(Object.isSealed(foo));
  // 密封对象同时也是不可扩展对象
  console.log(Object.isExtensible(foo));
}

// 22.2.3 冻结对象
{
  const foo = {
    name: 'foo',
  };
  Object.freeze(foo);
  // 对象变为不可扩展，密封，且不能修改属性或方法的值，非严格模式下会静默失败，严格模式下抛出错误。例外：set 函数仍然可写
  foo.age = 21;
  delete foo.name;
  foo.name = 'bar';
  console.log(foo);
  // 最高防篡改级别
  console.log(Object.isFrozen(foo));
  console.log(Object.isSealed(foo));
  console.log(Object.isExtensible(foo));
}

// 22.3 高级定时器。JS是单线程语言，设置定时器只是表示在到达指定时间时加入执行队列，如果此时进程空闲则会立即执行，否则需要更多等待

// 22.3.1 重复定时器。当使用 setInterval() 时，仅当没有该定时器的任何其它代码实例时，才将定时器添加到队列种。这导致两个问题：1.某些间隔会被跳过；2.多个定时器代码执行间隔可能比预期的小
// 解决办法是使用超时调用定时器模拟间隙调用定时器(链式调用setTimeout())
{
  let foo = 1;
  setTimeout(function () {
    if (foo < 5) {
      setTimeout(arguments.callee, 100);
    }
    console.log(foo++);
  }, 100);
}

// 22.3.2 Yieding Processes。浏览器不允许JS脚本长时间运行，如果代码运行超过特定时间或特定语句数量则停止执行
// 数组分块(array chunking)：使用定时器分割遍历数组的循环
{
  const chunk = (array, process, thisArg) => {
    setTimeout(function () {
      let item = array.shift();
      process.call(thisArg, item);
      if (array.length > 0) {
        setTimeout(arguments.callee, 100);
      }
    }, 100);
  };
  const data = [];
  for (let i = 0; i < 10; ++i) {
    data.push(Math.floor(Math.random() * 1000 + 1));
  }
  const div = document.querySelector('#status');
  let print = (item) => {
    div.innerHTML += item + '<br>';
  };
  chunk(data, print);
}

// 22.3.3 函数节流：让某些可能会高频率重复执行的代码以指定间隔执行，减小计算开销
{
  const throttle = (method, interval, thisArg) => {
    clearTimeout(method.tid);
    method.tid = setTimeout(() => {
      method.call(thisArg);
    }, interval);
  };
  const process = () => console.log('resized');
  window.onresize = () => {
    throttle(process, 1000);
  };
}

// 22.4 自定义事件。事件是一种观察者模式。观察者模式由两类对象组成：主体和观察者。主体负责发布事件，同时观察者通过订阅这些事件来观察主体，主体独立存在并正常运作即使观察者不存在，观察者知道主体并能注册事件的回调函数。例如：在DOM上，DOM是主体，你的事件处理代码是观察者
{
  // 创建自定义事件
  class MyEventTarget {
    constructor() {
      this.handlers = {};
    }
    addHandler(type, handler) {
      if (typeof this.handlers[type] == 'undefined') {
        this.handlers[type] = [];
      }
      this.handlers[type].push(handler);
    }
    fire(event) {
      if (!event.target) {
        event.target = this;
      }
      if (this.handlers[event.type] instanceof Array) {
        const handlers = this.handlers[event.type];
        for (let i = 0, len = handlers.length; i < len; ++i) {
          handlers[i](event);
        }
      }
    }
    removeHandler(type, handler) {
      if (this.handlers[type] instanceof Array) {
        const handlers = this.handlers[type];
        for (let i = 0, len = handlers.length; i < len; ++i) {
          if (handlers[i] === handler) {
            handlers.splice(i, 1);
            break;
          }
        }
      }
    }
  }

  // 使用
  const printMsg = (event) => {
    console.log(`Message Received: ${event.message}`);
  };
  const target = new MyEventTarget();
  target.addHandler('message', printMsg);
  target.fire({ type: 'message', message: 'hello world' });
  target.removeHandler('message', printMsg);
  target.fire({ type: 'message', message: 'hello world' });

  // 继承
  class Person extends MyEventTarget {
    constructor(name, age) {
      super();
      this.name = name;
      this.age = age;
    }
    say(message) {
      this.fire({ type: 'message', message });
    }
  }
  const printMsg2 = (event) => {
    console.log(`${event.target.name} says: ${event.message}`);
  };
  const p = new Person('zero', 21);
  p.addHandler('message', printMsg2);
  p.say('hi');
}

// 22.5 拖放：略

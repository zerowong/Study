/* 第三章 函数 */

// 带参数默认值的函数(位置随意)
function foo(a, b = 0, c = 0) {
  return a + b + c;
}
console.group('foo');
console.log(foo(1));
console.log(foo(1, undefined, 2));
console.log(foo(1, 2));
console.log(foo(1, 2, 3));
console.groupEnd();

// 参数默认值对 arguments 对象的影响
// ES5非严格模式
{
  let foo = function (first, second) {
    console.group('ES5非严格模式');
    console.log(first, arguments[0]);
    console.log(second, arguments[1]);
    first = 'c';
    second = 'd';
    console.log(first, arguments[0]);
    console.log(second, arguments[1]);
    console.groupEnd();
  };
  foo('a', 'b');
}
{
  let foo = function (first, second) {
    'use strict';
    console.group('ES5严格模式');
    console.log(first, arguments[0]);
    console.log(second, arguments[1]);
    first = 'c';
    second = 'd';
    console.log(first, arguments[0]);
    console.log(second, arguments[1]);
    console.groupEnd();
  };
  foo('a', 'b');
}
{
  let foo = function (first, second = 'b') {
    console.group('带参数默认值');
    console.log(arguments.length);
    console.log(first, arguments[0]);
    console.log(second, arguments[1]);
    first = 'c';
    second = 'd';
    console.log(first, arguments[0]);
    console.log(second, arguments[1]);
    console.groupEnd();
  };
  foo('a');
}

// 参数默认值表达式
{
  let dbValue = function (value) {
    return value * 2;
  };
  // 可以将前面的参数作为后面参数的默认值，反之则不行(由于TDZ)
  let foo = function (first, second = dbValue(first)) {
    return first + second;
  };
  console.log(foo(1, 1));
  console.log(foo(1));
}

// 函数参数拥有各自的作用域和TDZ，与函数体的作用域相分离，意味着参数的默认值不允许访问在函数体内部声明的变量

// 剩余参数(rest parameter)：由 ... 和一个紧跟着的具名参数指定，它是一个包含传递给函数的其余参数的数组
// 限制条件：1.函数只能有一个剩余参数，且必须在最后；2.不能用在对象字面量的 setter 属性中
// 剩余参数不影响 arguments 对象
{
  let pick = function (obj, ...keys) {
    let ret = Object.create(null);
    for (let i = 0, len = keys.length; i < len; ++i) {
      ret[keys[i]] = obj[keys[i]];
    }
    return ret;
  };
  const obj = {
    a: 1,
    b: 2,
    c: 3,
  };
  let subObj = pick(obj, 'a', 'b');
  console.log(subObj.a, subObj.b);
}

// 函数构造器同样添加了参数默认值和剩余参数功能
{
  let foo1 = new Function('first', 'second = first', 'return first + second');
  console.log(foo1(1));
  let foo2 = new Function('...args', 'return args[0]');
  console.log(foo2(1, 2));
}

// 扩展运算符：功能与剩余参数相反，将数组的各个项分割作为独立参数传递给函数
{
  let arr = [1, 2, 3, 4];
  // ES5
  console.log(Math.max.apply(Math, arr));
  // ES6
  console.log(Math.max(...arr));
  // 可以与其它参数混用
  console.log(Math.max(...arr, 5));
}

// ES6的函数的名称属性
function a() {}
let b = function () {};
let c = function d() {};
var person = {
  get firstName() {
    return 'name';
  },
  sayName() {},
};
let descriptor = Object.getOwnPropertyDescriptor(person, 'firstName');
console.group('函数的 name 属性');
// 函数名
console.log(a.name);
// 赋值变量名
console.log(b.name);
// 函数表达式自己的名称的优先级高于赋值变量名
console.log(c.name);
// 方法名
console.log(person.sayName.name);
// getter 函数带有 'get' 前缀
console.log(descriptor.get.name);
// 使用 bind() 创建的函数带有 'bound' 前缀
console.log(b.bind().name);
// 函数构造器创建的函数名为 'anonymous'
console.log(new Function().name);
console.groupEnd();

// 函数调用的双重用途

// ES5中用 new 调用和直接调用
// 函数名首字母大写表示这是一个对象的构造函数，应用 new 来调用
function Aperson(name) {
  this.name = name;
}
let person1 = new Aperson('name');
let notAPerson = Aperson('name');
// person1 为一个对象
console.log(person1);
// notAPerson 为 undefined，且在非严格模式下会给 window 对象添加属性
console.log(notAPerson, 'name' in window);

// ES5中判断函数如何被调用
function Bperson(name) {
  if (this instanceof Bperson) {
    this.name = name;
  } else {
    throw new Error('you must use new with Bperson');
  }
}
person1 = new Bperson('name');
console.log(person1);
// 抛出错误
try {
  notAPerson = Bperson('name');
} catch (error) {
  console.log('error');
}
// 可用 call() 绕过检测
notAPerson = Bperson.call(person1, 'another name');
console.log(person1);

// ES6中使用 new.target 判断
function Cperson(name) {
  // if (new.target === Cperson)
  if (typeof new.target !== 'undefined') {
    this.name = name;
  } else {
    throw new Error('you must use new with Cperson');
  }
}
person1 = new Cperson('name');
console.log(person1);
// 抛出错误
try {
  notAPerson = Cperson.call(person1, 'another name');
} catch (error) {
  console.log('error');
}

// 块级函数

// 严格模式下，ES5不允许声明块级函数，ES6则允许
(function strict() {
  'use strict';
  {
    // 具有声明提升
    console.log(typeof f);
    function f() {}
  }
  // 离开作用域后被销毁
  console.log(typeof f);
})();

// 非严格模式下，块级函数会被提升至函数或全局作用域
(function notStrict() {
  {
    console.log(typeof f);
    function f() {}
  }
  console.log(typeof f);
})();

// 箭头函数
let f1 = () => {};
let f2 = (a, b) => {
  return a + b;
};
// 只有返回语句时，可省略大括号和 return 关键字(即使不是返回语句，但只有一条执行语句时，也可省略大括号)
let f3 = (a, b) => a + b;
// 返回对象字面量时，函数体用小括号包裹
let f4 = (id) => ({ id: id, name: 'name' });
// 使用箭头函数的IIFE
let person2 = ((name) => {
  return {
    getName() {
      return name;
    },
  };
})('name');
console.log(person2.getName());

// 没有 this 绑定，this 值取决于包含它的非箭头函数(不能用apply(), call(), bind()等方法修改)
let pageHandler1 = {
  id: '123',
  init() {
    document.addEventListener(
      'click',
      function (event) {
        try {
          this.doSomeThing(event.type); // 此处的 this 实际指向 document，而 document 没有 doSomeThing，因此产生错误
        } catch (error) {
          console.log('this: document');
        }
      },
      false
    );
    // ES5 可用 bind() 解决
    // document.addEventListener(
    //   'click',
    //   function (event) {
    //     this.doSomeThing(event.type);
    //   }.bind(this),
    //   false
    // );
  },
  doSomeThing(type) {
    console.log(`Handling ${type} for ${this.id}`);
  },
};

// ES6 用箭头函数解决
let pageHandler2 = {
  id: '123',
  init() {
    document.addEventListener('click', (event) => this.doSomeThing(event.type), false);
  },
  doSomeThing(type) {
    console.log(`Handling ${type} for ${this.id}`);
  },
};

// 不能对箭头函数使用 new，因为其没有 prototype(中的[[construct]])

// 箭头函数用于数组方法的回调函数产生更简洁的语法
console.log([2, 4, 6, 1, 3].sort((a, b) => a - b));

// 箭头函数没有自己的 arguments 对象，但能访问包含它的函数的 arguments 对象，无论此后箭头函数在何处执行，该对象都可用
{
  let foo = function () {
    return () => arguments[0];
  };
  let arrowFunc = foo(5);
  console.log(arrowFunc());
}

// 箭头函数仍属于函数
{
  let foo = () => {};
  console.log(typeof foo, foo instanceof Function);
}

// 箭头函数同样能使用普通函数的方法
{
  let foo = (a, b) => a + b;
  console.log(foo.call(null, 1, 2));
  console.log(foo.apply(null, [1, 2]));
  console.log(foo.bind(null, 1, 2)());
}

// 尾调用(tail call)：指调用函数语句是另一个函数的最后语句
function doSomeThingElse() {}
function doSomeThing() {
  return doSomeThingElse(); // 尾调用
}

// 尾调用优化：在严格模式下，对满足特定条件的尾调用进行优化，主要用于递归函数

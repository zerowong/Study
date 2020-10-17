/* 迭代器和生成器 */

// 一个数组迭代器的 polyfill
{
  const createIterator = function (item) {
    let i = 0;
    return {
      next() {
        let done = i >= item.length;
        let value = !done ? item[i++] : undefined;
        return {
          value,
          done,
        };
      },
    };
  };
  let iter = createIterator([1, 2, 3]);
  console.log(iter.next());
  console.log(iter.next());
  console.log(iter.next());
  console.log(iter.next());
}

// 生成器(generator)：一个返回迭代器的函数，能使用 yield 关键字，声明方式为：function*(中间可有空格)
{
  function* createIterator() {
    yield 1;
    yield 2;
    yield 3;
  }
  let iter = createIterator();
  for (let i of iter) {
    console.log(i);
  }
}

// 生成器函数会在每个 yield 语句后停止执行，yield 后跟值或表达式
{
  let createIterator = function* (item) {
    for (let i = 0, len = item.length; i < len; ++i) {
      yield item[i];
    }
  };
  let iter = createIterator([1, 2, 3]);
  console.log(iter.next());
  console.log(iter.next());
  console.log(iter.next());
  console.log(iter.next());
}

// 生成器函数也是函数，能用于所有可用函数的位置，yield 关键字只能用于生成器函数内部，在其它位置都会抛出错误，包括生成器函数内部的函数

// 生成器对象方法：方法名前加 * 号
{
  const obj = {
    *createIterator(item) {
      for (let i = 0, len = item.length; i < len; ++i) {
        yield item[i];
      }
    },
  };
  let iter = obj.createIterator([1, 2, 3]);
}

// 可迭代对象(iterable)：是包含 Symbol.iterator 属性(定义了为指定对象返回迭代器的函数)的对象。ES6中所有的集合对象(Array, Set, Map)和字符串都是可迭代对象

// for-of循环：不追踪集合索引，而是调用可迭代对象的 next() 方法，并将 value 保存在一个变量上，直到 done 为 true 时，循环停止。只能用于可迭代对象，否则抛出错误
{
  let arr = [1, 2, 3];
  for (let i of arr) {
    console.log(i);
  }
  let str = 'hello';
  for (let ch of str) {
    console.log(ch);
  }
}

// 访问默认迭代器
{
  let arr = [1, 2, 3];
  const iter = arr[Symbol.iterator]();
  console.log(iter.next());
  // 检测是否是可迭代对象
  const isIterable = (obj) => typeof obj[Symbol.iterator] === 'function';
  console.log(isIterable(new Set()));
  console.log(isIterable('hello'));
  console.log(isIterable(new WeakSet()));
}

// 创建可迭代对象
{
  const obj = {
    item: [],
    push(value) {
      this.item.push(value);
    },
    // 依然要加 * 号
    *[Symbol.iterator]() {
      for (let i of this.item) {
        yield i;
      }
    },
  };
  obj.push(1);
  obj.push(2);
  for (let i of obj) {
    console.log(i);
  }
}

// 内置集合对象的迭代器

// entries()：返回一个包含键值对的迭代器。其内容对数组为[索引，值]；对Set为[值，值]；对Map为：[键，值]
{
  let arr = ['a', 'b', 'c'];
  let set = new Set([1, 2, 3]);
  let map = new Map([
    ['a', 1],
    ['b', 2],
    ['c', 3],
  ]);
  console.group('entries');
  for (let entry of arr.entries()) {
    console.log(entry);
  }
  for (let entry of set.entries()) {
    console.log(entry);
  }
  for (let entry of map.entries()) {
    console.log(entry);
  }
  console.groupEnd();
}

// values()：返回一个包含集合中的值的迭代器
{
  let arr = ['a', 'b', 'c'];
  let set = new Set([1, 2, 3]);
  let map = new Map([
    ['a', 1],
    ['b', 2],
    ['c', 3],
  ]);
  console.group('values');
  for (let value of arr.values()) {
    console.log(value);
  }
  for (let value of set.values()) {
    console.log(value);
  }
  for (let value of map.values()) {
    console.log(value);
  }
  console.groupEnd();
}

// keys()：返回一个包含集合中的键的迭代器
{
  let arr = ['a', 'b', 'c'];
  let set = new Set([1, 2, 3]);
  let map = new Map([
    ['a', 1],
    ['b', 2],
    ['c', 3],
  ]);
  console.group('keys');
  for (let key of arr.keys()) {
    console.log(key);
  }
  for (let key of set.keys()) {
    console.log(key);
  }
  for (let key of map.keys()) {
    console.log(key);
  }
  console.groupEnd();
}

// 对集合对象使用 for-of 且没有指定迭代器时，数组和Set使用 value()作为默认迭代器，Map使用 entries()

// 对 Map 在 for-of 中使用解构
{
  let map = new Map([
    ['name', 'zero'],
    ['age', 21],
  ]);
  for (let [key, value] of map) {
    console.log(`map[${key}] = ${value}`);
  }
}

// NodeList 的迭代器：ES6为其规定了默认迭代器，行为与数组的默认迭代器一样，因此可以将 NodeList 用于 for-of及其它使用默认迭代器的场合

// 扩展运算符和可迭代对象：扩展运算符可用于所有可迭代对象，使用默认迭代器判读需要的值，将其读取出来并插入数组。使用扩展运算符是将可迭代对象转换为数组的最简单方法
{
  let arr1 = [1, 2, 3];
  let arr2 = ['a', 'b', 'c'];
  // 在数组字面量中使用扩展运算符时不限位置，不限次数的
  let arr3 = [...arr1, ...arr2];
  console.log(arr3);
  let set = new Set([1, 1, 2, 3, 3, 4]);
  let setArr = [...set];
  console.log(setArr);
  let map = new Map([
    ['name', 'zero'],
    ['age', 21],
  ]);
  let mapArr = [...map];
  console.log(mapArr);
  let str = 'hello world';
  let strArr = [...str];
  console.log(strArr);
}

// 传递参数给迭代器：给 next()方法传参时，该参数会成为生成器内部 yield 语句(指上一次生成器执行中断处的yield语句)的值(不是yield 后面跟的值)，对 next() 的首次调用是个特殊情况，会忽略参数；
{
  let createIterator = function* () {
    let first = yield 1;
    let second = yield first + 2;
    yield second + 3;
  };
  let iter = createIterator();
  console.log(iter.next(100)); // 首次调用忽略参数(没有上一次执行中断的 yield 语句)，返回了 1
  console.log(iter.next(4)); // 传入 4，上一次调用执行了第一条 yield 语句，因此 first = 4，返回 4 + 2 = 6
  console.log(iter.next(5)); // 传入 5，上一次调用执行了第二条 yield 语句，因此 second = 5, 返回 5 + 3 = 8

  // 简单记为传入的值变成上一次调用的 yield 语句的值
}

// 在迭代器中抛出错误
{
  let createIterator = function* () {
    let first = yield 1;
    let second;
    // 捕获错误
    try {
      second = yield first + 2;
    } catch (ex) {
      second = 6;
    }
    yield second + 3;
  };
  let iter = createIterator();
  console.log(iter.next());
  console.log(iter.next(4));
  // 传递一个错误对象给 throw() 方法
  console.log(iter.throw(new Error('Boom')));
}

// 生成器的 return 语句
{
  // 让生成器更早的返回(之后的语句都无法被执行)
  let createIterator = function* () {
    yield 1;
    return;
    yield 2;
    yield 3;
  };
  let iter = createIterator();
  console.log(iter.next());
  console.log(iter.next());

  // 指定返回值，用于最终返回结果的 value 字段
  createIterator = function* () {
    yield 1;
    return 100;
  };
  iter = createIterator();
  console.log(iter.next());
  console.log(iter.next());
  // 只出现一次，其后依然被重置为 undefined
  console.log(iter.next());
}

// 生成器委托
{
  const numberGen = function* () {
    yield 1;
    yield 2;
  };
  const colorGen = function* () {
    yield 'red';
    yield 'blue';
  };
  const combinedGen = function* () {
    yield* numberGen();
    yield* colorGen();
    yield true;
  };
  let iter = combinedGen();
  console.log(iter.next());
  console.log(iter.next());
  console.log(iter.next());
  console.log(iter.next());
  console.log(iter.next());
}

// 使用返回值的生成器委托
{
  const numberGen = function* () {
    yield 1;
    yield 2;
    return 3;
  };
  const repeatGen = function* (count) {
    for (let i = 0; i < count; ++i) {
      yield 'repeat';
    }
  };
  const combinedGen = function* () {
    let ret = yield* numberGen();
    yield* repeatGen(ret);
  };
  let iter = combinedGen();
  // for-of 返回 value 字段而不是结果对象
  for (let i of iter) {
    console.log(i);
  }
}

// 生成器委托字符串
{
  const gen = function* () {
    yield* 'hello';
  };
  let iter = gen();
  console.log(iter.next());
  console.log(iter.next());
  console.log(iter.next());
  console.log(iter.next());
  console.log(iter.next());
}

// 一个简单的任务运行器
{
  const run = function (taskDef) {
    // 创建迭代器
    let task = taskDef();
    // 启动任务
    let ret = task.next();
    // 递归使用函数保持对 next() 的调用
    const step = function () {
      if (!ret.done) {
        ret = task.next(ret.value);
        step();
      }
    };
    // 开始处理过程
    step();
  };
  run(function* () {
    let value = yield 1;
    console.log(value);
    value = yield value + 3;
    console.log(value);
  });
}

// 一个异步任务运行器
{
  const run = function (taskDef) {
    let task = taskDef();
    let ret = task.next();
    const step = function () {
      if (!ret.done) {
        if (typeof ret.value === 'function') {
          ret.value(function (err, data) {
            if (err) {
              ret = task.throw(err);
              return;
            }
            ret = task.next(data);
            step();
          });
        } else {
          ret = task.next(ret.value);
          step();
        }
      }
    };
    step();
  };
}

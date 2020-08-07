/* 第六章 符号与符号属性 */

// 创建符号值：Symbol 没有字面量，不能 new
{
  let name = Symbol();
  const person = {};
  person[name] = 'zero';
  console.log(person[name]);
}

// 可选参数：一个 string 或 number，表示描述，没实际意义，主要用于调试。其保存在[[Description]]中，只有 toString()方法可用访问
{
  let name = Symbol('name');
  // console.log()隐式调用了 toString()
  console.log(name, typeof name);
}

// 使用符号值：能在任何需要计算字面量属性的地方使用符号，
{
  let firstName = Symbol('fisrt name');
  const person = {
    [firstName]: 'zero',
  };
  Object.defineProperty(person, firstName, { writable: false });
  let lastName = Symbol('last name');
  Object.defineProperties(person, {
    [lastName]: {
      value: 'wong',
      writable: false,
    },
  });
  console.log(person[firstName], person[lastName]);
}

// 共享符号值：全局符号注册表
{
  let uid = Symbol.for('uid');
  let obj = {
    [uid]: '123',
  };
  let uid2 = Symbol.for('uid');
  console.log(uid === uid2);
  console.log(obj[uid], obj[uid2]);
  console.log(uid, uid2);

  // Symbol.keyFor()：根据符号值检索出对应的键值
  console.log(Symbol.keyFor(uid), Symbol.keyFor(uid2));
}

// 符号值的类型转换
{
  let foo = Symbol('foo');
  // 获取描述信息只能通过其 toString()方法或调用该方法的方法
  let desc = foo.toString();
  console.log(desc);

  // 不能转换为字符串或数值
  try {
    console.log(foo + '');
  } catch (error) {
    console.error('error');
  }
  try {
    console.log(foo / 1);
  } catch (error) {
    console.error('error');
  }

  // 可转换为Boolean，符号在逻辑运算中等价于 true
  if (foo) {
    console.log('hi');
  }
}

// 检索符号属性
{
  let foo = Symbol('foo');
  let bar = Symbol('bar');
  const obj = {
    [foo]: true,
    [bar]: true,
  };
  let symbols = Object.getOwnPropertySymbols(obj);
  console.log(symbols.length);
}

// 使用知名符号暴露内部方法

// Symbol.hasInstance：每个函数都有该方法，用于判断对象是否是本函数的一个实例，该方法定义在 Function.prototype 上，因此所有函数都继承了面对 instanceof 时的默认行为
{
  let foo = [];
  console.log(foo instanceof Array);
  // 等价于
  console.log(Array[Symbol.hasInstance](foo));

  // 其属性自身是不可写入，不可配置，不可枚举的，必须通过 Object.defineProperty() 修改，重写该属性可以理解为重载了 instanceof 运算符
  const SpecialNumber = {};
  Object.defineProperty(SpecialNumber, Symbol.hasInstance, {
    value: (v) => {
      return v instanceof Number && v > 0 && v <= 100;
    },
  });
  let zero = new Number(0),
    one = new Number(1);
  console.log(one instanceof SpecialNumber);
  console.log(zero instanceof SpecialNumber);
}

// Symbol.isConcatSpreadable：是一个Boolean类型的属性，表示目标对象用于length属性与数值类型的键，并且数值类型所对应的属性值在参与 concat() 调用时需要被分离成个体。用它定义任意类型的对象，使其在参与 concat() 调用时表现地跟数组一样
{
  let foo = {
    0: 'hello',
    1: 'world',
    length: 2,
    [Symbol.isConcatSpreadable]: true,
  };
  let bar = ['hi'].concat(foo);
  console.log(bar);
}

// Symbol.match, Symbol.replace, Symbol.search, Symbol.split：在对象上定义以上属性，创建能够进行模式匹配的对象，并在任何使用正则表达式的方法中使用该对象
{
  // 等价于/^.{10}$/
  let reg = /^.{10}$/;
  let hasLengthOf10 = {
    [Symbol.match]: (value) => {
      return value.length === 10 ? [value.substring(0, 10)] : null;
    },
    [Symbol.replace]: (value, replacement) => {
      return value.length === 10 ? replacement + value.substring(10) : value;
    },
    [Symbol.search]: (value) => {
      return value.length === 10 ? 0 : -1;
    },
    [Symbol.split]: (value) => {
      return value.length === 10 ? [', '] : [value];
    },
  };
  let msg = 'a'.repeat(10);
  console.log(msg.match(hasLengthOf10));
  console.log(msg.match(reg));
  console.log(msg.replace(hasLengthOf10, 'foo'));
  console.log(msg.replace(reg, 'foo'));
  console.log(msg.search(hasLengthOf10));
  console.log(msg.search(reg));
  console.log(msg.split(hasLengthOf10));
  console.log(msg.split(reg));
}

// Symbol.toPrimitive：改变默认的转换为基本值的行为
{
  function Temperature(degrees) {
    this.degress = degrees;
  }
  Temperature.prototype[Symbol.toPrimitive] = function (hint) {
    switch (hint) {
      case 'string':
        return this.degrees + '\u00b0';
      case 'number':
        return this.degrees;
      case 'default':
        return this.degrees + 'degrees';
    }
  };
  let freezing = new Temperature(32);
  console.log(freezing + '!');
  console.log(freezing / 2);
  console.log(String(freezing));
}

// Symbol.toStringTag：定义 Object.prototype.toString().call()被调用时应该返回什么值
{
  function Person(name) {
    this.name = name;
  }
  Person.prototype[Symbol.toStringTag] = 'Person';
  Person.prototype.toString = function () {
    return this.name;
  };
  let me = new Person('zero');
  console.log(me.toString());
  console.log(Object.prototype.toString.call(me));
}

// Symbol.unscopables：指定那些属性不允许在 with 语句内被绑定

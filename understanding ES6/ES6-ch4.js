/* 第四章 扩展的对象功能 */

// 属性简写：属性名和变量名相同时，可省略冒号和值
// 方法简写(concise method syntax)：省略冒号和 function 关键字，且方法简写能使用 super
function createPerson(name, age) {
  return {
    name, // name: name -> name
    age, // age: age -> age

    // sayName: function () -> sayName()
    sayName() {
      console.log(this.name);
    },
  };
}

// 需计算属性名
let suffix = 'name';
const obj1 = {
  ['first' + suffix]: 'zero',
  ['last' + suffix]: 'wong',
};
console.log(obj1['first' + suffix], obj1['last' + suffix]);

// Object.is()：弥补严格相等运算符的一些缺陷
console.log(+0 === -0, Object.is(+0, -0));
console.log(NaN === NaN, Object.is(NaN, NaN));

// 混入(Mixin)：一个对象从另一个对象接收属性和方法

// Object.assign()：参数为一个接收对象和任意给供应对象，前面的供应对象的属性会被后面的供应对象的同名属性覆盖，此外，供应对象的访问器属性会变成接收对象的数据属性
const receiver = {};
const supplier1 = {
  a: 1,
  b: 2,
};
const supplier2 = {
  a: 2,
  get foo() {
    return 1;
  },
};
Object.assign(receiver, supplier1, supplier2);
console.log(receiver);

// ES6移除了对象字面量的重复属性的检查，如有重复，后面的会覆盖前面的
const obj2 = {
  name: 'a',
  name: 'b',
};
console.log(obj2.name);

// 自有属性的枚举顺序：ES6规定：数字类型键按升序排序(优先级最高)，字符串和符号类型键按添加顺序排序
const obj3 = {
  a: 0,
  3: 0,
  c: 0,
  2: 0,
  b: 0,
  1: 0,
  e() {},
};
obj3.d = 0;
console.log(Object.getOwnPropertyNames(obj3).join(''));
console.log(Object.keys(obj3).join(''));

// 改变对象原型方法：Object.setPrototypeOf()：参数为：1.需要被修改原型的对象；2.将会成为前者原型的对象
const person = {
  greeting() {
    return 'hello';
  },
};
const dog = {};
let friend = Object.create(person);
console.log(Object.getPrototypeOf(friend) === person);
Object.setPrototypeOf(friend, dog);
console.log(Object.getPrototypeOf(friend) === dog);

// 使用 super 引用的简单原型访问：super 是指向当前对象原型的指针(只能用于方法简写)

friend = {
  greeting() {
    return super.greeting() + ', hi';
  },
};
Object.setPrototypeOf(friend, person);
// super 引用是非动态的，此处 super 总是指向 person，因此在多级继承中也不会导致无限递归调用
let relative = Object.create(friend);
console.log(person.greeting());
console.log(friend.greeting());
console.log(relative.greeting());

// 正式的"方法"定义：方法是一个拥有[[HomeObject]]内部属性(其指向该方法所属的对象，而 super 依赖此属性，所以 super 只能用于方法简写)的函数
const obj4 = {
  // 方法
  foo() {
    return 'foo';
  },
  // 值为函数的属性
  bar: function () {
    return 'bar';
  },
};

/* 第九章 JS中的类 */

// 类声明
{
  class Person {
    constructor(name) {
      this.name = name;
    }
    sayName() {
      console.log(this.name);
    }
  }
  let me = new Person('zero');
  me.sayName();

  console.log(me instanceof Person);
  console.log(me instanceof Object);

  console.log(typeof Person);
  console.log(typeof Person.prototype.sayName);
}

/* 
类的特性：
1. 类声明不会被提升
2. 类声明中的所有代码都会自动运行在严格模式下，且无法退出
3. 类的所有方法都是不可枚举的
4. 类的所有方法内部都没有[[Construct]]，因此用 new 调用会抛出错误
5. 调用类构造器时不使用 new，会抛出错误
6. 在类的方法内部重写类名会抛出错误
*/

// 类表达式。类声明和类表达式都不会被提升
{
  let Person = class {
    constructor(name) {
      this.name = name;
    }
    sayName() {
      console.log(this.name);
    }
  };
  let me = new Person('zero');
  me.sayName();
}

// 具名类表达式。class 后的标识符只能在类内部使用
{
  let Person = class Person2 {
    constructor(name) {
      this.name = name;
    }
    sayName() {
      console.log(this.name);
    }
  };
  console.log(typeof Person);
  console.log(typeof Person2); // undefined
}

// 一级公民(first-class citizen)：能被当作值来使用的就称为一级公民

// 在JS中，函数是一级公民，从函数发展而来的类同样也是一级公民
{
  const createObject = function (classDef) {
    return new classDef();
  };
  let obj = createObject(
    class {
      sayHi() {
        console.log('hi');
      }
    }
  );
  obj.sayHi();
}

// 立即调用类构造器，以创建单例(Singleton)
{
  const person = new (class {
    constructor(name) {
      this.name = name;
    }
    sayName() {
      console.log(this.name);
    }
  })('zero');
  person.sayName();
}

// 访问器属性
{
  class Pos {
    privateData = new WeakMap();
    constructor(x, y) {
      this.privateData.set(this, { x, y });
    }
    get x() {
      return this.privateData.get(this).x;
    }
    get y() {
      return this.privateData.get(this).y;
    }
    set x(value) {
      if (typeof value === 'number') this.privateData.get(this).x = value;
    }
    set y(value) {
      if (typeof value === 'number') this.privateData.get(this).y = value;
    }
  }
  let pos = new Pos(2, 10);
  console.log(pos.x, pos.y);
  pos.x = 10;
  pos.y = '1';
  console.log(pos.x, pos.y);
}

// 需计算的成员名
{
  const methodName = 'sayName';
  const getterName = 'name';
  class Person {
    constructor(name) {
      this._name = name;
    }
    [methodName]() {
      console.log(this._name);
    }
    get [getterName]() {
      return this._name;
    }
  }
  let me = new Person('zero');
  me.sayName();
  console.log(me.name);
}

// 类的生成器方法
{
  class Foo {
    *createIterator() {
      yield 1;
      yield 2;
      yield 3;
    }
  }
  let bar = new Foo();
  let iter = bar.createIterator();
  console.log(iter.next());
}

// 类的默认迭代器
{
  class Foo {
    constructor(arr = []) {
      this.items = [...arr];
    }
    push(item) {
      this.items.push(item);
    }
    *[Symbol.iterator]() {
      yield* this.items.values();
    }
  }
  let bar = new Foo([1, 2, 3]);
  bar.push('4');
  for (const i of bar) {
    console.log(i);
  }
}

// 静态成员：只存在于类自身的成员，需要用类自身来访问
{
  class Person {
    constructor(name) {
      this.name = name;
    }
    static create(name) {
      return new Person(name);
    }
    static type = 'Class';
  }
  let me = Person.create('zero');
  console.log(Person.type);
}

// 使用派生类(derived classes)进行继承
{
  class Rectangle {
    constructor(length, width) {
      this.length = length;
      this.width = width;
    }
    area() {
      return this.length * this.width;
    }
  }

  // 派生类如果不定义构造器，则 super() 方法被自动调用，并使用创建新实例时提供的所有参数
  class Square extends Rectangle {
    constructor(length) {
      // super()：调用基类构造器
      super(length, length);
    }
  }
  let square = new Square(3);
  console.log(square.area());
  console.log(square instanceof Square, square instanceof Rectangle);
  /* 
  使用 super() 需注意：
  1. 只能在派生类中使用 super()
  2. 在构造器中，必须在访问 this 之前调用 super()
  3. 唯一能避免调用 super() 的方法，是从类构造器中返回一个对象
  */
}

// 屏蔽类方法：派生类中的方法会屏蔽基类的同名方法
{
  class Rectangle {
    constructor(length, width) {
      this.length = length;
      this.width = width;
    }
    area() {
      return this.length * this.width;
    }
  }

  class Square extends Rectangle {
    constructor(length) {
      super(length, length);
    }
    area() {
      // super 指向基类，即 Rectangle
      return super.area();
    }
  }
}

// 继承静态成员
{
  class Rectangle {
    constructor(length, width) {
      this.length = length;
      this.width = width;
    }
    area() {
      return this.length * this.width;
    }
    static create(length, width) {
      return new Rectangle(length, width);
    }
  }

  class Square extends Rectangle {
    constructor(length) {
      super(length, length);
    }
  }
  let square = Square.create(3, 4);
  console.log(square instanceof Square, square instanceof Rectangle);
}

// 从表达式中派生类：只要一个表达式能够返回一个具有[[Construct]]属性及原型的函数，就可以 extends
{
  function class1(id) {
    this.id = id;
  }
  class class2 {
    constructor(id) {
      this.id = id;
    }
  }
  let getBase = (flag = false) => {
    if (flag) {
      return class1;
    }
    return class2;
  };
  class class3 extends getBase(true) {
    constructor(id) {
      super(id);
    }
  }
  class class4 extends getBase() {
    constructor(id) {
      super(id);
    }
  }
  let a = new class3(1);
  let b = new class4(1);
  console.log(a instanceof class1);
  console.log(b instanceof class2);
}

// 继承内置对象
{
  class MyArrray extends Array {}
  let foo = new MyArrray();
  console.log(foo instanceof MyArrray, foo instanceof Array);
}

// 任意能返回内置对象实例的方法，在派生类上却自动返回派生类的实例
{
  class MyArrray extends Array {}
  let items = new MyArrray(1, 2, 3, 4);
  let subItems = items.slice(1, 3);
  console.log(subItems instanceof MyArrray, subItems instanceof Array);
}

// Symbol.species：用于定义一个能返回函数的静态访问器属性，每当类实例的方法(构造器除外)必须创建一个实例时，前面返回的函数就被用为新实例的构造器
{
  class MyClass {
    static get [Symbol.species]() {
      return this;
    }
    constructor(value) {
      this.value = value;
    }
    clone() {
      // 此处 this.constructor[Symbol.species] 返回类本身
      return new this.constructor[Symbol.species](this.value);
    }
  }
  class Foo extends MyClass {}
  class Bar extends MyClass {
    static get [Symbol.species]() {
      return MyClass;
    }
  }
  let foo = new Foo('foo');
  let fooClone = foo.clone();
  let bar = new Bar('bar');
  let barClone = bar.clone();

  console.log(fooClone instanceof MyClass);
  console.log(fooClone instanceof Foo);
  console.log(barClone instanceof MyClass);
  console.log(barClone instanceof Bar); // false

  class MyArray extends Array {
    static get [Symbol.species]() {
      return Array;
    }
  }
  let myarr = new MyArray(1, 2, 3);
  let submyarr = myarr.slice(0, 2);
  console.log(submyarr instanceof MyArray, submyarr instanceof Array);
}

// 使用 new.target 定义抽象基类
{
  class Shape {
    constructor() {
      if (new.target === Shape) {
        throw new Error('This Class cannot be instantiated directly');
      }
    }
  }
  class Square extends Shape {
    constructor(length) {
      super();
      this.length = length;
    }
  }
  try {
    let x = new Shape();
  } catch (ex) {
    console.error('Error');
  }
  let y = new Square(3);
  console.log(y instanceof Shape);
}

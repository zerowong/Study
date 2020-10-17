/* 理解对象：对象为无序属性的集合 */
// 早期方法
var person = new Object();
person.name = 'zero';
person.age = 21;
person.job = 'none';
person.sayName = function () {
    console.log(this.name);
};

// 对象字面量方法
var person1 = {
    name: 'zero',
    age: 21,
    job: 'none',
    sayName: function () {
        console.log(this.name);
    },
};

/* 对象属性类型 */
/* 修改属性默认的特性的方法：Object.defineProperty()，接受3个参数：属性所在对象，属性名，描述符(一个或多个属性特性)，不指定描述符时默认为false */

/* 数据属性 */
// [[Configurable]]：表示能否通过delet删除属性从而重新定义属性，能否修改属性特性，能否修改属性为访问器属性，默认为true
// 注意：一旦把属性定义为不可配置的，就不能把它改回可配置，此时在调用Object.defineProperty()方法修改除Writable之外的特性都会导致错误
Object.defineProperty(person1, 'name', {
    configurable: false,
});
delete person1.name;
console.log(person1.name);
// [[Enumerable]]：表示能否通过for-in枚举对象属性，默认为true
for (let i in person1) {
    console.log(i + ' : ' + person1[i]);
}
// [[Writable]]：表示能否修改属性的值，默认为true
Object.defineProperty(person1, 'age', {
    writable: false,
});
person1.age = 0;
console.log(person1.age);
// [[Value]]：属性的值，默认为undefined

/* 访问器属性：不包含数据值，但有一对getter和setter函数(皆为非必需），getter用于读取，setter用于写入 */
// [[Configurable]], [[Enumerable]]：同上
// [[Get]]：在读取属性时调用的函数，默认为undefined
// [[Set]]：在写入属性时调用的函数，默认为undefined
// 访问器属性不能直接定义，必须通过Object.defineProperty()方法定义
var book = {
    _year: 2004, // 下划线为常用记号，表私有
    edition: 1,
};
// 此处第二个参数不能为'_year'，准确说是不能与对象属性名相同
Object.defineProperty(book, 'year', {
    get: function () {
        return this._year;
    },
    set: function (newValue) {
        if (newValue > 2004) {
            this._year = newValue;
            this.edition += newValue - 2004;
        }
    },
});
book.year = 2005; // 属性名须与属性定义方法的第二个参数匹配，用book._year也能修改属性值，但不进入set函数
console.log(book.edition);
console.log(book);

/* 定义多个属性 */
var book1 = {};
// 此方法定义的属性特性默认为false
Object.defineProperties(book1, {
    _year: {
        value: 2004,
        writable: true,
    },
    edition: {
        value: 1,
        writable: true,
    },
    year: {
        get: function () {
            return this._year;
        },
        set: function (newValue) {
            if (newValue > 2004) {
                console.log('hi');
                this._year = newValue;
                this.edition += newValue - 2004;
            }
        },
    },
});
book1.year = 2005;
console.log(book1);
// 读取属性特性的方法
var descriptor = Object.getOwnPropertyDescriptor(book1, '_year');
console.log(descriptor.value);
console.log(descriptor.writable);
console.log(descriptor.configurable);
console.log(descriptor.enumerable);
console.log(descriptor.get);
descriptor = Object.getOwnPropertyDescriptor(book1, 'year');
console.log(descriptor.value);
console.log(descriptor.get);

/* 创建对象 */
/* 工厂模式 */
function createPerson(name, age, job) {
    let o = {};
    o.name = name;
    o.age = age;
    o.job = job;
    o.sayName = function () {
        console.log(this.name);
    };
    return o;
}
var person2 = createPerson('zero', 21, 'none');
console.log(person2);

/* 构造函数模式 */
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function () {
        console.log(this.name);
    };
}
var person3 = new Person('zero', 21, 'none');
console.log(person3);
console.log(person3.constructor == Person);
console.log(person3 instanceof Object);
console.log(person3 instanceof Person);

// 构造函数作为普通函数调用
Person('zero', 21, 'none');
console.log(window.name);
// 在另一个对象的作用域中调用
var o = new Object();
Person.call(o, 'zero', 21, 'none');
console.log(o);
console.log(o instanceof Person);
// 构造函数模式的问题：每个方法都要在每个实例上重新创建一遍，而且，不同实例的同名函数是不相等的，使对象共用一个全局函数可解决此问题，但会导致大量全局函数，从而失去封装性
var person4 = new Person('zero', 21, 'none');
console.log(person3.sayName == person4.sayName);

/* 原型模式 */
function PersonOfPrototype() {
    PersonOfPrototype.prototype.name = 'zero';
    PersonOfPrototype.prototype.age = 21;
    PersonOfPrototype.prototype.job = 'none';
    PersonOfPrototype.prototype.sayName = function () {
        console.log(this.name);
    };
}
var person5 = new PersonOfPrototype();
var person6 = new PersonOfPrototype();
console.log(person5);
console.log(person5.sayName == person6.sayName);
// 原型对象的isPrototypeOf()方法
console.log(PersonOfPrototype.prototype.isPrototypeOf(person5));
// 取对象原型方法：Object.getPrototypeOf()
console.log(Object.getPrototypeOf(person5) == PersonOfPrototype.prototype);
// 多个对象实例共享原型所保存的属性和方法的基本原理：当读取某个对象的属性时，首先搜索对象实例，找到则返回属性值，否则就继续搜索指针所指向的原型，有同名属性时返回属性值
// 在实例中添加修改属性不影响原型，而且添加与原型中的一个属性同名的属性时，会屏蔽原型属性
person5.name = 'wong';
console.log(person5.name);
console.log(person6.name);
delete person5.name;
console.log(person5.name);
// hasOwnProperty()方法检测是否是实例属性
console.log(person5.hasOwnProperty('name'));
person5.name = 'wong';
console.log(person5.hasOwnProperty('name'));
delete person5.name;

/* 原型与 in 操作符 */
// 单独使用in：只要有该对象就返回true，不管是在实例还是在原型中
console.log('name' in person5);
// 由上可知，for-in中可枚举实例和原型的属性
person5.anotherName = 'wong';
for (let i in person5) {
    console.log(i);
}
// 取对象的可枚举的实例属性的方法：Object.keys()。这个方法接受一个对象作为参数，返回一个包含可枚举属性的字符串数组
// 通过原型调用：只包含原型属性
console.log(Object.keys(PersonOfPrototype.prototype));
// 通过实例调用：只包含实例属性
console.log(Object.keys(person5));
// 取对象的所有实例属性的方法（无论是否可枚举）：Object.getOwnPropertyNames()
console.log(Object.getOwnPropertyNames(PersonOfPrototype.prototype));
// 原型模式的另一种语法（会重写默认的prototype对象）
function anotherPersonOfPrototype() {}
anotherPersonOfPrototype.prototype = {
    fn: 'zero',
    ln: 'wong',
};
var friend = new anotherPersonOfPrototype();
console.log(friend);

/* 原型的动态性：对原型做的任何修改能够立即从实例上反映，与创建顺序无关 */
PersonOfPrototype.prototype.sayHi = function () {
    console.log('hi');
};
person5.sayHi();

/* 原生对象的原型 */
// js中原生的引用类型也采用原型模式创建
console.log(typeof Array.prototype.sort);
console.log(typeof Array.prototype.length);
// 可以给原生对象添加属性或方法
String.prototype.len = function () {
    return this.length;
};
console.log('dlfdf'.len());

/* 原型对象的问题：无法传参，各实例之间没有独立性 */
PersonOfPrototype.prototype.friend = ['a', 'b'];
person5.friend.push('c');
console.log(person5);
console.log(person6);

/* 组合使用构造函数模式和原型模式（最常用的创建对象模式） */
function aPerson(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.friend = [];
}
aPerson.prototype = {
    constructor: aPerson,
    sayName: function () {
        console.log(this.name);
    },
};
var person7 = new aPerson('a', 1, 'b');
var person8 = new aPerson('c', 2, 'd');
person7.friend.push('e');
console.log(person7.friend);
console.log(person8.friend);
console.log(person7 == person8);

/* 动态原型模式 */
function bPerson(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    if (typeof this.sayName != 'function') {
        bPerson.prototype.sayName = function () {
            console.log(this.name);
        };
    }
}
var bperson1 = new bPerson('zero', 21, 'none');
bperson1.sayName();

/* 寄生构造函数模式：函数与工厂模式一样，但使用new来实例化对象，这个模式可以在特殊的情况下为对象创建构造函数 */
function specialArray() {
    let ar = [];
    ar.push.apply(ar, arguments);
    ar.toPidedString = function () {
        return this.join('|');
    };
    return ar;
}
var colors = new specialArray('red', 'green', 'blue');
console.log(colors.toPidedString());

/* 稳妥构造函数模式：稳妥对象指没有公共属性，方法也不引用this的对象 */
function cPerson(name, age, job) {
    let o = {};

    // 可以在这里定义私有变量和函数

    // 添加方法
    o.sayName = function () {
        console.log(name);
    };
    return o;
}
var cperson1 = cPerson('zero', 21, 'none');
cperson1.sayName();
console.log(cperson1);

/* 继承：OO语言通常有两种继承方式：接口继承（只继承方法签名）、实现继承（继承实际的方法）。由于js函数没有签名，所以只有实现继承 */
/* 原型链：js中实现继承主要靠原型链来实现 */
function superType() {
    this.property = true;
}
superType.prototype.getSuperValue = function () {
    return this.property;
};
function subType() {
    this.subProperty = false;
}
// 继承
subType.prototype = new superType();
// 添加新方法
subType.prototype.getSubValue = function () {
    return this.subProperty;
};
var instance = new subType();
console.log(instance.getSuperValue());
console.log(instance.getSubValue());
// 默认原型：所有引用类型默认都继承了Object，这个继承也是通过原型链实现的，因此，所有函数的默认原型都是Object的实例
// 上面的继承关系：subType -> superType -> Object
console.log(instance);
// 原型链中实例与原型的关系
// 以下皆为true，因为原型链的关系，instance是Object、subType、superType中任何一个的实例
console.log(instance instanceof Object);
console.log(instance instanceof subType);
console.log(instance instanceof superType);
// 同上
console.log(Object.prototype.isPrototypeOf(instance));
console.log(superType.prototype.isPrototypeOf(instance));
console.log(subType.prototype.isPrototypeOf(instance));
// 重写（屏蔽）超类型中的方法。ps：必须在继承语句之后
subType.prototype.getSuperValue = function () {
    return 'test';
};
console.log(instance.getSuperValue());
// 上面只是屏蔽了超类型中的方法，用超类型的实例调用该方法时不变
var superInstance = new superType();
console.log(superInstance.getSuperValue());
// ps：原型链继承时，不能使用对象字面量创建原型方法（这样会使原型变为Object的实例）
// 原型链的问题：
// 一：子类型原型继承了超类型的实例属性，所有子类型实例共享这些属性，因此一个子类型实例修改了这些属性，其它子类型实例也同步变化；
// 二：在创建子类型的实例时，不能向超类型的构造函数传参；

/* 借用构造函数（也叫伪造对象或经典继承） */
// 0.属性独立：可以解决上述的原型链问题一
function superType1() {
    this.colors = ['red', 'green', 'blue'];
}
function subType1() {
    // 也是一种继承
    superType1.call(this);
    // superType1.apply(this);
}
var instance1 = new subType1();
var instance2 = new subType1();
instance1.colors.push('black');
// 相互独立
console.log(instance1.colors);
console.log(instance2.colors);
console.log(instance1);
console.log(instance2);
// 1.传递参数：可以解决原型链问题二
function superType2(name) {
    this.name = name;
}
function subType2(name, age) {
    superType2.call(this, name);
    this.age = age;
}
var instance3 = new subType2('zero', 21);
var instance4 = new subType2('wong', 22);
// 同样相互独立
console.log(instance3);
console.log(instance4);
// 2.借用构造函数的问题：方法都在构造函数中定义，没有函数复用性；而且，在超类型原型中定义的方法，对子类型是不可见的
superType2.prototype.sayHi = function () {
    console.log('hi');
};
// console.log(instance3.sayHi()); // error

/* 组合继承（也叫伪经典继承）（最常用的继承模式）：将原型链和借用构造函数组合起来，既通过在原型上定义方法实现函数复用，又能保证实例有自己的属性 */
function superType3(name) {
    this.name = name;
    this.colors = ['red'];
}
superType3.prototype.sayName = function () {
    console.log(this.name);
};
function subType3(name, age) {
    // 继承属性
    superType3.call(this, name);
    this.age = age;
}
// 继承方法
subType3.prototype = new superType3();
superType3.prototype.sayAge = function () {
    console.log(this.age);
};
var instance5 = new subType3('zero', 21);
var instance6 = new subType3('wong', 22);
instance5.colors.push('black');
instance5.sayName();
instance5.sayAge();
instance6.sayName();
instance6.sayAge();
console.log(instance5);
console.log(instance6);

/* 原型式继承 */
// 克罗克福德式：
function object(o) {
    function f() {}
    f.prototype = o;
    return new f();
}
// es5的规范化方法：Object.create()：第一个参数：用作新对象原型的对象；第二个参数：为新对象定义额外属性的对象
var Person1 = {
    name: '',
    friends: [],
};
var person1a = Object.create(Person1, {
    name: {
        value: 'hhh',
    },
});
person1a.friends.push('b');
var person1b = Object.create(Person1);
person1b.name = 'ggg';
person1b.friends.push('c');
console.log(Person1);
console.log(person1a);
console.log(person1b);
console.log(person1a.friends == person1b.friends);

/* 寄生式继承 */
function createAnother(o) {
    let clone = Object.create(o);
    clone.sayHi = function () {
        console.log('hi');
    };
    return clone;
}
var person1c = createAnother(Person1);
person1c.sayHi();
console.log(person1c);

/* 寄生组合式继承：结合寄生式继承和组合继承 */
function inheritPrototype(subType, superType) {
    let prototype = Object.create(superType.prototype);
    prototype.constructor = subType;
    subType.prototype = prototype;
}
function superType4(name) {
    this.name = name;
    this.colors = ['red'];
}
function subType4(name, age) {
    superType4.call(this, name);
    this.age = age;
}
inheritPrototype(subType4, superType4);
var instance7 = new subType4('zero', 21);
console.log(instance7);

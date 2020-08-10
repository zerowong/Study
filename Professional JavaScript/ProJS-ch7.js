/* 第7章 函数表达式 */

/* 1.定义函数的方法 */
// 1.1 函数声明：
function foo() {}
// 函数有一个非标准的 name 属性，值为函数名
console.log(foo.name);
// 函数声明提升：执行代码前先读取函数，意味着可以把调用函数的语句放在函数声明前面
sayHi();
function sayHi() {
    console.log('hi');
}

// 1.2 函数表达式：类似于变量赋值语句，此处将函数赋给变量，这种情况下创建的函数称为匿名函数（也称Lambda函数）
// 特性：因为 function 后面没有标识符，所以 name 属性为空串；没有声明提升；可以作为返回值
var foo1 = function () {};

/* 2.递归 */
// 2.1 函数引用
function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}
console.log(factorial(3));
var anotherFactorial = factorial;
factorial = null;
// console.log(anotherFactorial(3)); // error

// 2.2 使用 arguments.callee：指向正在执行的函数的指针
function factorial1(n) {
    if (n <= 1) return 1;
    return n * arguments.callee(n - 1);
}
anotherFactorial = factorial1;
factorial1 = null;
console.log(anotherFactorial(3));

// 2.3 严格模式不能使用 arguments.callee，使用命名函数表达式
var factorial2 = function f(n) {
    if (n <= 1) return 1;
    return n * f(n - 1);
};
anotherFactorial = factorial2;
factorial2 = null;
console.log(anotherFactorial(3));

/* 3. 闭包：指有权访问另一个函数作用域中的变量的函数 */
// 创建闭包的常用方式：在一个函数内部创建另一个函数
function createCompareFunction(propertyName) {
    // propertyprName 也可以在这里定义
    return function (obj1, obj2) {
        // 访问了外部函数变量 propertyName
        let v1 = obj1[propertyName];
        let v2 = obj2[propertyName];

        if (v1 < v2) {
            return -1;
        } else if (v1 > v2) {
            return 1;
        } else {
            return 0;
        }
    };
}
// 上述函数在返回后，其执行环境的作用域链被销毁，但活动对象仍保留在内存中，直到其内部的匿名函数被销毁，内存才会释放。因此闭包比普通函数占用更多的内存
// ptr 为内部匿名函数的引用
var ptr = createCompareFunction('name');
// 调用内部匿名函数
var ret = ptr({ name: 'a' }, { name: 'b' });
// 释放内存
ptr = null;

/* 3.1 闭包与变量 */
// 副作用：闭包只能取得包含函数中任何变量的最后一个值
function foo2() {
    var ret = [];
    // 其实此处用 let 也可以解决此问题
    for (var i = 0; i < 10; ++i) {
        ret[i] = function () {
            return i;
        };
    }
    // 解决方法：创建另一个匿名函数
    // for (var i = 0; i < 10; ++i) {
    //     // 利用了按值传递的机制
    //     ret[i] = (function (n) {
    //         return function () {
    //             return n;
    //         };
    //     })(i); // 立即执行
    // }
    return ret;
}
console.log(foo2()); // 皆为10

/* 3.2 闭包与this对象 */
// 匿名函数的执行环境具有全局性，因为其this对象通常指向window
var name = 'window';
var obj = {
    name: 'obj',
    getName: function () {
        // that = this
        return function () {
            return this.name;
            // return that.name;
        };
    },
};
console.log(obj.getName()()); // window，使用注释代码则为：obj

/* 3.3 内存泄漏 */
// IE特有问题。因为IE对js对象和DOM对象使用不同的垃圾回收机制，所以在闭包中保存了html元素，则这些元素无法被销毁
// 解决办法：消除循环引用，并在恰当时候把对html元素的引用设为 null

/* 4. 模仿块级作用域 */
// 用 let 可以更方便的解决，以下可忽略
function count(max) {
    for (var i = 0; i < max; ++i) {
        console.log(i);
    }
    console.log(i); // 可以访问 i
}
count(2);
// 用匿名函数可以模仿块级作用域（私有作用域）
// function 必须用圆括号包起来，因为函数声明后不能接圆括号，而用圆括号包含函数声明令它转化为函数表达式，其可以接圆括号
(function () {
    // 块级作用域
})();

function newCount(max) {
    (function () {
        // 因为该匿名函数为闭包，所以可以访问 max
        for (var i = 0; i < max; ++i) {
            console.log(i);
        }
    })();
    // console.log(i); // 无法访问 i
}
newCount(2);

/* 5. 私有变量 */
// 利用闭包创建访问私有变量的公有方法（特权方法）
function Obj(name) {
    var _name = name;
    this.getName = function () {
        return _name;
    };
    this.setName = function (value) {
        _name = value;
    };
}
var obj1 = new Obj('a');
console.log(obj1._id); // undefined
console.log(obj1.getName());
obj1.setName('b');
console.log(obj1.getName());

// 5.1 静态私有变量
(function () {
    // 静态私有变量
    var _name = '';
    // 构造函数（没有 var）
    Person = function (name) {
        _name = name;
    };
    // 公有方法
    Person.prototype.getName = function () {
        return _name;
    };
    Person.prototype.setName = function (name) {
        _name = name;
    };
})();
var p1 = new Person('a');
var p2 = new Person('b');
// _name 被所有实例共享，p2 覆盖了 p1 的 _name 属性
console.log(p1.getName());
console.log(p2.getName());

/* 5.2 模块模式 */
// 模块模式为单例创建私有变量和公有方法。单例指只有一个实例的对象
// 对象字面量实际上创建了单例对象
var singleton = {
    name: '',
};
// 模块模式语法：
var singletonPerson = (function (name) {
    // 私有对象
    var _name = name;
    // 公有方法
    return {
        getName: function () {
            return _name;
        },
        setName: function (value) {
            _name = value;
        },
    };
})('a');
singletonPerson.setName('b');
console.log(singletonPerson.getName());

/* 5.3 增强的模块模式 */
// 适合单例必须是某个类型的实例的情况
function customType() {
    this.value = 0;
}
var singletonPersonPlus = (function () {
    // 私有变量和函数
    var privateValue = -1;
    function privateFunc() {}
    // 创建对象
    var obj = new customType();
    // 公有属性和方法
    obj.publicProperty = 1;
    obj.publicMethod = function () {
        privateValue++;
        return privateFunc();
    };
    // 返回对象
    return obj;
})();

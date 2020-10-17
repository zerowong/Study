var data = [
    {
        name: 'a',
        age: 40,
    },
    {
        name: 'b',
        age: 21,
    },
];

function createComp(property) {
    return function (obj1, obj2) {
        var v1 = obj1[property];
        var v2 = obj2[property];
        if (v1 < v2) {
            return -1;
        } else if (v1 > v2) {
            return 1;
        } else {
            return 0;
        }
    };
}

data.sort(createComp('name'));
for (let i in data) {
    console.log(data[i]);
}
data.sort(createComp('age'));
for (let i in data) {
    console.log(data[i]);
}

function factorial(num) {
    if (num <= 0) {
        return 1;
    } else {
        return num * arguments.callee(num - 1);
    }
}

var ret = factorial(10);
console.log(ret);
var anotherFactorial = factorial;
factorial = function () {
    return 0;
};
factorial = 10;
console.log(factorial);
// ret = factorial(10);
// console.log(ret);
ret = anotherFactorial(10);
console.log(ret);

function sayColor() {
    console.log(this.color);
}
window.color = 'red';
var t = {
    color: 'blue',
};
t.sayColor = sayColor;
sayColor();
t.sayColor();

function outer() {
    inner();
}
function inner() {
    // console.log(inner.caller);
    console.log(arguments.callee.caller);
}
outer();

/* 非继承的函数方法：apply(), call() */
// 用途1：在特定的作用域中调用函数
function sum(num1, num2) {
    // ...
    return num1 + num2;
}
function callSum1(num1, num2) {
    return sum.apply(this, arguments);
    // return sum.apply(this, [num1, num2]);
}
function callSum2(num1, num2) {
    return sum.call(this, num1, num2);
}
console.log(callSum1(10, 20));
console.log(callSum2(10, 20));
// 用途2：扩充函数作用域
sayColor.call(this);
sayColor.call(window);
sayColor.call(t);
sayColor.apply(t);

/* 函数方法：bind() */
// 用途：创建一个this值(作用域)绑定到传入参数的函数实例
var objSayColor = sayColor.bind(t);
objSayColor();

/* 继承的函数方法：toString(), toLocaleString(), valueOf()*/
// 用途：返回函数代码，格式因浏览器而异(chrome显示全部，包括注释)
console.log(sum.toString());
console.log(sum.toLocaleString());
console.log(sum.valueOf());

/* 基本包装类型(特殊的引用类型)：Boolean, Number, String */
// 基本包装类型的对象只存在于代码执行的瞬间，因此不能为基本类型值添加属性和方法
var s1 = 'text';
s1.color = 'red';
console.log(s1.color); // undefined
// 对基本包装类型调用typeof都会返回object
var str = new String();
console.log(typeof str); // object
var str1 = 'dlfj';
console.log(typeof str1); // string
// 基本包装类型会转化为true
if (str) {
    console.log('test');
}
// Object构造函数根据传入值类型返回对应的基本包装类型的实例
var obj = new Object(12);
console.log(obj instanceof Number); // true
// 使用new调用基本包装类型的构造函数不同于调用同名转型函数
var value = '25';
var number = Number(value);
console.log(typeof number); // number
var obj = new Number(value);
console.log(typeof obj); // object

/* Boolean类型 */
// 重写了valueOf()和toString()
var booleanObject = new Boolean(true);
console.log(booleanObject.valueOf()); // boolean基本类型值
console.log(booleanObject.toString()); // 字符串
// 常见误解
var falseObject = new Boolean(false);
ret = falseObject && true;
console.log(ret); // 基本包装类型都会被转换位true，于它的值无关
var falseValue = false;
ret = falseValue && true;
console.log(ret);

/* Number类型 */
var numberObject = new Number(10);
// 格式化的方法(会转换为字符串)：toFixed(), toExponential(), toPrecision()
// toFixed()：指定小数位数(定点表示)，自动舍入
console.log(numberObject.toFixed(2));
console.log((10.005).toFixed(2));
// toExponential()：指数表示
console.log((10).toExponential(1));
// toPrecision()：依传入参数自动选择表示法
console.log((99).toPrecision(1));
console.log((99).toPrecision(2));
console.log((99).toPrecision(3));

/* String类型 */
var stringObject = new String('hello world');
var stringValue = 'hello world';
// length属性
console.log(stringValue.length);

/* 字符方法：charAt(), charCodeAt(), []运算符 */
// 用途：接受基于0的字符位置的参数，返回给定位置的单字符字符串(js中没有字符类型)
console.log(stringValue.charAt(1)); // 原字符
console.log(stringValue.charCodeAt(1)); // 字符编码
console.log(stringValue[1]); // 下标访问

/* 字符串操作方法 */
// concat()：字符串拼接。接受任意多个参数，返回拼接后的字符串，不改变原字符串。( + 号更常用)
ret = stringValue.concat('!', '!', '!');
console.log(ret);
console.log(stringValue);

/* 子串方法：slice(), substr(), substring() */
// silce()和substring()：第一个参数指定开始位置，第二个参数（可选）指定子串最后一个字符后面的位置
// substr()：第一个参数指定开始位置，第二个参数（可选）指定字符数
console.log(stringValue.slice(3));
console.log(stringValue.substr(3));
console.log(stringValue.substring(3));
console.log(stringValue.slice(3, 7));
console.log(stringValue.substr(3, 7));
console.log(stringValue.substring(3, 7));
// 负值情况
// slice()：将负值与字符串长度相加
console.log(stringValue.slice(-3));
console.log(stringValue.slice(3, -4)); // 3，7
console.log(stringValue.slice(-3, -4)); // 8，7 第一个参数大于第二个参数，返回空串
// substr()：第一个负参数加上长度，第二个转为0
console.log(stringValue.substr(-3));
console.log(stringValue.substr(3, -4)); // 3,0 -> 空串
console.log(stringValue.substr(-3, -4)); // 8,0 -> 空串
// substring()：负值都转为0
console.log(stringValue.substring(-3));
console.log(stringValue.substring(3, -4)); // 3, 0 -> 0, 3 该方法会将较小数作为开始位置，较大数作为结束位置
console.log(stringValue.substring(-3, -4)); // 0, 0 -> 空串

/* 子串位置方法：indexOf(), lastIndexOf() */
// 用途：查找子串位置，第一个参数为要找的字符串，第二个参数（可选）指定开始位置, 返回位置索引，没找到则返回-1
// 区别：indexOf()正向，lastIndexOf()反向
console.log(stringValue.indexOf('o'));
console.log(stringValue.lastIndexOf('o'));
console.log(stringValue.indexOf('o', 6));
console.log(stringValue.lastIndexOf('o', 6));
var pos = [];
var cur = stringValue.indexOf('l');
while (cur !== -1) {
    pos.push(cur);
    cur = stringValue.indexOf('l', cur + 1);
}
console.log(pos);

/* trim()：返回删除了给定字符串的前置和后缀空格后的字符串的副本，不改变原字符串 */
ret = '      hello world      ';
console.log('*' + ret.trim() + '*');
// 非标准方法：trimLeft(), trimRight()
console.log('*' + ret.trimLeft() + '*');
console.log('*' + ret.trimRight() + '*');

/* 大小写转换方法 */
// toLowerCase(), toUpperCase() ： 通用
// toLocaleLowerCase(), toLocaleUpperCase() ：针对地区实现
console.log(stringValue.toLowerCase());
console.log(stringValue.toLocaleLowerCase());
console.log(stringValue.toUpperCase());
console.log(stringValue.toLocaleUpperCase());

/* 模式匹配方法 (都不改变原字符串）*/
// match()：接受单个参数为正则表达式或RegExp对象，返回数组。等同于RegExp的exec()方法。
var text = 'cat, bat';
var pattern = /.at/;
var matches = text.match(pattern);
console.log(matches.index);
console.log(matches[0]);
console.log(pattern.lastIndex);
// search()：接受参数与match()方法相同，但返回第一个匹配项的索引，没找到则返回-1，正向查找
console.log(text.search(/at/));
// replace()：第一个参数同上，第二个参数为字符串或函数
// 第一个参数为字符串：只替换第一个匹配项
console.log(text.replace('at', 'ond'));
// 第一个参数为正则表达式，且指定全局（g）标记：替换所有
console.log(text.replace(/at/g, 'ond'));
// 第二个参数为字符串时可使用一些特殊字符序列
console.log(text.replace(/.at/g, 'word($1)'));
// 第二给参数为函数：该函数应接受3个参数（模式匹配项（单个或多个），模式匹配项位置，原字符串），返回字符串
function aReplace(text) {
    return text.replace(/[<>"&]/g, function (match) {
        switch (match) {
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            case '"':
                return '&quot;';
            case '&':
                return '&amp;';
        }
    });
}
console.log(aReplace('<>"&'));
// split()：第一个参数指定分隔符（字符串或正则表达式），第二个可选参数指定数组大小
// 用途：基于分隔符将字符串分成若干个子串，并将结果存入数组（即返回数组）
console.log(text.split(','));
console.log(text.split(',', 1));
console.log(text.split(/[^\,]+/));

/* 字符串比较方法：localeCompare() */
// 依字典序比较，区分大小写，在字符串参数之前返回负数，相等返回0，之后返回正数。ps：依地区实现
stringValue = 'c';
console.log(stringValue.localeCompare('a'));
console.log(stringValue.localeCompare('c'));
console.log(stringValue.localeCompare('d'));
console.log(stringValue.localeCompare('A'));
console.log(stringValue.localeCompare('C'));
console.log(stringValue.localeCompare('D'));

/* 构造方法：fromCharCode() */
// 接受若干字符编码构造字符串
console.log(String.fromCharCode(104, 101, 108, 108, 111));

/* Global对象 */
/* URI编码方法：encodeURI(), encodeURIComponent() */
// encodeURI()：主要用于整个URI，不会对本身属于URI的特殊字符进行编码
var uri = 'http://www.wrox.com/illegal value.html#start';
console.log(encodeURI(uri));
// encodeURIComponent()：主要用于URI中的某一段，对任何非标准字符编码
console.log(encodeURIComponent(uri));
// 对应解码方法：decodeURI(), decodeURIComponent()
console.log(decodeURI(encodeURI(uri)));
console.log(decodeURIComponent(encodeURIComponent(uri)));

/* eval()：接受字符串参数(必须是js代码)，解析并执行字符串 */
eval('console.log("hello world")');

/* window对象：扮演ES中的Global对象，也可以理解为全局对象 */
var color = 'red';
console.log(window.color);

/* Math对象 */
/* 一些属性 */
console.log(Math.PI);
console.log(Math.LOG10E);
console.log(Math.SQRT2);

/* min(), max() */
console.log(Math.max(1, 2, 3, 4));
console.log(Math.min(1, 2, 3, 4));
// 应用于数组
var values = [1, 2, 3, 4];
console.log(Math.max.apply(Math, values));
console.log(Math.min.apply(Math, values));

/* 舍入方法：ceil(), floor(), round() */
// ceil()：向上取整
// floor()：向下取整
// round()：四舍五入取整
console.log(Math.ceil(25.4));
console.log(Math.floor(25.4));
console.log(Math.round(25.4));

/* random() */
// 返回(0, 1)区间的浮点数
console.log(Math.random());
// 自定义范围：值 = Math.floor(Math.random() * 范围长度 + 第一个值)
// 例：[1， 10]
console.log(Math.floor(Math.random() * 10 + 1));
// 任意范围函数
function selectFrom(lower, upper) {
    let len = upper - lower + 1;
    return Math.floor(Math.random() * len + lower);
}
console.log(values[selectFrom(0, values.length - 1)]);

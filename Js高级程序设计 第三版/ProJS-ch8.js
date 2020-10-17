/* 第8章 BOM */
/* 1. window对象 */
// 1.1 全局作用域
// 在全局作用域中声明的变量、函数会变成window对象的属性、方法
var foo = 1;
function bar() {
    return this.foo;
}
console.log(foo == window.foo);
console.log(bar == window.bar);

// 全局变量不能通过 delete 操作符删除，而直接定义在 window 对象上的属性可以
var foo1 = 1;
window.bar1 = 0;
delete window.foo1; // foo1 的 [[Configurable]] 为 false，因此不能用 delete 删除
delete window.bar1;
console.log(window.foo1, window.bar1);

// 访问未声明的变量会抛出错误，但是通过查询 window 对象，可以知道某个未声明的对象是否存在
// var value = anotherValue; // Error，因为 another 未定义
var value = window.anotherValue; // not Error，因为这是一次属性查询，查询没有结果，所以值为 undefined

// 1.2 窗口关系及框架
// 每个框架都有自己的 window 对象，并且保存在 frames 集合中，可以通过索引（从0开始）或 name 属性引用框架
// top：始终指向最外层的框架，也就是浏览器窗口
// parent：始终指向当前框架的直接上层框架
// self：始终指向 window

// 1.3 窗口位置
// screenLeft：窗口相对于屏幕左边的位置
// screenTop：窗口相对于屏幕上边的位置
var leftPos = typeof window.screenLeft == 'number' ? window.screenLeft : window.screenX;
var topPos = typeof window.screenTop == 'number' ? window.screenTop : window.screenY;
console.log(leftPos, topPos);
// 移动方法（被浏览器禁用）
window.moveTo(1, 1); // 接受新位置的 x、y 坐标值
window.moveBy(1, 1); // 接受在水平和垂直方向上移动的像素数

// 1.4 窗口大小
// 实际上是页面视口（viewport）的大小
var pageWidth = window.innerWidth;
var pageHeight = window.innerHeight;
document.writeln(`${pageWidth}x${pageHeight}`);
document.writeln(`${window.outerWidth}x${window.outerHeight}`);
var w = document.documentElement.clientWidth;
var h = document.documentElement.clientHeight;
document.writeln(`${w}x${h}`);
var w1 = document.body.clientWidth;
var h1 = document.body.clientHeight;
document.writeln(`${w1}x${h1}`);
// 调整大小方法（被浏览器禁用）
window.resizeTo(800, 600); // 接受新宽度和新高度
window.resizeBy(100, 100); // 接受新窗口与原窗口的宽度和高度之差

// 1.5 导航与打开窗口
// window.open() 方法：接受4个参数：要加载的URL，窗口目标，一个特性字符串（内部不能有空格，逗号分隔），一个表示新页面是否取代浏览器历史记录中当前加载页面的布尔值，返回一个指向新窗口的引用

// 1.5.1 弹出窗口：如果传递了第二个参数但不存在，则根据特性字符串创建新窗口或新标签页，没传入第三个参数，则为默认设置，不打开新窗口，则忽略第三个参数
var url = 'http://localhost:8080';
var testWindow = window.open(url, '_blank', 'width=800,height=600,top=200,left=200,resizeable=yes');
// 利用返回的引用可以进行操作
testWindow.resizeTo(500, 500);
testWindow.moveTo(100, 100);
// 关闭窗口但不销毁引用
testWindow.close();
// 两个属性：window.closed：表示窗口是否关闭；window.opener：保存着打开它的原始窗口对象
console.log(testWindow.closed, testWindow.opener == window);
// 将 window.opener 设为 null：切断与打开它的窗口（标签页）的通信，在单独的进程中运行
testWindow.opener = null;
console.log(testWindow.opener == window);

// 1.6 间歇调用和超时调用：js 是单线程语言，但支持超时调用和间隙时间调用
// 超时调用（在指定的时间后执行代码，是否真正执行取决于系统的任务队列状态）方法：setTimeout()，接受两个参数：1：js代码字符串（不推荐）或函数；2：时间（ms），返回一个数值类型的超时调用ID
var timeoutId = setTimeout(function () {
    console.log('1s has passed');
}, 1000);
// 取消超时调用方法，在时间走完前调用则可完全取消超时调用
clearTimeout(timeoutId);

// 间歇调用（按指定时间间隔反复执行）方法：setInterval()，接受参数和返回值同上
var num = 0;
var max = 10;
var intervalId = null;
function increase() {
    console.log(num);
    if (++num == max) {
        clearInterval(intervalId);
        console.log('Done');
    }
}
// intervalId = setInterval(increase, 1000);
// 用超时调用模拟间歇调用被认为是更好的方式
var num1 = 0;
function increaseV2() {
    console.log(num1);
    if (++num1 < max) {
        setTimeout(increaseV2, 1000);
    } else {
        console.log('Done');
    }
}
// setTimeout(increaseV2, 1000);

// 1.7 系统对话框：3种方法：alert(),confirm(),prompt()，上述方法打开的对话框会使代码停止执行，关闭后恢复执行
// confirm() 返回一个布尔值：点击了 确定 则为 true，点击了 取消 则为 false
/* 
if (confirm('delete or not')) {
    alert('deleted');
} else {
    alert('canceld');
}
*/
// prompt()：生成提示输入框，接受两个参数：1：文本提示；2：输入框默认文本；点击确定返回输入文本值，否则返回 null
/* 
var ret = prompt('what is your name?');
if (ret !== null) {
    alert(`Hi ${ret}`);
}
*/
// 查找和打印对话框
// window.print();
// window.find(); // 没有，可能改了或删了

/* 2. location对象：提供了当前窗口中加载的文档有关的信息，它既是 window 对象的属性，也是 document 对象的属性 */
// 2.1 查询字符串参数
function getQueryStringArgs() {
    const qs = location.search.length ? location.search.substring(1) : '';
    const args = [];
    const items = qs.length ? qs.split('&') : [];
    const len = items.length;
    let item = null;
    let name = null;
    let value = null;
    for (let i = 0; i < len; ++i) {
        item = items[i].split('=');
        name = decodeURIComponent(item[0]);
        value = decodeURIComponent(item[1]);
        if (name.length) {
            args[name] = value;
        }
    }
    return args;
}

// 2.2 位置操作
// 2.2.1 打开新URL并产生历史记录
url = 'http://localhost:8080/test.html';
// location.assign(url);
// window.location = url;
// location.href = url;
// 修改 location 对象的其它属性都可以改变当前加载页面（除 hash 外，都会重新加载页面）

// 2.2.2 打开新URL但不产生历史记录
// location.replace(url);

// 2.2.3 刷新
// location.reload(); // 可能从缓存中加载
// location.reload(true); // 强制从服务器中加载
// 位于reload()调用后的代码可能不会执行，通常放在最后一行

/* 3. navigator对象：提供浏览器信息 */
// 3.1 检测插件
function hasPlugin(name) {
    name = name.toLowerCase();
    for (let i = 0; i < navigator.plugins.length; ++i) {
        if (navigator.plugins[i].name.toLowerCase().indexOf(name) > -1) {
            return true;
        }
    }
    return false;
}

/* screen对象：提供显示器信息 */
console.log(screen.width, screen.height, screen.colorDepth);

/* history对象 */
// go() 方法：在历史记录中任意跳转，接受整数参数或字符串参数
function a() {
    history.go(-1); // 后退一页
    history.go(1); // 前进一页
}
// 前进、后退的简写方法：
function b() {
    history.forward();
    history.back();
}
// 检测是否是打开的第一个页面的技巧
console.log(history.length == 0);

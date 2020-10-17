/* 第13章 事件 */

// 13.1 事件流：1.事件冒泡；2.事件捕获

// 13.2 事件处理程序（事件侦听器）

// 13.2.1 HTML事件处理程序
function showMessage() {
  console.log('hello world');
}

// 13.2.2 DOM0级事件处理程序
var btn1 = document.querySelector('#btn1');
btn1.onclick = function () {
  var useCount = 0;
  // this 引用的是当前元素
  console.log(this.id, this.type, useCount);
  ++useCount;
  if (useCount > 0) {
    // 删除事件
    btn1.onclick = null;
  }
};

// 13.2.3 DOM2级事件处理程序
// 添加事件方法：接受3个参数：事件名字符串；事件处理函数；一个布尔值：true：捕获阶段调用；false：冒泡阶段调用（兼容性好，最常用）
var btn2 = document.querySelector('#btn2');
var handler = function () {
  var handlerCnt = 0;
  console.log(this.id, this.type, handlerCnt);
  ++handlerCnt;
  if (handlerCnt > 0) {
    // 移除事件方法：参数同添加方法。ps：使用了匿名函数的事件无法删除，应使用命名函数
    btn2.removeEventListener('click', handler, false);
  }
};
btn2.addEventListener('click', handler, false);

// 13.3 事件对象

// 13.3.1 DOM中的事件对象：event 对象，事件处理程序执行期间出现，事件执行完后被销毁
// 示例1：利用 event.type 通过一个函数处理多个事件
var btn3 = document.querySelector('#btn3');
var clickCnt = 1;
handler = function (event) {
  switch (event.type) {
    case 'click': {
      console.log(`click x ${clickCnt}`);
      ++clickCnt;
      break;
    }
    case 'mouseover': {
      // event.target：事件的实际目标，此处等于 this，即当前元素
      event.target.style.backgroundColor = 'red';
      break;
    }
    case 'mouseout': {
      event.target.style.backgroundColor = '';
      break;
    }
  }
};
btn3.addEventListener('click', handler, false);
btn3.addEventListener('mouseover', handler, false);
btn3.addEventListener('mouseout', handler, false);
// 示例2：阻止默认行为。ps：只有 cancelable 属性为 true 的事件才能使用下列方法
var link1 = document.querySelector('#link1');
link1.onclick = function (event) {
  event.preventDefault();
};
// 示例3：取消事件的进一步捕获或冒泡。ps：只有 bubbles 属性为 true 的事件才能使用
var btn4 = document.querySelector('#btn4');
btn4.onclick = function (event) {
  console.log('clicked');
  event.stopPropagation();
};
document.body.onclick = function () {
  console.log('body clicked');
};
document.body.onclick = null;

// 13.4 事件类型

// 13.4.1 UI事件
// 确认支持：
console.log(document.implementation.hasFeature('HTMLEvents', '2.0'));
console.log(document.implementation.hasFeature('UIEvent', '3.0'));

// 1. load 事件：当页面完全加载完成后，就会触发 window 对象上面的 load 事件
// 定义方式1：在 <body> 元素上添加 onload 特性
// 定义方式2：(该事件的 event 对象只有 target 属性，值为 document)
window.addEventListener('load', function () {
  console.log('Loaded', event.target);
});
// 图像的 load 事件（event 对象的信息同上）
var img1 = document.querySelector('#img1');
img1.addEventListener('load', function () {
  console.log('img1 loaded');
});
// 使用DOM创建 <img> 元素时，先添加事件，再定义 src 属性
var div = document.createElement('div');
div.style.cssText = 'height: 250px';
var img2 = document.createElement('img');
img2.addEventListener('load', function () {
  console.log('img2 loaded');
});
img2.src = './image/example img1.jpg';
img2.style.cssText = 'height: 200px; width: 200px';
div.appendChild(img2);
document.body.appendChild(div);
// 使用 Image 对象（无法添加到DOM树）
var img3 = new Image();
img3.addEventListener('load', function () {
  console.log('img3 loaded');
});
img3.src = './image/example img1.jpg';
// 非标准方式为 script 元素添加事件，顺序随意
var script = document.createElement('script');
script.src = './src/temp.js';
script.addEventListener('load', function () {
  console.log('script loaded');
});
document.body.appendChild(script);

// 2. unload 事件：页面被完全卸载时触发
window.addEventListener('unload', function () {
  alert('unloaded');
});

// 3. resize 事件：浏览器窗口调整时触发（除了 Firefox，其它浏览器只要变化 1 像素即触发）
window.addEventListener('resize', function () {
  console.log('resized');
});

// 4. scroll 事件：混杂模式：由 body 元素的 scrollLeft 和 scrollTop 反映；标准模式：html 元素反映
const scrollDiv = document.querySelector('#scroll');
window.addEventListener('scroll', function () {
  if (document.compatMode == 'CSS1Compat') {
    scrollDiv.firstElementChild.textContent = `scrollTop: ${document.documentElement.scrollTop}`;
    scrollDiv.lastElementChild.textContent = `scrollLeft: ${document.documentElement.scrollLeft}`;
  } else {
    scrollDiv.firstElementChild.textContent = `scrollTop: ${document.body.scrollTop}`;
    scrollDiv.lastElementChild.textContent = `scrollLeft: ${document.body.scrollLeft}`;
  }
});

// 13.4.2 焦点事件
// 确认支持
console.log(document.implementation.hasFeature('FocusEvent', '3.0'));
// 示例:
const btnDiv = document.querySelector('#buttonDiv').querySelectorAll('button');
for (let i = 0, len = btnDiv.length; i < len; ++i) {
  btnDiv[i].addEventListener('focus', function () {
    this.style.backgroundColor = 'red';
  });
  btnDiv[i].addEventListener('blur', function () {
    this.style.backgroundColor = '';
  });
}
btnDiv[0].focus();

// 13.4.3 鼠标和滚轮事件
// 确认支持
console.log(document.implementation.hasFeature('MouseEvents', '2.0'));
console.log(document.implementation.hasFeature('MouseEvent', '3.0'));

// 1. 客户区坐标位置：event.clientX, event.clientY
// 2. 页面坐标位置：event.pageX, event.pageY
// 在页面没有滚动的情况下，以上属性的值对应相等
// 3. 屏幕坐标位置：event.screenX, event.screenY
const posDiv = document.querySelector('#pos');
const clientPos = posDiv.firstElementChild;
const pagePos = clientPos.nextElementSibling;
const screenPos = posDiv.lastElementChild;
window.addEventListener('mousemove', function () {
  clientPos.textContent = `客户区坐标：(${event.clientX}, ${event.clientY})`;
  pagePos.textContent = `页面坐标：(${event.pageX}, ${event.pageY})`;
  screenPos.textContent = `屏幕坐标：(${event.screenX}, ${event.screenY})`;
});

// 4. 修改建
const keyBtn = document.querySelector('#keybtn');
keyBtn.addEventListener('click', function () {
  let keys = [];
  if (event.shiftKey) keys.push('shift');
  if (event.ctrlKey) keys.push('ctrl');
  if (event.altKey) keys.push('alt');
  if (event.metaKey) keys.push('meta(win/cmd)');
  console.log(`keys: ${keys.join(', ')}`);
});

// 5. 相关元素
// mouseover：主目标为获得光标的元素，相关元素为失去光标的元素
// mouseout：相反
// 例：<div> -> <body>：div元素触发mouseout事件，相关元素为body，同时，body触发mouseover事件，相关元素为div
// 相关元素由 event.relatedTarget 表示

// 5. 鼠标按钮：对 mousedown 和 mouseup 事件，event.button 有如下3个可能值：0：鼠标左键；1：滚轮；2：鼠标右键
// 6. event.detail：对鼠标事件，detail表示在给定位置发生了多少次单击（mousedown + mouseup，中间移位则重置为0）
const mousebtn = document.querySelector('#mousebtn');
mousebtn.addEventListener('mousedown', function () {
  console.log(event.button, event.detail);
});

// 7. 鼠标滚轮事件：用户通过鼠标滚轮与页面交互时触发，事件名为：mousewheel（包含鼠标事件的所有信息 + wheelDelta：向前滚动：值为 120 的倍数；向后滚动：值为 -120 的倍数）
const wheel = document.querySelector('#wheel');
window.addEventListener('mousewheel', function () {
  wheel.textContent = `wheelDelta: ${event.wheelDelta}`;
});

// 9. 触摸设备（通常为手机）
// 不支持dblclick(双击)事件。双击会放大页面，无法改变该行为
// 单击可单击元素会触发 mousemove 事件。如果导致内容变化，则不会有附加事件，否则，依次发生 mousedown、mouseup、click 事件；单击不可单击元素不触发任何事件
// mouseover 也会触发 mouseover 和 mouseout事件
// 两个手指放在屏幕上且页面随手指移动而滚动会触发 mousewheel 和 scroll 事件

// 10. 无障碍访问

// 13.4.4 键盘与文本事件
// 有3个键盘事件：keydown：按下键盘任意键触发，按住不放重复触发；keypress（已废弃）：按下字符键触发，按住不放重复触发；keyup：释放键时触发
// 1个文本事件：textInput：在文本插入文本框之前触发

// 1. 键码：event.keyCode：值为键对应的ASCII码
const input1 = document.querySelector('#input1').children;
const inputArea = input1[0];
const keyCode = input1[1];
const charCode = input1[2];
const textInput = input1[3];
inputArea.addEventListener('keyup', function () {
  keyCode.lastElementChild.textContent = `${event.keyCode}`;
});

// 2. 字符编码：event.charCode：只有发生 keypress 事件时才包含值，值为键对应的ASCII码
inputArea.addEventListener('keypress', function () {
  charCode.lastElementChild.textContent = `${event.charCode} ${String.fromCharCode(
    event.charCode
  )}`;
});

// 2. DOM3级变化：key：按下键的对应字符；location：...
inputArea.addEventListener('keypress', function () {
  console.log(event.key, event.location);
});

// 3. textInput 事件：按下实际字符时触发
inputArea.addEventListener('textInput', function () {
  textInput.lastElementChild.textContent = `${event.data}`;
});

// 13.4.5 复合事件（输入法事件）
// compositionstart：输入法打开时触发
// compositionupdate：向输入字段插入新字符时触发
// compositionend：输入法关闭时触发
console.log(document.implementation.hasFeature('CompositionEvent', '3.0'));

const input2 = document.querySelector('#inputArea');
const log = document.querySelector('#eventLog');
const clear = document.querySelector('#clear');

clear.addEventListener('click', () => {
  log.textContent = '';
});

function logHandler(event) {
  log.textContent = log.textContent + `${event.type}: ${event.data}\n`;
}
input2.addEventListener('compositionstart', logHandler);
input2.addEventListener('compositionupdate', logHandler);
input2.addEventListener('compositionend', logHandler);

// 13.4.6 变动事件（大多已废弃）

// 13.4.7 HTML5事件

// 1. contextmenu：右键菜单事件(属于鼠标事件)
const noContextMenu = document.querySelector('#noContextMenu');
noContextMenu.addEventListener('contextmenu', (event) => {
  // 阻止默认行为
  event.preventDefault();
});
const showMyMenu = document.querySelector('#showMyMenu');
showMyMenu.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  const myMenu = document.getElementById('myMenu');
  myMenu.style.left = `${event.pageX}px`;
  myMenu.style.top = `${event.pageY}px`;
  myMenu.style.visibility = 'visible';
});
document.addEventListener('click', () => {
  document.getElementById('myMenu').style.visibility = 'hidden';
});

// 2. beforeunload：浏览器卸载页面前触发，产生一个对话框，询问你是否要离开该页面
window.addEventListener('beforeunload', (event) => {
  // 标准要求
  // event.preventDefault();
  // Chrome要求
  event.returnValue = '';
});

// 3. DOMContentLoaded：在DOM树加载完后触发（不等待图像，js文件，css的加载），这个事件始终在 load 事件之前触发
document.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOMContentLoaded');
});

// 4. readystatechange：文档加载状态变化时触发
document.addEventListener('readystatechange', (event) => {
  console.log(`readystate: ${document.readyState}`);
});

// 5. pageshow：页面显示时触发；pagehide：页面卸载时触发（在 unload 之前）。ps：作用于 document 上，但在 window 对象上添加
let showCount = 0;
window.addEventListener('pageshow', (event) => {
  ++showCount;
  console.log(showCount, event.persisted);
});
window.addEventListener('pagehide', (event) => {
  console.log(event.persisted);
});

// 6. hashchange：URL参数列表变化时触发
window.addEventListener('hashchange', (event) => {
  console.log(`old URL: ${event.oldURL} new URL: ${event.newURL}`);
  // 如不支持，可用
  // console.log(location.hash);
});

// 13.4.8 移动设备事件

// 13.4.9 触摸和手势事件

// 13.5 内存和性能

// 13.5.1 事件委托：利用事件冒泡，用一个事件处理程序管理一类事件
// 例：在 <ul> 上添加事件处理程序，而不是为每个 <li> 添加
const list1 = document.querySelector('#list1');
list1.addEventListener('click', (event) => {
  switch (event.target.id) {
    case 'print1': {
      console.log('1');
      break;
    }
    case 'print2': {
      console.log('2');
      break;
    }
    case 'print3': {
      console.log('3');
      break;
    }
  }
});

// 13.5.2 移除事件处理程序：当一个带有事件处理程序的元素被移除时，手动移除该事件，或使用事件委托；在页面被卸载前，通过 unload 事件移除所有事件

// 13.6 模拟事件：使用js代码触发事件

// 13.6.1 DOM中的事件模拟

// 1. 模拟鼠标事件
const mouseEventBtn = document.querySelector('#mouseEvent');
// 创建事件对象
const mouseEvent = document.createEvent('MouseEvent');
// 初始化事件对象（模拟鼠标单击）
mouseEvent.initMouseEvent(
  'click',
  true,
  true,
  document.defaultView,
  0,
  0,
  0,
  0,
  0,
  false,
  false,
  false,
  false,
  0,
  null
);
// 触发事件
mouseEventBtn.addEventListener('click', (event) => {
  console.log('mouseEvent clicked');
});
mouseEventBtn.dispatchEvent(mouseEvent);

// 2. 模拟键盘事件
// Firefox特有：
const keyEventEle = document.querySelector('#keyEvent');
const keyEvent = document.createEvent('KeyboardEvent');
keyEvent.initKeyboardEvent('keydown', true, true, document.defaultView, 'a', 0, 'Shift Ctrl', 0);
keyEventEle.addEventListener('keydown', (event) => {
  console.log(event.keyCode, event.code);
});
keyEventEle.dispatchEvent(keyEvent);
// 通用（无法精确模拟）：
const keyEvent2 = document.createEvent('Event');
keyEvent2.initEvent('keydown', true, true);
keyEvent2.view = document.defaultView;
keyEvent2.altKey = false;
keyEvent2.shiftKey = true;
keyEvent2.ctrlKey = false;
keyEvent2.metaKey = false;
keyEvent2.keyCode = 65;
keyEvent2.charCode = 65;
keyEventEle.dispatchEvent(keyEvent2);

// 3. 模拟其它事件

// 4. 自定义DOM事件
const customEventEle = document.querySelector('#customEvent');
const myevent = document.createEvent('CustomEvent');
myevent.initCustomEvent('myevent', true, true, 'hello world');
customEventEle.addEventListener('myevent', (event) => {
  console.log(event.detail);
});
customEventEle.dispatchEvent(myevent);

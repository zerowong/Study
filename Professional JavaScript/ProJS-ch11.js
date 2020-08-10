/* 第11章 DOM扩展 */

/* 11.1 选择符API */
// 11.1.1 querySelector()：接受一个CSS选择符，返回匹配的第一个元素，未找到则返回 null。可调用该方法的类型为 Document、Element、DocumentFragment
// 取得 body 元素
var body = document.querySelector('body');
// 取得 id 为 'hw' 的元素
var p = document.querySelector('#hw');
// 取得 class 为 'adiv' 的第一个 div 元素
var div = document.querySelector('div.div');
console.log(body.nodeName, p.nodeName, div.nodeName);

// 11.1.2 querySelectorAll()：同上，但返回一个包含所有匹配元素的特殊 NodeList（快照而非动态集合），没找到则为空
var prags = document.querySelectorAll('p');
console.log(prags.length);
document.body.appendChild(document.createElement('p'));
console.log(prags.length); // length 未变
console.log(document.querySelectorAll('p').length); // length 改变

// 11.1.3 matchesSelector()：接受CSS选择符，返回 bool 值：调用元素与选择符匹配返回true，否则返回 false。Element类型可用
// Chrome 上为 webkitMatchesSelector()
console.log(document.body.webkitMatchesSelector('body'));

/* 11.2 元素遍历 */
// 以下属性只针对元素，不包括文本节点和注释
document.childElementCount; // 子元素个数
document.firstElementChild; // 第一个元素
document.lastElementChild; // 最后一个元素
document.body.previousElementSibling; // 上一个同胞元素
document.body.nextElementSibling; // 下一个同胞元素

/* 11.3 HEML5 */
// 11.3.1 与 class 相关的扩充
// 1. getElementsByClassName()：接受一个包含一个或多个class名的字符串（不区分顺序），返回 HTMLCollection（动态）
var divs = document.getElementsByClassName('div test');
console.log(divs.length, divs instanceof NodeList, divs instanceof HTMLCollection);
// 2. classList属性：集合类型 DOMTokenList 的实例，可方便地修改类名
// HTML文档原有的类名无法删除
divs[0].classList.remove('test');
console.log(Array.from(divs[0].classList));
// 通过DOM添加的类名可以删除
divs[0].classList.add('a');
console.log(Array.from(divs[0].classList));
divs[0].classList.remove('a');
console.log(Array.from(divs[0].classList));

// 11.3.2 焦点管理
// document.activeElement：始终指向DOM中获得了焦点的元素，默认情况下，文档加载完成后，其指向 document.body，加载期间，其值为 null
// focus()：焦点移动到调用元素
// document.hasFocus()：文档是否获得了焦点
var buttons = document.querySelector('#buttons').querySelectorAll('button');
buttons[0].focus();

// 11.3.3 HTMLDocument的变化
// 1. document.readyState：三个可能值：
// loading：正在加载文档；
// interactive（可交互）：文档已被解析，"正在加载"状态结束，但是诸如图像，样式表和框架之类的子资源仍在加载；
// complete：文档和所有子资源已完成加载；
console.log(document.readyState);
// 2. document.compatMode：兼容模式，标准模式下值为：'CSS1compat'；混杂模式下：'BackCompat'
console.log(document.compatMode);
// 3. document.head：指向<head>元素
console.log(document.head.childElementCount);

// 11.3.4 字符集属性：document.charset（不建议用）、document.defaultCharset(已废弃)
// 应该用：document.characterSet
console.log(document.characterSet);

// 11.3.5 自定义数据属性：使用 data- 前缀为元素添加自定义数据属性，通过元素的 dataset 属性访问，其是 DOMStringMap的一个实例
var cdiv = document.querySelector('#cdiv');
console.log(cdiv.dataset.id, cdiv.dataset.name);
cdiv.dataset.id = '02';
console.log(cdiv.dataset.id);

// 11.3.6 插入标记
// 1. element.innerHTML：
// 读模式下：返回调用元素的所有子节点的HTML文本的字符串
var listDiv = document.querySelector('#list');
console.log(listDiv.innerHTML);
// 写模式下：解析为DOM子树，替换调用元素的所有子节点
listDiv.innerHTML = '<p>a & b</p>';
console.log(Array.from(listDiv.childNodes));
// 序列化
console.log(listDiv.innerHTML);
// 插入<script>，其中代码不会执行
listDiv.innerHTML = '<script>console.log("hi");</script>';
// 插入<style>，生效
listDiv.innerHTML =
  '<style type="text/css">body{background-color: rgb(38, 50, 63);color: white;}</style>';

// 2. element.outerHTML：包括自身，其余同 innerHTML

// 3. element.insertAdjacentHTML(pos, text)：在指定位置插入HTML字符串
/* 
  pos：
  'beforebegin'：元素自身的前面。
  'afterbegin'：插入元素内部的第一个子节点之前。
  'beforeend'：插入元素内部的最后一个子节点之后。
  'afterend'：元素自身的后面。

  text：HTML字符串
 */
p.insertAdjacentHTML('beforebegin', '<p>brfore hello world</p>');

// 4. 性能和内存问题：以上3种操作在删除元素后，元素与事件处理程序（或js对象）之间的绑定关系在内存中并没有删除，因此会导致内存增加

// 11.3.7 scrollIntoView()：让当前的元素滚动到浏览器窗口的可视区域内。具体参阅MDN

/* 11.4 专有扩展 */
// 11.4.2 ParentNode.children：是一个只读属性，返回一个Node的子elements ，是一个动态更新的 HTMLCollection。
console.log(Array.from(document.body.children));

// 11.4.3 Node.contains()返回的是一个布尔值，来表示传入的节点是否为该节点的后代节点
console.log(document.documentElement.contains(document.body));
// Node.compareDocumentPosition()：可以比较当前节点与任意文档中的另一个节点的位置关系，具体参阅MDN
console.log(document.documentElement.compareDocumentPosition(document.body));

// 11.4.4 插入文本
// 1. HTMLElement.innerText：属性表示一个节点及其后代的“渲染”文本内容
var listDiv2 = document.querySelector('#list2');
console.log(listDiv2.innerText);
// 写模式：替换先前存在的所有子节点，生成一个子文本节点
listDiv2.innerText = '<p>a & b</p>';
console.log(listDiv2.innerText);
// 2. outerText：包含自身，其余同上

// 11.4.5 滚动：非标准，略

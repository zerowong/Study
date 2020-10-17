/* 第10章 DOM */

// 10.1 节点层次：节点层次为树形结构，共有12种节点类型，这些类型都继承自一个基类型

// 10.1.1 Node类型：js中所有的节点类型都继承自Node类型，每个节点都有一个nodeType属性，表示节点类型，而节点类型有12个数值常量来表示
var elem = document.getElementById('hw');
// 不适应IE
console.log(elem.nodeType == Node.ELEMENT_NODE);
// 所有浏览器都适用
console.log(elem.nodeType == 1);
// 对于元素节点，nodeName始终为标签名，nodeValue始终为null
console.log(elem.nodeName, elem.nodeValue);

// NodeList：类数组对象，是一个动态对象而非快照
// childNodes属性：保存一个子节点的NodeList
console.log(elem.childNodes.length);
var firstChild = elem.childNodes[0];
var SecondChild = elem.childNodes.item(1);
console.log(firstChild, SecondChild);
console.log(firstChild.nodeType, SecondChild.nodeType);

// 将NodeList转为数组的3种方法：
var nodes1 = Array.prototype.slice.call(elem.childNodes);
console.log(nodes1);
// 以下2种更好
var nodes2 = [...elem.childNodes];
console.log(nodes2);
var nodes3 = Array.from(elem.childNodes);
console.log(nodes3);
// 针对IE8及更早版本：
function toArray(nodes) {
  var arr = [];
  nodes.forEach((node) => arr.push(node));
  return arr;
}
var nodes4 = toArray(elem.childNodes);
console.log(nodes4);
// ChildNodes 列表中的节点都是同胞节点，通过 previousSibling 和 nextSibling 属性访问其它同胞节点，特别的：第一个节点的 previousSibling 为 null，最后一个节点的 nextSibling 为 null，显然，当只有一个节点时都为 null
console.log(elem.childNodes[0].previousSibling, elem.childNodes[1].nextSibling);
// parentNode属性：父节点，它的2个重要属性：firstChild、lastChild，没有子节点时都为 null
console.log(elem.firstChild == elem.childNodes[0], elem.lastChild == elem.childNodes[1]);
// hasChildNodes()方法：有子节点时返回 true
console.log(elem.hasChildNodes());
// ownerDocument属性：指向整个文档的文档节点，使用此属性可方便的返回节点层次的顶端
console.log(elem.ownerDocument);

// 操作节点
// appendChild()：向 ChildNodes 列表尾部添加节点，返回增加的节点
var text = '*aaaaaa*';
var newNode1 = document.createTextNode(text);
var returnNode = elem.appendChild(newNode1);
console.log(returnNode == elem.lastChild);
// 如果追加的节点为已存在的节点，则移动该节点
elem.appendChild(elem.firstChild);

// insertBefore()：插入参考节点之前的位置，接受两个参数：要插入的节点和参考节点，返回插入节点，如果参考节点为 null，则在尾部插入
var newNode2 = document.createTextNode(text);
elem.insertBefore(newNode2, null);
// 同样，如果时已存在节点，则仅移动
elem.insertBefore(newNode2, elem.firstChild);

// removeChild()：参数为要移除的节点，返回被移除的节点
elem.removeChild(newNode2);

// replaceChild()：接受两个参数：要插入的节点和要替换的节点，返回被替换的节点
returnNode = elem.replaceChild(newNode2, elem.firstChild);

// cloneNode()：创建调用该方法的节点的副本，接受一个布尔参数：true：深复制，复制节点及整个子节点树；false：浅复制，只复制节点本身。复制返回后的节点没有父节点，因此为孤儿节点

// normalize()：归一化文本节点。在某个节点调用它时，1.查找不包含文本的文本节点，删除之，2.查找连续的文本节点，合并为一个文本节点
console.log(elem.childNodes.length); // => 3
elem.childNodes.forEach((node) => console.log(node.nodeType)); // 3个文本节点
elem.normalize();
console.log(elem.childNodes.length); // => 1

// 10.1.2 Document类型：js通过该类型表示文档，在浏览器中 document 对象是 HTMLDocument（继承自 Document类型）的一个实例，表示整个HTML页面。而且 document 对象是 window 对象的一个属性\

// documentElement属性：始终指向HTML页面的<html>元素
var html = document.documentElement;
console.log(html.nodeType, html.nodeName);

// body属性：始终指向<body>元素
var body = document.body;
console.log(body.nodeType, body.nodeName);

// doctype属性：指向<!DOCTYPE>
var doctype = document.doctype;
console.log(doctype.nodeType, doctype.nodeName);

// Chrome只将<html>元素前面的注释放入 childNodes
console.log([...document.childNodes]);

// title属性：指向<title>元素中的文本，修改该属性不会改变<title>元素
var originalTitle = document.title;
console.log(originalTitle);
document.title = 'Another Title';

// 网页请求相关属性：
// 完整URL、域名(www.xxx.com 部分)、来源页面的URL
console.log(document.URL, document.domain, document.referrer);

// 取元素方法：
// getElementById()：接受一个参数：元素id字符串，找到则返回元素（多个相同id元素，只返回第一个），否则返回 null，字符串严格匹配，包括大小写。ps：IE8及更低版本不区分大小写

// getElementByTagName()：接受标签名字符串参数，返回一个 HTMLCollection 对象（类似 NodeList 的动态集合）。ps：传入通配符（*）取页面所有元素
var p = document.getElementsByTagName('p');
console.log(p instanceof HTMLCollection, p.length);
// HTMLcollection 其它方法：
// namedItem()：通过 name 特性取集合中的项，如有相同项则只取第一个
console.log(p.namedItem('p'));
// 下标访问：传数值调用 item()，传字符串调用 namedItem()
console.log(p[0] == p.item(0), p['p'] == p.namedItem('p'));

// getElementByName()：接受 name 特性字符串参数，返回一个 NodeList(书中有误)
var p1 = document.getElementsByName('p');
console.log(p1 instanceof NodeList, p1.length);

// 特殊集合：都为 HTMLcollection 对象
document.anchors; // 所有带name特性的<a>元素
document.forms; // 所有<form>
document.images; // 所有<img>
document.links; // 所有带href特性的<a>元素

// 10.1.3 Element 类型
var div = document.getElementById('10.1.3');
console.log(div.nodeName, div.nodeName == div.tagName);

// 1. HTML元素都由HTMLElement或其子类型表示，HTMLElement类型继承自Element类型并添加了一些属性
console.log(div.id, div.className, div.title, div.lang, div.dir);

// 2. 取特性
// 可以取自定义特性，不区分大小写
console.log(div.getAttribute('CLASS'), div.getAttribute('hi'));
// 不能通过对象属性访问自定义特性（IE除外）
console.log(div.hi); // => undefined
// 两类特殊特性：
// 1. style：getAttribute()返回CSS文本；对象属性访问返回一个对象
// 2. onclick：getAttribute()返回js代码字符串；对象属性访问返回js函数

// 3. 设置特性
// 接受两个参数：特性名、要替换的值，特性名会自动转换为小写，如果特性不存在，则创建该特性并设置值
div.setAttribute('ID', 'anotherId');
console.log(div.id);
// 通过对象属性也可以设置特性值，但自定义属性不会转为元素特性（IE除外）
div.title = 'div';
div.color = 'red';
console.log(div.title, div.color, div.getAttribute('color'));
// 移除特性
div.removeAttribute('hi');
console.log(div.getAttribute('hi'));

// 4. attributes 属性，Element类型独有属性，包含一个NamedNodeMap（类似 NodeList 的动态集合），元素的每个特性都由一个 Attr 节点表示
div.attributes['id'].nodeValue = 'oldDiv';
console.log(div.getAttribute('id'));
// 其移除特性方法会返回被移除的特性的一个 Attr
var oldAttr = div.attributes.removeNamedItem('dir');
// 设置特性需要传入一个 Attr
div.attributes.setNamedItem(oldAttr);
// 转为数组
console.log(Array.from(div.attributes));

// 5. 创建元素
// 创建的元素默认未添加到文档树，为孤儿节点，接受参数为标签名字符串，在HTML文档中不区分大小写，在XML/XHTML中区分大小写
var newElem = document.createElement('p');
newElem.id = 'newElem';

// 6. 元素的子节点
var ul1 = document.getElementById('ul1');
// 除IE外，标签之间的空白符属于文本节点
console.log(Array.from(ul1.childNodes));
console.log(ul1.childNodes[0].nodeType, ul1.childNodes[1].nodeType);
// 元素节点继承了getElementsBy(Tag/class)Name()方法，以调用元素为起点
var item = ul1.getElementsByTagName('li');
console.log(Array.from(item));

// 10.1.4 Text 类型：文本节点由该类型表示，默认每个包含内容的元素最多只能有一个文本节点，且必须有内容
// 1. 创建文本节点
var textnode1 = document.createTextNode('Hello ');
var textnode2 = document.createTextNode('World');
newElem.appendChild(textnode1);
newElem.appendChild(textnode2);
document.body.appendChild(newElem);

// 2. 规范化文本节点
newElem.normalize();

// 3. 分割文本节点
// 接受数值参数，表示分割位置(从0开始数），文本节点分为两部分：[0, args), [args, last], 返回第二部分的文本节点
newElem.firstChild.splitText(5);
console.log(Array.from(newElem.childNodes));

// 其它属性、方法：略

// 10.1.5 Comment 类型：注释由该类型表示，该类型与 Text类型继承自相同的基类，有除了 splitText() 之外的所有字符串操作方法
var comment = document.createComment('a comment');
comment.appendData('!');
console.log(comment.length, comment.data);

// 10.1.6 CDATASection 类型：存在于XML文档中，继承自 Text类型，有除了 splitText() 之外的所有字符串操作方法

// 10.1.7 DocumentType 类型
console.log(document.doctype.name);

// 10.1.8 DocumentFragment 类型：表示文档片段，不存在于文档中，不能添加到文档中，但可以作为“仓库”用以保存将来可能会用到的节点。该类型继承了 Node 类型的所有方法，如果将文档中的节点添加到文档片段中，那么该节点会从文档树中删除，如果将文档片段添加到文档中，会将其中内容（子节点）添加（移动）到相应位置。
var fragment = document.createDocumentFragment();
var ul2 = document.getElementById('ul2');
for (let i = 1; i <= 3; ++i) {
  let li = document.createElement('li');
  li.appendChild(document.createTextNode(`item${i}`));
  fragment.appendChild(li);
}
ul2.appendChild(fragment);

// 10.1.9 Attr 类型：元素的特性由该类型表示，有3个属性：name：特性名；value：特性值；specified：bool值，区别指定和默认
var attr = document.createAttribute('align');
attr.value = 'left';
newElem.setAttributeNode(attr);
console.log(
  newElem.getAttribute('align'),
  newElem.attributes['align'].value,
  newElem.getAttributeNode('align').value
);

// 10.2 DOM操作技术

// 10.2.1 动态脚本
// 1. 插入js文件
function loadScript(url, location) {
  var script = document.createElement('script');
  script.defer = true;
  script.src = url;
  location.appendChild(script);
}
loadScript('./src/temp.js', document.head);
// 2. 插入js代码
function loadScriptString(code) {
  var script = document.createElement('script');
  try {
    script.appendChild(document.createTextNode(code));
  } catch (ex) {
    // 兼容IE
    script.text = code;
  }
  document.body.appendChild(script);
}
loadScriptString("function hi() { console.log('hi'); }");
hi();

// 10.2.2 动态样式
// 1. 插入css文件
function loadStyle(href) {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = href;
  document.head.appendChild(link);
}
loadStyle('./style/test.css');
// 2. 插入css代码
function loadStyleString(code) {
  var style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(code));
  document.head.appendChild(style);
}
loadStyleString('p{color: red;}');

// 10.2.3 操作表格
var table = document.createElement('table');
table.border = 1;
table.width = '100%';
var tbody = document.createElement('tbody');
table.appendChild(tbody);

tbody.insertRow(0);
tbody.rows[0].insertCell(0);
tbody.rows[0].cells[0].appendChild(document.createTextNode('Cell 1,1'));
tbody.rows[0].insertCell(1);
tbody.rows[0].cells[1].appendChild(document.createTextNode('Cell 2,1'));

tbody.insertRow(1);
tbody.rows[1].insertCell(0);
tbody.rows[1].cells[0].appendChild(document.createTextNode('Cell 1,2'));
tbody.rows[1].insertCell(1);
tbody.rows[1].cells[1].appendChild(document.createTextNode('Cell 2,2'));

document.body.appendChild(table);

// 10.2.4 使用 NodeList：NodeList、NamedNodeMap、HTMLCollection 三者都是动态集合，每当文档结构发生变化，它们都会得到更新，以上三者对象都是在访问DOM文档时实时运行的查询
// 以下代码会导致无限循环
function infiniteLoop() {
  var divs = document.getElementsByTagName('div');
  // 解决办法：缓存 divs.length
  for (let i = 0; i < divs.length; ++i) {
    let div = document.createElement('div');
    document.body.appendChild(div);
  }
}

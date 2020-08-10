/* 第12章 DOM2和DOM3 */
// 12.1 DOM的变化
// 查看是否支持
console.log(document.implementation.hasFeature('core', '2.0'));
console.log(document.implementation.hasFeature('core', '3.0'));
console.log(document.implementation.hasFeature('HTML', '2.0'));
console.log(document.implementation.hasFeature('Views', '2.0'));
console.log(document.implementation.hasFeature('XML', '2.0'));

// 12.1.1 针对XML命名空间的变化

// 1. node类型的变化
// DOM2：(下列API在MDN被标为过时API)
// localName：不带命名空间前缀的节点名称
console.log(document.documentElement.localName);
// namespaceURI：命名空间URI，未指定时为 null，文档默认命名空间URI为：http://www.w3.org/1999/xhtml
console.log(document.documentElement.namespaceURI);
// prefix：命名空间前缀，未指定时为 null
console.log(document.documentElement.prefix);
// DOM3：
// 指定的 namespaceURI是当前节点默认命名空间时返回 true
console.log(document.body.isDefaultNamespace('http://www.w3.org/1999/xhtml'));
// 返回当前节点上与指定命名空间前缀绑定的命名空间URI,如果没有,返回null,如果参数为null,返回默认的命名空间.该方法对动态指定的命名空间不起作用.(也就是通过Node.prefix指定的).
console.log(document.body.lookupNamespaceURI(null));
// 返回一个和指定命名空间URI绑定的命名空间前缀.如果没有,返回null. 如果有多个绑定的前缀, 返回的结果根据浏览器实现而定.该方法对动态指定的命名空间不起作用.(也就是通过Node.prefix指定的).
console.log(document.body.lookupPrefix('http://www.w3.org/1999/xhtml'));

// 2. Document 类型的变化
// document.createElementNS(namespace, name)：创建一个具有指定的命名空间URI和限定名称的元素。
// document.createAttributeNS(namespace, name)：创建一个具有指定的命名空间URI和限定名称的特性
// document.getElementsByTagNameNS(namespace, name)：返回带有指定名称和命名空间的元素集合。整个文件结构都会被搜索，包括根节点。

// 3. Element 类型的新变化
// getAttributeNS(namespaceURI, localName)：取得属于命名空间 namespaceURI 且名为 localName 的特性
// getAttributeNodeNS(namespaceURI, localName)：取得属于命名空间 namespaceURI 且名为 localName 的特性节点
// getElementsByTagNameNS(namespaceURI, tagName)：返回属于命名空间 namespaceURI 的 tagName 元素的 NodeList
// hasAttributeNS(namespaceURI, localName)：确定当前元素是否有一个属于 namespaceURI 的名为 localName 的特性
// removeAttributeNS(namespaceURI, localName)：删除
// setAttributeNS(namespaceURI, localName)：设置值
// setAttributeNodeNS(attNode)：设置特性节点

// 4. NamedNodeMap 类型的变化：NamedNodeMap 接口表示属性节点 Attr 对象的集合。尽管在 NamedNodeMap 里面的对象可以像数组一样通过索引来访问，但是它和 NodeList 不一样，对象的顺序没有指定。它是动态集合
// NamedNodeMap.getNamedItemNS(namespaceURI, localName)：根据给定的命名空间参数和name参数返回一个Attr对象。
// NamedNodeMap.removeNamedItemNS(namespaceURI, localName)：删除给定命名空间参数和name参数的Attr 对象 。
// NamedNodeMap.setNamedItemNS(node)：替换、添加给定命名空间参数和name参数的Attr 对象 。

// 12.1.2 其它变化
// 1. DocumentType 类型的变化
// 新增了3个属性：publicId、systemId、internalSubset(很少用)
// 在HTML5中为空字符串
console.log(document.doctype.publicId);
console.log(document.doctype.systemId);

// 2. Document 类型的变化
// importNode(node, deep)：将外部文档的一个节点拷贝一份,然后可以把这个拷贝的节点插入到当前文档中.参数：node：将要从外部文档导入的节点.deep：一个布尔值,表明是否要导入节点的后代节点.（即深复制还是浅复制）

// defaultView：该属性返回当前 document 对象所关联的 window 对象，如果没有，会返回 null。
console.log(document.defaultView);

// document.implementation 对象方法：
// createDocumentType(qualifiedName, publicId, systemId)：创建一个新的 DocumentType 节点
var newDoctype = document.implementation.createDocumentType('html', '', '');

// createDocument(namespaceURI, qualifiedName, documentType)：documentType 为 null时创建XML文档
var newDoc = document.implementation.createDocument(null, 'html', newDoctype);
console.log(newDoc);

// createHTMLDocument(title)：创建一个完整的HTML文档，参数为文档标题
console.log(document.implementation.createHTMLDocument('foo'));

// 3. Node 类型的变化
var div1 = document.createElement('div');
div1.setAttribute('class', 'box');
var div2 = document.createElement('div');
div2.setAttribute('class', 'box');

// isSameNode()：两个节点引用的是同一个对象时返回 true；ps：该方法已过时，应该使用 === 或 == 运算符
// bad
console.log(div1.isSameNode(div2));
// good
console.log(div1 == div2);
console.log(div1 === div2);
// isEqualNode()：两个节点具有相同类型，相同属性时返回 true
console.log(div1.isEqualNode(div2));

// 4. 框架的变化
// contentDocument：指向表示框架内容的文档对象
var frame = document.createElement('frame');
var frameDoc = frame.contentDocument;

// 12.2 样式
// 确认样式支持
console.log(document.implementation.hasFeature('CSS', '2.0'));
console.log(document.implementation.hasFeature('CSS2', '2.0'));

// 12.2.1 访问元素的样式
var myDiv = document.createElement('div');
myDiv.style.backgroundColor = 'rgb(38, 50, 63)';
myDiv.style.width = '100px';
myDiv.style.height = '200px';
myDiv.style.border = '1px solid red';
document.body.appendChild(myDiv);

// 1. DOM样式属性和方法
// cssText：用法等同于写外部CSS文件
myDiv.style.cssText =
  'width: 100px; height: 100px; background-color: black; border: 10px solid blue;';
// 遍历CSS属性
for (let i = 0, len = myDiv.style.length; i < len; ++i) {
  let prop = myDiv.style[i];
  let value = myDiv.style.getPropertyValue(prop);
  console.log(`${prop}: ${value}`);
}
// 移除CSS属性：移除后会为其应用默认样式（从其它样式表层叠而来）
myDiv.style.removeProperty('border');

// 2. 计算的样式：经过外部样式表、内嵌样式表、style特性层叠后的样式
// 方法：document.defaultView.getComputedStyle(element, [pseudoElt])：第二个参数指定一个要匹配的伪元素的字符串。必须对普通元素省略（或null）。ps：计算样式是只读的
// 其中除了自定义的，还有默认样式
var computedStyle = document.defaultView.getComputedStyle(myDiv, null);
console.log(computedStyle.length);

// 12.2.2 操作样式表
// 外部样式表由 HTMLLinkElement 表示；内嵌样式表由 HTMLStyleElement 表示；CSSStyleSheet 更通用，只表示样式表
// 区别：前两个类型允许修改，CSSStyleSheet 只读（disabled属性除外）
// 确认支持：
console.log(document.implementation.hasFeature('StyleSheets', '2.0'));
// 应用于文档的样式表通过 document.styleSheets 集合表示
console.log(document.styleSheets.length, document.styleSheets[0].href);
// 通过<link>和<style>元素取得 CSSStyleSheet：element.sheet
console.log(document.styleSheets[0] == document.getElementsByTagName('link')[0].sheet);

// 1. CSS规则：CSSStyleRule 类型继承自 CSSRule 类型
var sheet = document.styleSheets[0];
var rules = sheet.cssRules;
var rule = rules[0];
console.log(rule.selectorText);
console.log(rule.style.cssText);
rule.style.textAlign = 'left';

// 2. 创建规则
// insertRule()：接受两个参数：规则文本和插入索引
sheet.insertRule('div { border: 5px solid lightskyblue; }', rules.length);

// 3. 删除规则：deleteRule(index)
sheet.deleteRule(rules.length - 1);

// 12.2.3 元素大小
// 1. 偏移量：包括元素在屏幕上占用的所有可见的大小。值是只读的，每次访问需重新计算
// offsetParent：元素的包含元素（不一定是parentNode）
var p = document.querySelector('p');
function getElementLeft(elem) {
  var actualLeft = elem.offsetLeft;
  var current = elem.offsetParent;
  while (current != null) {
    actualLeft += current.offsetLeft;
    current = current.offsetParent;
  }
  return actualLeft;
}
function getElementTop(elem) {
  var actualTop = elem.offsetTop;
  var current = elem.offsetParent;
  while (current != null) {
    actualTop += current.offsetTop;
    current = current.offsetParent;
  }
  return actualTop;
}
console.log(p.offsetHeight, p.offsetWidth);
console.log(getElementLeft(p), getElementTop(p));

// 2. 客户区大小：元素内容和内边距占用的大小。同偏移量是只读值
function getViewPort() {
  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  };
}
console.log(getViewPort());
console.log(`${window.innerWidth}x${window.innerHeight}`);

// 3. 滚动大小：包含滚动内容的元素的大小
var scrollDiv = document.querySelector('#scrollDiv');
// scrollWidth，scrollHeight：在没有滚动条的情况下，元素的总宽度和总高度
console.log(`scroll: ${scrollDiv.scrollWidth}x${scrollDiv.scrollHeight}`);
console.log(`client: ${scrollDiv.clientWidth}x${scrollDiv.clientHeight}`);
console.log(`offset: ${scrollDiv.offsetWidth}x${scrollDiv.offsetHeight}`);
// scrollLeft，scrollTop：读模式：被隐藏（滚动过）的像素数；写模式：改变元素滚动状态，设置为0时回到未滚动状态
function recovery() {
  scrollDiv.scrollLeft = 0;
  scrollDiv.scrollTop = 0;
}

// 4. 确定元素大小
console.log(p.getBoundingClientRect());

// 12.3 遍历
// 两种类型：NodeIterator，TreeWalker。这两种类型都基于给定节点对DOM结构进行深度优先遍历
// 确认支持：
console.log(document.implementation.hasFeature('Traversal', '2.0'));

// 12.3.1 NodeIterator

// 创建实例方法：document.createNodeIterator(root, whatToShow, filter, entityReferenceExpansion)：
// root：搜索起点节点
// whatToShow：表示要访问哪些节点的位掩码
// filter：一个NodeFilter对象或具有相同功能的函数
// ERE：布尔值，表示是否要扩展实体引用，在HTML中没有用，因为其实体引用不能扩展
// 两个方法：nextNode(), perviousNode()
var root = document.body;
var filter = {
  acceptNode(node) {
    return node.tagName.toLowerCase() == 'p' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  },
};
var iterator = document.createNodeIterator(root, NodeFilter.SHOW_ELEMENT, filter, false);
console.log(iterator.nextNode().textContent);

var list1 = document.querySelector('#list1');
var listIterator = document.createNodeIterator(list1, NodeFilter.SHOW_ELEMENT, null, false);
var listArray = [];
for (let i = listIterator.nextNode(); i != null; i = listIterator.nextNode()) {
  listArray.push(i.nodeName);
}
console.log(listArray);

// 12.3.2 TreeWalker：是 NodeIterator 的高级版本，除了 nextNode(),perviousNode()还有如下方法：
// parentNode()：遍历到当前节点的父节点
// firstChild()：遍历到当前节点的第一个子节点
// lastChild()：遍历到当前节点的最后一个子节点
// nextSibling()：遍历到当前节点的下一个同辈节点
// previousSibling()：遍历到当前节点的上一个同辈节点
// 创建实例方法同上，filter的返回值新增 NodeFilter.FILTER_REJECT :跳过该节点及整个子树
var walker = document.createTreeWalker(list1, NodeFilter.SHOW_ELEMENT, null, false);
listArray = [];
walker.firstChild();
for (let i = walker.firstChild(); i != null; i = walker.nextSibling()) {
  listArray.push(i.nodeName);
}
console.log(listArray);
// currentNode：读：返回上一次遍历返回的节点；写：修改遍历继续进行的起点
walker.currentNode = list1;
console.log(walker.nextNode().nodeName);

// 12.4 范围

// 12.4.1 DOM中的范围
// 确认支持：
console.log(document.implementation.hasFeature('Range', '2.0'));
// 每个范围都是 Range 类型的实例
var range = document.createRange();
// 属性：
// startContainer：范围起点节点（区域中第一个节点的父节点）
// startOffset：范围在 startContainer 的偏移量。如果 startContainer 是文本节点、注释节点、CDATA节点，那么该属性就是范围起点之前跳过的字符数量；否则就是范围中第一个子节点的索引
// endContainer：范围终点节点（区域中最后一个节点的父节点）
// endOffset：取值规则同 startOffset
// commonAncestorContainer：startContainer 和 endContainer 的共同祖先节点在文档树的位置最深的那个

// 1. 用DOM范围实现简单选择：
// selectNode()：选择整个节点（包括子节点）
// selectNodeContents()：选择节点的子节点
var p1 = document.querySelector('#p1');
var range1 = document.createRange();
var range2 = document.createRange();
range1.selectNode(p1);
range2.selectNodeContents(p1);
console.log(
  range1.startContainer.nodeName,
  range1.endContainer.nodeName,
  range1.commonAncestorContainer.nodeName,
  range1.startOffset,
  range1.endOffset
);
console.log(
  range2.startContainer.nodeName,
  range2.endContainer.nodeName,
  range2.commonAncestorContainer.nodeName,
  range2.startOffset,
  range2.endOffset
);
// 额外方法（自动更新属性）：
// setStartBefore(refNode)：将范围的起点设置在 refNode 之前
// setStartAfter(refNode)：将范围的起点设置在 refNode 之后
// setEndBefore(refNode)：将范围的终点设置在 refNode 之后
// setEndAfter(refNode)：将范围的终点设置在 refNode 之后

// 2. 用DOM范围实现复杂选择
// setStart(refNode, offset)
// setEnd(refNode, offset)
// 示例：he[llo wo]rld
range1.setStart(p1.firstChild.firstChild, 2);
range1.setEnd(p1.lastChild, 3);
console.log(
  range1.startContainer.nodeName,
  range1.endContainer.nodeName,
  range1.commonAncestorContainer.nodeName,
  range1.startOffset,
  range1.endOffset
);

// 3. 操作DOM范围中的内容：创建范围时，内部会为这个范围创建一个文档片段，范围所属的全部节点都被添加到这个文档片段中（以指针形式），自动补全DOM结构
range.setStart(p1.firstChild.firstChild, 2);
range.setEnd(p1.lastChild, 3);
// 删除
range.deleteContents();

// 删除并返回
var p2 = document.querySelector('#p2');
range.setStart(p2.firstChild.firstChild, 2);
range.setEnd(p2.lastChild, 3);
var fragment = range.extractContents();
p2.appendChild(fragment);

// 拷贝
var p3 = document.querySelector('#p3');
range.setStart(p3.firstChild.firstChild, 2);
range.setEnd(p3.lastChild, 3);
fragment = range.cloneContents();
p3.appendChild(fragment);

// 4. 插入DOM范围中的内容
// insertNode()：向范围开始出插入节点
var p4 = document.querySelector('#p4');
range.setStart(p4.firstChild.firstChild, 2);
range.setEnd(p4.lastChild, 3);
var span = document.createElement('span');
span.style.color = 'red';
span.appendChild(document.createTextNode('inserted span'));
range.insertNode(span);
// 环绕插入
var p5 = document.querySelector('#p5');
range.selectNode(p5.firstChild.firstChild);
span = document.createElement('span');
span.style.backgroundColor = 'yellow';
range.surroundContents(span);

// 5. 折叠DOM范围
// range.collapse()：接受一个布尔值参数：true：折叠到起点；false：折叠到终点
range.collapse(true);
console.log(range.startOffset, range.endOffset);
// range.collapsed：是否已折叠
var p6 = document.createElement('p');
var p7 = document.createElement('p');
document.body.appendChild(p6);
document.body.appendChild(p7);
range.setStartAfter(p6);
range.setStartBefore(p7);
console.log(range.collapsed);

// 6. 比较DOM范围
range1.selectNodeContents(p5);
range2.selectNodeContents(p5);
range2.setEndBefore(p5.lastChild);
// 返回值：点1在点2之前返回 -1；相同 0； 之后 1；
console.log(range1.compareBoundaryPoints(Range.START_TO_START, range2));
console.log(range1.compareBoundaryPoints(Range.END_TO_END, range2));

// 7. 复制范围
var newRange = range.cloneRange();

// 8. 清理范围
range.detach(); // 从文档中分离
range = null; // 解除引用
range1.detach;
range1 = null;
range2.detach;
range2 = null;

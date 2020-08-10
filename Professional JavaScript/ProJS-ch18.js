/* 第十八章 JS与XML */

// 18.1.1 DOM2级核心
// 检测DOM2级XML
console.log(document.implementation.hasFeature('XML', '2.0'));
// 创建XML文档
// 不指定命名空间和文档类型
const xmldom = document.implementation.createDocument('', 'root', null);
console.log(xmldom.documentElement.tagName);
const child = xmldom.createElement('child');
xmldom.documentElement.appendChild(child);

// 18.1.2 DOMParser 类型：将XML解析为DOM文档
{
  const parser = new DOMParser();
  // 接受参数为：1.XML字符串；2.内容类型。返回一个 Document 的实例
  const xmldom = parser.parseFromString('<root><child/></root>', 'text/xml');
  console.log(xmldom.documentElement.tagName, xmldom.documentElement.firstChild.tagName);
  const anotherChild = xmldom.createElement('child');
  xmldom.documentElement.appendChild(anotherChild);
  const children = xmldom.getElementsByTagName('child');
  console.log(children.length);
}
/* DOMParser 只能解析格式良好的XML，在发生解析错误时，仍会返回一个 Document 对象，但这个对象的文档元素是 <parsererror>，内容为错误描述，因此需检测文档内容，手动抛出错误 */
{
  const parser = new DOMParser();
  try {
    const xmldom = parser.parseFromString('<root>', 'text/xml');
    const errors = xmldom.getElementsByTagName('parsererror');
    if (errors.length > 0) {
      throw new Error('parsing error');
    }
  } catch (ex) {
    if (ex instanceof Error) {
      console.error(ex.message);
    }
  }
}

// 18.1.3 XMLSerializer 类型：将DOM文档序列化为XML字符串，可以是任何有效的DOM对象，包括HTML文档
{
  const serializer = new XMLSerializer();
  const xml = serializer.serializeToString(xmldom);
  console.log(xml);

  const html = serializer.serializeToString(document.documentElement);
  console.log(html);
}

// 18.2 浏览器对 Xpath 的支持

// 18.2.1 DOM3级 Xpath
{
  console.log(document.implementation.hasFeature('Xpath', '3.0'));
  // 两个主要类型：XpathEvaluator 和 XpathResult
  let result = xmldom.evaluate(
    'child',
    xmldom.documentElement,
    null,
    XPathResult.ORDERED_NODE_ITERATOR_TYPE,
    null
  );
  if (result !== null) {
    let node = result.iterateNext();
    while (node) {
      console.log(node.tagName);
      node = result.iterateNext();
    }
  }
  result = xmldom.evaluate(
    'child',
    xmldom.documentElement,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );
  if (result !== null) {
    for (let i = 0, len = result.snapshotLength; i < len; ++i) {
      console.log(result.snapshotItem(i).tagName);
    }
  }
  // 1.单节点结果
  result = xmldom.evaluate(
    'child',
    xmldom.documentElement,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );
  if (result !== null) {
    console.log(result.singleNodeValue.tagName);
  }
  // 2.简单类型结果
  // boolean
  result = xmldom.evaluate('child', xmldom.documentElement, null, XPathResult.BOOLEAN_TYPE, null);
  if (result !== null) {
    console.log(result.booleanValue);
  }
  // number
  result = xmldom.evaluate(
    'count(child)',
    xmldom.documentElement,
    null,
    XPathResult.NUMBER_TYPE,
    null
  );
  if (result !== null) {
    console.log(result.numberValue);
  }
  // string
  result = xmldom.evaluate('child', xmldom.documentElement, null, XPathResult.STRING_TYPE, null);
  if (result !== null) {
    console.log(result.stringValue);
  }
  // 3.默认类型结果(自动判断类型)
  result = xmldom.evaluate('child', xmldom.documentElement, null, XPathResult.ANY_TYPE, null);
  if (result !== null) {
    console.log(result.resultType);
  }
  // 4.命名空间支持
}

// 18.3 浏览器对 XSLT 的支持

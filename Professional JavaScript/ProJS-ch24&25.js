/* 第二十四章 最佳实践 & 第二十五章 新兴的API */

// Duff装置
function duff(values) {
  let iterations = Math.ceil(values.length / 8);
  let leftover = values.length % 8;
  let i = 0;
  function precess(value) {}
  if (leftover > 0) {
    do {
      precess(values[i++]);
    } while (--leftover > 0);
    do {
      precess(values[i++]);
      precess(values[i++]);
      precess(values[i++]);
      precess(values[i++]);
      precess(values[i++]);
      precess(values[i++]);
      precess(values[i++]);
      precess(values[i++]);
    } while (--iterations > 0);
  }
}

// 优化DOM交互
// 1.最小化现场更新
{
  const list = document.querySelector('#list1');
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 10; ++i) {
    const item = document.createElement('li');
    item.appendChild(document.createTextNode('item ' + i));
    // 文档片段预存
    fragment.appendChild(item);
  }
  // 一次添加
  list.appendChild(fragment);
}
// 2.使用 innerHTML：设置该属性值会在后台创建一个HTML解析器，然后使用内部的DOM调用来创建DOM结构，比基于JS的DOM调用更快
{
  const list = document.querySelector('#list2');
  let html = '';
  for (let i = 0; i < 10; ++i) {
    html += `<li>item ${i}</li>`;
  }
  list.innerHTML = html;
}
// 3. 事件代理
// 4. 注意 HTMLcollection：其查询开销很大。最好用局部变量预存

// 压缩
// 1.代码压缩
// 2.HTTP压缩

// 新兴的API

// 1. window.webkitRequestAnimationFrame()

// 2. Page Visibility API

// 3. navigator.geolocation

// 4. File API

// 5. Web Timing API

// 6. Web Workers

/* 第二十一章 Ajax */

/* Ajax：( Asynchronous JavaScript and XML)：其技术核心是 XMLHttpRequest 对象(简称XHR)，该技术最大的优势是不要刷新整个页面也可以与服务器交换数据并更新部分页面内容，而且不需要任何浏览器插件。Ajax通信与数据格式无关，不一定是XML数据 */

{
  // 20.1 XMLHttpRequest 对象
  const xhr = new XMLHttpRequest();

  // 20.1.1 XHR的用法
  // 添加事件：在调用 open() 之前添加
  xhr.addEventListener('readystatechange', () => {
    // 4：完成。以接收到全部数据
    if (xhr.readyState === 4) {
      // 检测响应状态
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
        console.log(xhr.responseText);
      } else {
        console.error(`Request was unsuccessful: ${xhr.status}`);
      }
    }
  });
  // 初始化请求：参数：1.请求类型；2.请求URL；3.是否异步(默认为 true)
  xhr.open('GET', 'example.txt', true);

  // 20.1.2 HTTP头部信息：每个HTTP请求和响应都带有相应的头部信息
  // 设置自定义请求头部信息，必须在open()调用后，send()调用前调用
  xhr.setRequestHeader('myHeader', 'myValue');

  // 发送请求：参数为请求主体发送的数据，不需要则为 null
  xhr.send(null);

  // 取得头部信息，返回结果都是字符串
  const myHeader = xhr.getResponseHeader('myHeader');
  const allHeader = xhr.getAllResponseHeaders();
  console.log(myHeader);
  console.log(allHeader);
}

// 20.1.3 GET请求。最常用于向服务器查询某些信息
// open()方法的URL参数尾部可以添加查询字符串参数。但查询字符串中每个参数的键值对都必须使用 encodeURIComponent() 进行编码，且所有键值对都必须用 & 分割
{
  let addURLParam = (url, name, value) => {
    url += url.includes('?') ? '&' : '?';
    url += encodeURIComponent(name) + '=' + encodeURIComponent(value);
    return url;
  };
  let url = 'example.php';
  url = addURLParam(url, 'name', 'zero');
  url = addURLParam(url, 'age', '21');
  try {
    xhr.open('GET', url, true);
  } catch (ex) {}
}

// 20.1.4 POST请求：通常用于向服务器发送应该被保存的数据
{
  try {
    xhr.open('POST', 'example', true);
    // 可以发送的数据见MDN
    xhr.send(data);
  } catch (ex) {}
}

// 20.2 XMLHttpRequest 2级

// 20.2.1 FromData 类型：表单序列化及创建与表单格式相同的数据
{
  const data = new FormData();
  // 参数为：键和值，分别对应表单字段的名字和字段中包含的值
  data.append('name', 'zero');
  // 也可以在构造器传入表单元素
  // ...new FormData(document.form[0])
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'example.php', true);
  // xhr.send(data);
}

// 20.2.2 超时设定。
{
  const xhr = new XMLHttpRequest();
  // 单位为 ms，若在设置的时间内没有收到响应，则触发 timeout 事件
  xhr.timeout = 1000;
  xhr.addEventListener('timeout', () => {});
}

// 20.2.3 overrideMimeType()：用于重写XHR响应的MIME类型，必须在 send() 调用之前调用
{
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'example.txt', true);
  xhr.overrideMimeType('text/plain');
  xhr.send(null);
}

// 21.3 进度事件(Progress Events)。事件流程：loadstart -> progress -> error/abort/load/ -> loadend

// 21.3.1 Load 事件：只要浏览器接收到响应，不管状态如何，都会触发
{
  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', (event) => {
    if (xhr.status === 200) {
      console.log(xhr.responseText);
    } else {
      console.error('error');
    }
  });
  xhr.open('GET', 'example.txt', true);
  xhr.send(null);
}

// 21.3.2 progress 事件：在接收新数据期间周期性的触发
{
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status === 200) {
      console.log('loaded');
    } else {
      console.error('error');
    }
  };
  xhr.onprogress = (event) => {
    const statusBar = document.querySelector('#status');
    // lengthComputable：表示进度信息是否可用的布尔值
    if (event.lengthComputable) {
      // loaded：已接收的字节数；total：预期的全部字节数
      statusBar.innerHTML = `${(event.loaded / event.total) * 100}%`;
      // statusBar.innerHTML = `${event.loaded} ${event.total}`;
    }
  };
  xhr.open('GET', 'example2.txt');
  xhr.send(null);
}
/*
21.4 跨源资源共享(Cross-Origin Resource Shraing)
在 open() 方法中传入绝对URL：xhr.open('GET', 'https://www.xxx.com/xxx/')
跨域XHR的限制：
1.不能使用 setRequestHeader() 设置自定义头部
2.不能发送和接收 cookie
3.getAllResponseHeaders()总会返回空串
*/

// 21.4.3 Preflighted Request

// 21.4.4 带凭证的请求：withCredentials 属性

// 21.5.1 图像 Ping
// 21.5.2 JSONP
// 21.5.3 Comet
// 21.5.4 服务器发送事件(Server-Sent Events)，简称SSE
// 21.5.5 Web Sockets

// 21.6 安全
// CSRF(Cross-Site Request Forgery)：跨站点请求伪造

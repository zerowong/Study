/* 第二十三章 离线应用与客户端存储 */

// 23.1 离线检测
{
  console.log(navigator.onLine);
  window.addEventListener('online', (event) => {
    console.log('online');
  });
  window.addEventListener('offline', (event) => {
    console.log('offline');
  });
}

// 23.2 应用缓存(application cache)，简称 appcache。想在这个缓存中保存数据，需要一个描述文件(manifest file)，该文件扩展名为：appcache 或 manifest
// 关联页面和描述文件：在 <html> 中的 manifest 属性中指定文件路径
// 该API的核心对象为：applicationCache
// 注意：该API将被废弃，不建议用

// 23.3 数据存储：直接在客户端上存储数据

// 23.3.1 Cookie：详见书和MDN
{
  const CookieUtil = {
    get(name) {
      let cookieName = encodeURIComponent(name) + '=';
      let cookieStart = document.cookie.indexOf(cookieName);
      let cookieValue = null;
      if (cookieStart > -1) {
        let cookieEnd = document.cookie.indexOf(';', cookieStart);
        if (cookieEnd === -1) {
          cookieEnd = document.cookie.length;
        }
        cookieValue = decodeURIComponent(
          document.cookie.substring(cookieStart + cookieName.length, cookieEnd)
        );
      }
      return cookieValue;
    },
    set(name, value, expiers, path, domain, secure) {
      let cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);
      if (expiers instanceof Date) {
        cookieText += '; expiers=' + expiers.toUTCString();
      }
      if (path) {
        cookieText += '; path=' + path;
      }
      if (domain) {
        cookieText += '; domain=' + domain;
      }
      if (secure) {
        cookieText += '; secure';
      }
      document.cookie = cookieText;
    },
    unset(name, path, domain, secure) {
      this.set(name, '', new Date(0), path, domain, secure);
    },
  };

  CookieUtil.set('name', 'zero');
  CookieUtil.set('age', '21');
  console.log(CookieUtil.get('name'));
  console.log(CookieUtil.get('age'));
  console.log(document.cookie);
  CookieUtil.unset('name');
  CookieUtil.unset('age');
}

// 23.3.2 IE用户数据

// 23.3.3 Web Storage
// 1. Storage 类型：详见书和MDN

// 2. sessionStorage 对象：存储特定于某个会话的数据，只保持到浏览器关闭，存储于其中的数据可以跨越页面刷新而存在。是Storage 类型的一个实例
{
  // 使用方法存储数据
  sessionStorage.setItem('name', 'zero');
  // 使用属性存储数据
  sessionStorage.age = '21';
  // 使用方法读取数据
  console.log(sessionStorage.getItem('name'));
  // 使用属性读取数据
  console.log(sessionStorage.age);
  // 遍历数据
  for (let i = 0, len = sessionStorage.length; i < len; ++i) {
    let key = sessionStorage.key(i);
    let value = sessionStorage.getItem(key);
    console.log(`${key}: ${value}`);
  }
  // 删除数据
  delete sessionStorage.age;
  sessionStorage.removeItem('name');
  sessionStorage.clear();
  console.log(sessionStorage.length);
}

// 4. localStorage 对象：持久化数据，访问遵循同源策略(同域名，同协议，同端口)，数据保持到JS代码删除或用户清理浏览器缓存

// 5. Storage 事件：对Storage对象进行任何修改，都会在文档上触发该事件。在同一个页面内发生的改变不会起作用——在相同域名下的其他页面（如一个新标签或 iframe）发生的改变才会起作用
// 演示见 event.js
function populateStorage() {
  localStorage.setItem('name', document.getElementById('name').value);
  setName();
}
function setName() {
  const name = localStorage.getItem('name');
  document.getElementById('name').value = name;
}
const nameSelect = document.getElementById('name');
nameSelect.onchange = populateStorage;

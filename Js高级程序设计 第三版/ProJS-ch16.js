/* 第十六章 HTML5脚本编程 */

/*
16.1 跨文档消息传送(cross-document messageing)，简称XDM，指来自不同域的页面间传递消息
核心方法：postMessage()：接受两个参数：一条消息和一个表示消息接收方来自哪个域的字符串(使用通配符 * 则表示可以发送给任何域)
接收到XDM消息时，会触发 window 对象 message 事件，该事件以异步形式触发，可能具有延迟。该事件的对象包含：
1. data：作为 postMessage() 第一个参数传入的字符串数据
2. origin：发送消息的文档所在的域
3. source：发送消息的文档的 window 对象的代理，主要用于消息回执
*/
window.addEventListener('message', (event) => {
  if (event.origin == 'http://localhost:8080') {
    console.log(event.data);
    // event.source.postMessage('received', 'http://localhost:8080');
  }
});

// 16.2 原生拖放

/*
16.2.1 拖放事件
拖动某元素时，会依次触发下列事件，目标都是被拖放的元素
1.dragstart：按下鼠标键并开始移动鼠标时触发，此时光标变成‘不能放’符号
2.drag：在元素被拖放期间持续触发
3.dragend：拖放停止时触发，无论元素是否被放在了有效的放置目标上
当某个元素被拖放到一个有效的目标上时，会依次触发下列事件，目标都是作为放置目标的元素
1.dragenter：某元素被拖放到目标上时触发
2.dragover：被拖放元素还在放置目标的范围内移动时持续触发
3.dragleave：被拖放元素放到目标前移出了目标
3.drop：被拖放元素放到了目标
*/

// 16.2.2 自定义放置目标：把任何元素变成有效的放置目标
const dropDiv = document.querySelector('#dropDiv');
dropDiv.addEventListener('dragenter', (event) => {
  event.preventDefault();
});
dropDiv.addEventListener('dragover', (event) => {
  event.preventDefault();
});

/*
16.2.3 dataTransfer 对象：事件对象的一个属性，用于被拖放元素向放置目标传递数据
该对象主要有两个方法：
1. setData()：第一个参数是一个表示数据类型的字符串，包括'text', 'URL'或其它MIME类型，第二个参数为想要传递的数据
2. getData()；参数同上第一个参数
拖放文本元素时，被传递的数据为该元素的文本，以'text'格式保存，拖放链接或图像时保存'URL'
*/
dropDiv.addEventListener('drop', (event) => {
  dropDiv.textContent += event.dataTransfer.getData('text');
});

// 16.2.4 dropEffect和effectAllowed：dataTransfer对象的两个属性，详见书或MDN

// 16.2.5 可拖动：draggable：HTML元素上的属性，决定该元素是否可拖到

// 16.2.6 其它成员：dataTransfer对象的其它成员，详见书或MDN

// 16.3 媒体元素：<audio>和<video>

// 16.3.1 属性：详见书或MDN

// 16.3.2 事件：详见书或MDN

// 16.3.3 自定义媒体播放器：略

// 16.3.4 检测编解码器的支持情况：canPlayType()，详见书或MDN

// 16.3.5 Audio 类型：不需要插入文档，只要创建一个传入了音频源文件的实例即可
const audio = new Audio('./audio/177 - 巴赫平均律.mp3');
audio.addEventListener('canplaythrough', (event) => {
  audio.play();
});

// 16.4 历史状态管理：history对象，详见书或MDN

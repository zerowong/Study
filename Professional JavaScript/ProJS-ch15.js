/* 第十五章 使用Canvas绘图 */

// 15.1 基本用法
const draw = document.querySelector('#draw');
// 导出绘制图像方法：toDataURL()
let imgURL = draw.toDataURL('image/png');
let img = document.querySelector('#img');
img.src = imgURL;

// 15.2 2D上下文：Canvas 的坐标原点(0, 0)在左上角，width和height属性表示可用像素数目
const context = draw.getContext('2d');

// 15.2.1 填充(fillStyle)和描边(strokeStyle)：属性值可以是字符串、渐变对象、模式对象，默认值为'#000000'，如果是字符串，则格式同CSS。设置后，所有涉及填充和描边的操作都将使用所设置样式
context.fillStyle = '#0000ff';
context.strokeStyle = 'red';

// 15.2.2 绘制矩形：以下方法的参数为：(x, y, width, height)
// 填充矩形
context.fillStyle = '#ff0000'; // 红色
context.fillRect(10, 10, 50, 50);
context.fillStyle = 'rgba(0, 0, 255, 0.5)'; // 半透明的蓝色
context.fillRect(30, 30, 50, 50);
// 描边矩形
context.strokeStyle = '#ff0000'; // 红色
context.strokeRect(10, 100, 50, 50);
context.strokeStyle = 'rgba(0, 0, 255, 0.5)'; // 半透明的蓝色
context.strokeRect(30, 130, 50, 50);
// 清除矩形
context.clearRect(40, 40, 10, 10); // 从两个填充矩形重叠中心清除一个10x10的矩形

// 15.2.3 绘制路径
// 开始路径
context.beginPath();
// 绘制外圆
context.arc(300, 300, 99, 0, 2 * Math.PI, false);
// 绘制内圆
context.moveTo(394, 300);
context.arc(300, 300, 94, 0, 2 * Math.PI, false);
// 绘制分针
context.moveTo(300, 300);
context.lineTo(300, 215);
// 绘制时针
context.moveTo(300, 300);
context.lineTo(235, 300);
// 描边路径
context.strokeStyle = 'black';
context.stroke();
// 在路径被关闭前，确定某一点是否在路径上：isPointInPath(x, y)

// 15.2.4 绘制文本：以下方法的参数为：(TextString, x, y, (maxPixelWidth))
context.font = 'bold 14px Arial';
context.textAlign = 'center';
context.textBaseline = 'middle';
context.fillStyle = 'black';
context.fillText('12', 300, 220);
// 不同的对齐方式
context.textAlign = 'start';
context.fillText('12', 300, 240);
context.textAlign = 'end';
context.fillText('12', 300, 260);
// 计算文本大小方法：measureText(string)，返回一个TextMetrics对象
let fontsize = 100;
context.font = `${fontsize}px Arial`;
while (context.measureText('Hello World').width > 140) {
  --fontsize;
  context.font = `${fontsize}px Arial`;
}
context.fillText('Hello World', 140, 210);
context.fillText(`Font size is ${fontsize}px`, 200, 250);

// 15.2.5 变换：略
// 存取设置方法：save()：将设置入栈；restore()：在设置栈中向前返回一级
context.fillStyle = '#ff0000';
context.save();
context.fillStyle = '#00ff00';
context.save();
context.fillStyle = '#0000ff';
context.save();
context.restore();
console.log(context.fillStyle);
context.restore();
console.log(context.fillStyle);
context.restore();
console.log(context.fillStyle);

// 15.2.6 绘制图像：drawImage(<img> | <canvas>, x, y, ...)
const draw2 = document.querySelector('#draw-2');
const context2 = draw2.getContext('2d');
context2.drawImage(draw, 0, 0);

// 15.2.7 阴影
context.shadowOffsetX = 5;
context.shadowOffsetY = 5;
context.shadowBlur = 5;
context.shadowColor = 'rgba(0, 0, 0, 0.5)';
context.fillStyle = 'rgba(0, 0, 255, 0.5)';
context.fillRect(100, 30, 50, 50);
context.strokeStyle = context.fillStyle;
context.save();
context.strokeRect(160, 30, 50, 50);

// 15.2.8 渐变
// 创建渐变对象实例(linear：线性)
let gradient = context.createLinearGradient(220, 30, 270, 80);
// 指定色标
gradient.addColorStop(0, 'black');
gradient.addColorStop(1, 'yellow');
// 绘制渐变矩形(矩形与渐变的坐标必须匹配)
context.fillStyle = gradient;
context.fillRect(220, 30, 50, 50);
// 创建放射渐变
let r = Math.hypot(25, 25);
gradient = context.createRadialGradient(305, 55, r / 4, 305, 55, r);
gradient.addColorStop(0, 'white');
gradient.addColorStop(1, 'black');
context.fillStyle = gradient;
context.fillRect(280, 30, 50, 50);

// 15.2.9 模式：重复的图像，用来填充或描边图形，参数为：(<img> | <video> | <canvas>, (重复方式字符串))
// 创建模式
const patternImg = document.images[1];
const pattern = context2.createPattern(patternImg, 'repeat');
// 绘制矩形
context2.fillStyle = pattern;
context2.fillRect(0, 0, 800, 600);

// 15.2.10 使用图像数据
// 例:灰阶过滤器(黑白图像)
const draw3 = document.querySelector('#draw-3');
const context3 = draw3.getContext('2d');
img = document.images[0];
// 绘制原始图像
context3.drawImage(img, 0, 0);
// 取得图像数据
const imgData = context3.getImageData(0, 0, img.width, img.height);
const data = imgData.data;
for (let i = 0, len = data.length; i < len; i += 4) {
  let r = data[i];
  let g = data[i + 1];
  let b = data[i + 2];
  let average = Math.floor((r + g + b) / 3);
  data[i] = average;
  data[i + 1] = average;
  data[i + 2] = average;
}
// 回写图像数据并显示结果
imgData.data = data;
context3.putImageData(imgData, 0, 0);

// 15.2.11 合成
// globalAlpha：指定绘制透明度
// globalCompositionOperation：指定后绘制图形与先绘制图形的结合方式

// 15.3 WebGL：针对 canvas 的3D上下文

// 15.3.1 类型化数组

// 15.3.3 WebGL上下文
const draw4 = document.querySelector('#draw-4');
const gl = draw4.getContext('webgl');
console.log(gl);
// 操作WebGL前，一般都要用某种实色清除<canvas>，为绘图做准备
gl.clearColor(0, 0, 0, 1); // 4个参数表示rgba，为0到1之间的值，表示每种颜色的强度百分比
gl.clear(gl.COLOR_BUFFER_BIT);
// 视口定义时：WebGL视口的原点坐标(0, 0)在左下角；而在视口内部，原点坐标(0, 0)在视口中心
gl.viewport(0, 0, draw4.width, draw4.height);
// 缓冲区
let buffer = gl.createBuffer();
let vertices = new Float32Array([0, 1, 1, -1, -1, -1]);
let vertexSetCount = vertices.length / 2;
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
// 释放缓冲区内存
// gl.deleteBuffer(buffer);
// WebGL一般不抛出错误，需手动调用 gl.getError() 返回错误值常量
for (let errorCode = gl.getError(); errorCode; errorCode = gl.getError()) {
  console.log(errorCode);
}
// 着色器(shader)：WebGL有两种着色器：顶点着色器和片段着色器，着色器由GLSL编写
// 取得GLSL字符串
const vertexGlsl = document.querySelector('#vertexShader').text;
const fragmentGlsl = document.querySelector('#fragmentShader').text;
// 创建着色器对象
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexGlsl);
gl.compileShader(vertexShader);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentGlsl);
gl.compileShader(fragmentShader);
// 链接到着色器
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);
// 为着色器传入值
let uColor = gl.getUniformLocation(program, 'uColor');
gl.uniform4fv(uColor, [0, 0, 0, 1]);
let aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
gl.enableVertexAttribArray(aVertexPosition);
gl.vertexAttribPointer(aVertexPosition, 2, gl.FLOAT, false, 0, 0);
// 调试着色器
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
  console.log(gl.getShaderInfoLog(vertexShader));
}
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
  console.log(gl.getShaderInfoLog(fragmentShader));
}
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.log(gl.getProgramInfoLog(program));
}
// 绘制
gl.drawArrays(gl.TRIANGLES, 0, vertexSetCount);

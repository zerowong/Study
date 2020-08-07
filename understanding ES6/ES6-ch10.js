/* 第十章 增强的数组功能 */

// Array.of()：创建一个包含所有传入参数的数组
{
  // Array 构造器在传入单个数值参数时，指定的是数组长度
  let arr = new Array(2);
  console.log(arr.length, arr[0], arr[1]);
  let arr2 = Array.of(1, 2, ...arr, 3);
  console.log(arr2);
}

// Array.from()：将类数组对象(有数值类型索引和长度属性的对象)或可迭代对象转换为数组
// 接受3个参数：1.类数组对象或可迭代对象；2.一个回调函数，新数组中的每个元素会执行该回调函数；3.执行回调函数时的this对象
// 返回值：一个新数组
{
  const arrlike = {
    0: 'a',
    2: 'b',
    length: 3,
  };
  console.log(Array.from(arrlike));

  let foo = function () {
    return Array.from(arguments);
  };
  console.log(foo(1, 2, 'a', true));

  // 使用第二个参数：
  let PlusOne = function () {
    return Array.from(arguments, (num) => ++num);
  };
  console.log(PlusOne(1, 2, 3));

  // 使用第三个参数
  const handler = {
    diff: 1,
    add(value) {
      return value + this.diff;
    },
  };
  let bar = function () {
    return Array.from(arguments, handler.add, handler);
  };
  console.log(bar(1, 2, 3));

  // 用于可迭代对象
  let numbers = {
    *[Symbol.iterator]() {
      yield 1;
      yield 2;
      yield 3;
    },
  };
  console.log(Array.from(numbers, (num) => ++num));

  let str = 'abcde';
  console.log(Array.from(str, (ch) => ch.toUpperCase()));
}

// Array.find()和Array.findIndex()：都接受一个回调函数和一个可选的指定回调函数内部的this，前者返回第一个匹配的值，后者返回第一个匹配值的索引，都不改变原数组
{
  let arr = [1, 2, 3, 4];
  console.log(arr.find((num) => num > 2));
  console.log(arr.findIndex((num) => num > 2));
}

// Array.fill()：使用特定值填充数组的任意个元素，只传入第一个参数时填充整个数组
{
  let arr = new Array(5).fill(1);
  console.log(arr);
  console.log(arr.fill(0, 1));
  console.log(arr.fill(-1, 2, 4));
}

// Array.copyWithin()：浅复制数组的一部分到同一数组中的另一个位置，并返回它，不会改变原数组的长度
{
  let arr = [1, 2, 3, 4];
  console.log(arr.copyWithin(2, 0, 2));
}

// 常规数组：使用64位浮点格式存储数值；类型化数组：存储8种不同的数值类型的数组

// 要使用类型化数组，首先要创建数组缓冲区(Array buffer)：内存中包含一定数量字节的区域，容量无法改变
{
  let buffer = new ArrayBuffer(10); // 分配了10字节
  console.log(buffer.byteLength);
  let buffer2 = buffer.slice(0, 5);
  console.log(buffer2.byteLength);
}

// 使用视图(Views)操作数组缓冲区
{
  let timeBuffer = new ArrayBuffer(2);
  // 通用视图类型 DataView，允许操作所有8种数值类型
  let timeView = new DataView(timeBuffer);
  let view2 = new DataView(timeBuffer, 0, 1); // 前1个字节

  // 视图信息
  console.log(timeView.buffer, timeView.byteOffset, timeView.byteLength);

  // 读取和写入
  timeView.setUint8(0, 22);
  timeView.setUint8(1, 37);
  console.log(timeView.getUint8(0), timeView.getUint8(1));

  // 使用通用视图类型存取时可混用不同类型
  console.log(timeView.getInt16(0));
}

// 特定类型视图
{
  let buffer = new ArrayBuffer(2);
  let view = new Int8Array(buffer);
  // 元素大小(每个类型的单个元素所包含的字节数)
  console.log(view.BYTES_PER_ELEMENT, new Int16Array(buffer).BYTES_PER_ELEMENT);

  // 给构造器传递数值类型参数时：该数值表示数组包含的元素数量(默认为0)，构造器会创建新的缓冲区，分配正确的字节数，
  let float32 = new Float32Array(5);
  console.log(float32.length, float32.byteLength, float32.buffer);

  // 给构造器传递对象类型参数(类型化数组/数组/可迭代对象/类数组对象)时：将对象数据插入类型化数组中，使用新的数组缓冲区存储，有不匹配类型时抛出错误
  let ints1 = new Int16Array([23, 11]);
  let ints2 = new Int32Array(ints1);
  console.log(ints1.buffer === ints2.buffer);
}

// 使用扩展运算符也可类型化数组转换为常规数组
{
  let int16 = new Int16Array([1, 2]);
  let arr = [...int16];
  console.log(arr);
}

/* 
类型化数组与常规数组的差异：
1.类型化数组容量不可变
2.类型化数组的类型检查使无效值被插入时替换为0
*/

// 类型化数组的特有方法
{
  // set()：复制元素，接受一个数组参数(常规/类型化)和一个可选的起始位置(默认为0)
  let ints = new Int16Array(4);
  ints.set([1, 2]);
  ints.set([3, 4], 2);
  console.log(ints.toString());

  // subarray()：不传入参数时复制
  let copy = ints.subarray();
  let ints2 = ints.subarray(1, 3);
  console.log(copy.toString());
  console.log(ints2.toString());
}

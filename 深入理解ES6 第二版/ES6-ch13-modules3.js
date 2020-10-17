// 没有导入和导出的模块，但其对全局作用域里的内容的改变可以被共享
Array.prototype.pushAll = function (items) {
  if (!Array.isArray(items)) {
    throw new TypeError('must be an array');
  }
  return this.push(...items);
};

// 基本的导入
import { sum } from './ES6-ch13-modules1.js';
console.log(sum(1, 2));

// import 后的花括号表示从模块导入对应绑定，绑定意味着该标识符像是使用了 const 关键字，你不能再定义另一个同名变量，或导入另一个同名绑定，不能在 import 语句之前使用该标识符，也不能修改它的值

/*
from 后的为模块说明符(Module specifier)，它有以下几种格式，注意带文件类型后缀
1. 以 / 为起始，表示从根目录开始解析
2. 以 ./ 为起始，表示从当前目录开始解析
3. 以 ../ 为起始，表示从父级目录开始解析
4. URL格式
*/

// 导入多个绑定
import { color, name, magicNumber } from './ES6-ch13-modules1.js';
console.log(color, name, magicNumber);

// 完全导入一个模块：将整个模块当作单一对象导入，该模块的所有导出都作为对象的属性存在，这种导入格式称为命名空间导入(namespace import)
import * as example from './ES6-ch13-modules1.js';
console.log(example.name);

// 导入导出是静态的，你只能在顶级作用域导入和导出，不能在其它语句之内

// 导入绑定的模块不能修改绑定的值，但负责导出的模块可有随意使用该绑定
import { setName } from './ES6-ch13-modules1.js';
// 回到导出模块，执行后，两个模块的相同变量自动变化
setName('wong');
console.log(name);

// 导入重命名：前者是导入名称(import name)，后者是本地名称，必须使用本地名称(即重命名后的名称)
import { rn as rename } from './ES6-ch13-modules1.js';
console.log(rename);

// 导入默认值，可以用任意名称，可以同时导入其它绑定
import bar, { multiply } from './ES6-ch13-modules1.js';
// 默认导入也可以用重命名语法：
// import { default as bar, ... } ...

console.log(bar);
console.log(multiply(2, 4));

// 绑定的再导出：将导入的内容重新导出
import { example1 } from './ES6-ch13-modules1.js';
export { example1 };
// 更简洁的语法
export { example2 } from './ES6-ch13-modules1.js';
// 以上都支持重命名
// 将另一个模块的内容全部导出
export * from './ES6-ch13-modules1.js';

// 无绑定的导入
import './ES6-ch13-modules3.js';
let arr1 = [1, 2, 3];
let arr2 = [];
arr2.pushAll(arr1);
console.log(arr2);

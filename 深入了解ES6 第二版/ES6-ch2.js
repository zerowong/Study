/* 第二章 字符串和正则表达式 */

// 识别子串方法：includes(str, (position)), startsWith(str, (position)), endsWith(str, (endPosition));ps：在 endsWith 中，搜索起始位置为字符串长度减去第二个参数
let msg = 'Hello world';
console.log(msg.startsWith('o', 4));
console.log(msg.endsWith('o', 8));
console.log(msg.includes('o', 8));

// repeat(count)：接受一个重复次数参数，返回一个将初始字符串重复指定次数后的新字符串，参数为0，返回空串
console.log('x'.repeat(3));
console.log('x'.repeat(0));

// 复制正则表达式
const re1 = /ab/i;
// 传递了第二个参数时，覆盖原标志
const re2 = new RegExp(re1, 'g');
console.log(re1.toString(), re2.toString());

// 提取正则表达式
const re = /ab/gimsuy;
// source：表达式文本；flags：表达式标志
console.log(re.source, re.flags);

// DSL(domain-specific language)：领域专用语言

// 模板字面量(template literal)
msg = `"\`Hello\` 'world'"`;
console.log(typeof msg);

// 多行字符串
// ES6以前
msg = 'Hello \
world';
console.log(msg);

msg = 'Hello \n\
world';
console.log(msg);

msg = ['Hello', 'world'].join('\n');
console.log(msg);

msg = 'Hello \n' + 'world';
console.log(msg);

// ES6
msg = `Hello
world`;
console.log(msg);

// 替换位：${}中可以是任意js表达式，模板字面量本身也是js表达式，因此可以互相嵌套
let hello = (name, age) => {
  return `Hello, my name is ${name}${!age ? `` : `, I'm ${age} years old`}`;
};
console.log(hello('zero', 21));
console.log(hello('zero'));

// 模板标签(用标签函数自定义模板字面量的行为)
{
  function tag(literals, ...substitutions) {
    let ret = [];
    for (let i = 0, len = literals.length; i < len; ++i) {
      ret.push(literals[i]);
    }
    for (let i = 0, len = substitutions.length; i < len; ++i) {
      ret.push(substitutions[i]);
    }
    return ret;
  }
  let count = 10;
  let price = 0.25;
  let msg = tag`${count} items cost $${(count * price).toFixed(2)}.`;
  console.log(msg);
}

// 使用模板字面量的原始值(String.raw为内置标签)
msg = `Hello\nworld`;
console.log(msg);
msg = String.raw`Hello\nworld`;
console.log(msg);

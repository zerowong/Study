/* 第二十章 JSON */

// JSON(JavaScript Object Notation，JavaScript对象表示法)，一种数据

/*
20.1 语法：JSON的语法可以表示以下三种类型：
1.简单值：String，Number，Boolean，null
2.对象
3.数组
ps：JSON中不需要分号
*/

// 20.1.1 简单值：1.字符串外必须用双引号；2.数值不能有前导零；3.小数点后至少跟一位数字

// 20.1.2 对象：没有变量声明的对象字面量形式。1.键名(属性名)必须加双引号；2.值可以是任何类型；3.不允许同名属性；4.最后一个属性后不能有逗号

// 20.1.3 数组：没有变量声明的数组字面量形式。值可以是任何类型

// 20.2 解析和序列化：JSON数据结构可以直接解析为JS对象

// 20.2.1 JSON 对象。ES5中新增了该对象。有两个方法：
const foo = {
  a: 'a',
  b: ['b1', 'b2'],
  c: 3,
  d: true,
  e: null,
  f() {},
  g: undefined,
};
{
  // 把JS对象序列化为一个JSON字符串。所有值为undefined的属性，函数都会被忽略。
  const jsonText = JSON.stringify(foo);
  // 返回结果字符串中不包括空格和缩进
  console.log(jsonText);
  // 把JSON字符串解析为JS对象
  const bar = JSON.parse(jsonText);
  console.log(bar);
}

// 20.2.2 序列化选项
{
  // 1.过滤结果：第二个参数是数组，则结果只包含数组中列出的属性。需加双引号
  const jsonText = JSON.stringify(foo, ['a', 'c']);
  console.log(jsonText);
  // 参数为函数，函数参数为属性名和值。属性名只能是字符串，可以为空串。返回值为相应属性的值，返回 undefined，则忽略该属性
  const jsonText2 = JSON.stringify(foo, (key, value) => {
    switch (key) {
      case 'c':
        return 99;
      case 'd':
        return !value;
      case 'e':
        return undefined;
      default:
        return value;
    }
  });
  console.log(jsonText2);

  // 2.字符串缩进：第三个参数用于控制结果的缩进和空白符
  // 数字值：缩进级别。最大为10，超过10自动转为10
  const jsonText3 = JSON.stringify(foo, null, 2);
  console.log(jsonText3);
  // 字符串值：用作缩进字符。长度超过10则截取前10个字符
  const jsonText4 = JSON.stringify(foo, null, '--');
  console.log(jsonText4);

  // 3.toJSON()：自定义序列化。返回值自动转为字符串。可作为stingify()的第二个参数，优先级最高
  foo.toJSON = function () {
    return 1;
  };
  const jsonText5 = JSON.stringify(foo);
  console.log(jsonText5);
}

// 20.2.3 解析选项
{
  foo.toJSON = undefined;
  foo.releaseDate = new Date(2020, 8, 9);
  // parse() 方法的第二个参数为一个还原函数，该函数接受(key, value)，返回一个值，若返回值为 undefined，则从结果中删除相应的键
  const jsonText = JSON.stringify(foo);
  const ret = JSON.parse(jsonText, (key, value) => {
    if (key === 'releaseDate') {
      return new Date(value);
    }
    return value;
  });
  console.log(ret);
}

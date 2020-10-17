/* 解构(destructuring)：更方便的数据访问 */

// 对象解构
{
  const foo = {
    a: 0,
    b: 1,
  };
  let { a, b } = foo;
  console.log(a, b);
  // 相当于：
  // let a = foo.a;
  // let b = foo.b;

  // 解构赋值
  const bar = {
    a: 2,
    b: 2,
  };
  // 必须用圆括号包裹
  ({ a, b } = bar);
  console.log(a, b);

  // 解构赋值表达式的右侧为该表达式的值，任何使用值的地方都可以用解构赋值表达式
  let isObj = (obj) => console.log(obj instanceof Object);
  isObj(({ a, b } = foo));
  // 此处执行的操作：1.解构赋值；2.将表达式值(foo)传给了函数
  console.log(a, b);

  // 解构时，如果指定的本地变量没有在对象中找到同名属性，则该变量赋值为 undefined
  ({ a, b, c } = bar);
  console.log(c);

  // 解构默认值：未找到同名属性时使用默认值
  ({ a, b, c = 0 } = bar);
  console.log(c);

  // 使用不同名变量，同时也可使用默认值
  let { a: e, b: f, c: g = 0 } = foo;
  console.log(e, f, g);

  // 嵌套的对象解构
  const node = {
    type: 'none',
    name: 'foo',
    loc: {
      start: {
        line: 1,
        column: 1,
      },
      end: {
        line: 2,
        column: 2,
      },
    },
  };
  // 提取 node.loc.start.line 和 node.loc.start.column
  let {
    loc: {
      start: { line, column },
    },
  } = node;
  console.log(line, column);
}

// 数组解构
{
  const foo = [1, 2, 3];
  let [first, second] = foo;
  console.log(first, second);

  // 选择性解构
  let [, , third] = foo;
  console.log(third);

  // 解构赋值，无需圆括号
  const bar = ['1', '2', '3'];
  [first, , third] = bar;
  console.log(first, third);

  // 使用数组解构交换两个变量的值
  let a = 1,
    b = 2;
  [a, b] = [b, a];
  console.log(a, b);

  // 数组解构同样可用使用默认值：当指定位置的项不存在或为undefined时使用默认值
  const baz = [1, undefined];
  let [one, two = 2, three = 3] = baz;
  console.log(one, two, three);

  // 嵌套解构：
  const color = ['red', ['green', 'black'], 'blue'];
  let [level11, [level21, level22], level12] = color;
  console.log(level11, level12, level21, level22);

  // 剩余项(rest items)：必须是最后部分
  const foobar = [1, 2, 3];
  let [firstItem, ...restItems] = foobar;
  console.log(firstItem, restItems.length);

  // 使用剩余项复制数组
  const [...foobarCopy] = foobar;
  console.log(foobarCopy);
}

// 混合解构
{
  const node = {
    type: 'none',
    name: 'foo',
    loc: {
      start: {
        line: 1,
        column: 1,
      },
      end: {
        line: 2,
        column: 2,
      },
    },
    range: [0, 3],
  };
  // 提取 node.loc.start 和 node.range[0]
  let {
    loc: { start },
    range: [min],
  } = node;
  console.log(start, min);

  const foo = [1, node, 3];
  [
    ,
    {
      loc: { start },
      range: [min],
    },
  ] = foo;
  console.log(start, min);
}

// 参数解构
{
  // 使用解构提供可选参数
  let setCookie = (name, value, { secure = false, path = '/', domain, expires } = {}) => {};
  setCookie('type', 'js');
}

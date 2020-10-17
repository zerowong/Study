/* 第七章 Set 和 Map */

// Set：无重复值的有序列表，键的比较使用Objec.is()(ps：+0和-0在Set中是相等的)

// 创建Set并添加项目
{
  let set = new Set();
  set.add(5);
  set.add('5');
  // 添加已有的值时将被忽略
  set.add(5);
  // 相同的对象视为不同值
  set.add({});
  set.add({});
  console.log(set.size);
}

// 使用数组初始化Set(自动去重)
{
  let set = new Set([1, 1, 1, 2, 3]);
  console.log(set.size);
}

// 移除值
{
  let set = new Set();
  set.add(5);
  set.add('5');
  if (set.has(5)) {
    set.delete(5);
    console.log(set.size);
  }
  set.clear();
  console.log(set.size);
}

// Set.forEach()
{
  let set = new Set([1, 2, 3, 4, 4]);
  let sum = 0;
  set.forEach((value) => (sum += value));
  console.log(sum);
}

// 使用扩展运算符将Set转换为数组
{
  let set = new Set([1, 1, 1, 1, 2]);
  let arr = [...set];
  console.log(arr);
}

// WeakSet：相比于Set复制并保存对象，WeakSet只允许保存对象弱引用
// 与 Set 的差异：1.add()非对象时抛出错误，has(), delete()接受非对象参数时返回 false；2.不可迭代，没有迭代器，没有forEach()，没有size
{
  let obj1 = {};
  let obj2 = {};
  let weakset = new WeakSet([obj1, obj2]);
  // 移除对象的最后一个强引用，同时从WeakSet中移除
  obj1 = null;
  obj2 = null;
  let obj3 = {};
  weakset.add(obj3);
  weakset.delete(obj3);
  obj3 = null;
}

// Map：键值对的有序列表，键和值都可以是任何类型，键的比较使用 Object.is()，同样的：+0和-0在Map中为相同值
{
  let map = new Map();
  // 添加项
  map.set('name', 'zero');
  map.set('age', 21);
  // 根据键提取值，如不存在，则返回 undefined
  console.log(map.get('name'));
  console.log(map.get('age'));
  // 将对象作为键
  let obj1 = {};
  let obj2 = {};
  map.set(obj1, 'obj1');
  map.set(obj2, 'obj2');
  console.log(map.get(obj1));
  console.log(map.get(obj2));
  // 同样有 has(), delete(), clear() 方法
}

// 使用数组初始化Map
{
  let map = new Map([
    ['name', 'zero'],
    ['age', 21],
  ]);
}

// Map.forEach()
{
  let map = new Map([
    ['foo', true],
    ['bar', false],
  ]);
  map.forEach((value, key) => console.log(`map['${key}'] = ${value}`));
}

// WeakMap：大致与 WeakSet 相同。需要注意的是，WeakMap 的键只保存对象弱引用，但值可以是任意类型，如果值保存了对象，同样会阻止垃圾回收
{
  let obj1 = {};
  let obj2 = {};
  let weakmap = new WeakMap([
    [obj1, 1],
    [obj2, 2],
  ]);
  let obj3 = {};
  weakmap.set(obj3, 3);
}

// 使用 WeakMap 创建对象的私有数据
{
  let Person = (function () {
    let privateData = new WeakMap();
    function Person(name) {
      privateData.set(this, { name });
    }
    Person.prototype.getName = function () {
      return privateData.get(this).name;
    };
    return Person;
  })();
  let me = new Person('zero');
  console.log(me.getName());
}

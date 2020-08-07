/* 第十二章 代理与反射接口 */

// 代理(proxy)：创建一个代理用来替代另一个对象(称为目标对象)，这个代理对目标对象进行了虚拟，因此该代理可被当作目标对象来对待。代理允许你拦截目标对象的底层操作，拦截行为使用了一个能响应特定操作的函数(称为陷阱函数)。

// 反射(reflect)：底层操作的默认行为的集合，能被代理重载，每个代理陷阱函数都对应一个反射方法

// 创建代理：Proxy 构造器接受两个参数：1.目标对象；2.一个定义了陷阱函数的对象。第二个参数不提供任何陷阱函数时，代理对所有操作采用默认行为
{
  const target = {};
  const proxy = new Proxy(target, {});
  proxy.name = 'proxy';
  console.log(proxy.name, target.name);
  target.name = 'target';
  console.log(proxy.name, target.name);
}

// 使用 set 陷阱函数重载设置属性值的默认行为
/* 
陷阱函数参数：
1. trapTarget：接受属性的对象(即目标对象)
2. key：需要写入的属性的键(字符串或符号)
3. value：属性值
4. receiver：操作发生的对象(通常是代理对象)
*/
// Reflect.set()：set 操作的默认行为
// 例：对象属性值验证
{
  const target = {
    name: 'target',
  };
  const proxy = new Proxy(target, {
    set(trapTarget, key, value, receiver) {
      // 忽略已有属性
      if (!trapTarget.hasOwnProperty(key)) {
        if (Number.isNaN(Number(value))) {
          throw new TypeError('must be a number');
        }
      }
      return Reflect.set(trapTarget, key, value, receiver);
    },
  });

  proxy.newProperty1 = 1;
  console.log(proxy.newProperty1, target.newProperty1);
  try {
    proxy.newProperty2 = 'a';
  } catch (ex) {
    console.error(ex.message);
  }
}

// 使用 get 陷阱函数重载读取属性值的默认行为
// 例：对象外形验证：对象外形(Object Shape)指的是对象已有属性和方法的集合。JS读取对象不存在的属性时不会抛出错误，而是把 undefined 当作该属性的值
{
  const target = {
    name: 'target',
  };
  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      if (!(key in receiver)) {
        throw new TypeError(`Property ${key} doesn't exist`);
      }
      return Reflect.get(target, key, receiver);
    },
  });
  try {
    proxy.a;
  } catch (ex) {
    console.error(ex.message);
  }
}

// 使用 has 陷阱函数重载 in 运算符的默认行为(判断对象及其原型是否存在某个属性)
// 例：隐藏属性
{
  const target = {
    name: 'target',
    value: 1,
  };
  const proxy = new Proxy(target, {
    has(target, key) {
      if (key === 'value') return false;
      return Reflect.has(target, key);
    },
  });
  console.log('value' in proxy);
}

// 使用 deleteProperty 陷阱函数重载 delete 运算符的默认行为(删除对象属性)
// 例：设置不可删除属性
{
  const target = {
    name: 'target',
  };
  const proxy = new Proxy(target, {
    deleteProperty(target, key) {
      if (key === 'name') return false;
      return Reflect.deleteProperty(target, key);
    },
  });
  delete proxy.name;
  console.log(proxy.name);
}

// 原型代理的陷阱函数
// 例：使代理对象的原型无法被设置
{
  const target = {};
  const proxy = new Proxy(target, {
    getPrototypeOf(target) {
      return null;
    },
    setPrototypeOf(target, proto) {
      return false;
    },
  });
  let proxyProto = Object.getPrototypeOf(proxy);
  console.log(proxyProto);

  // 目标对象原型可设置
  Object.setPrototypeOf(target, {});
  // 代理对象原型不可设置
  try {
    Object.setPrototypeOf(proxy, {});
  } catch (ex) {
    console.error(ex.message);
  }
}

// 对象可扩展性的陷阱函数
{
  const target = {};
  const proxy = new Proxy(target, {
    isExtensible(target) {
      return Reflect.isExtensible(target);
    },
    preventExtensions(target) {
      return false;
    },
  });
  console.log(Object.isExtensible(proxy), Object.isExtensible(target));
  try {
    Object.preventExtensions(proxy);
  } catch (ex) {}
  console.log(Object.isExtensible(proxy), Object.isExtensible(target));
}

// 属性描述符的陷阱函数
// 描述符对象参数只能是：enumerable, configurable, value, writable, get, set
// 例：禁止定义符号类型的属性
{
  const target = {};
  const proxy = new Proxy(target, {
    defineProperty(target, key, descriptor) {
      if (typeof key === 'symbol') {
        return false;
      }
      return Reflect.defineProperty(target, key, descriptor);
    },
  });
  let namesymbol = Symbol('name');
  try {
    Object.defineProperty(proxy, namesymbol, {
      value: 'proxy',
    });
  } catch (ex) {
    console.error(ex.message);
  }
}

// ownKeys 陷阱函数
// 例：在相关方法中(4种获取属性键的方法和for-in)过滤下划线开的的属性键
{
  const target = {
    a: 1,
    b: 1,
    c: 1,
    _d: 1,
    _e: 1,
  };
  const proxy = new Proxy(target, {
    ownKeys(target) {
      return Reflect.ownKeys(target).filter((key) => {
        return key[0] !== '_';
      });
    },
  });
  console.log(Object.keys(proxy));
}

// 使用 apply 与 construct 陷阱函数的函数代理(重载使用 new 调用函数和直接调用函数的默认行为)
// 例：验证函数参数
{
  const sum = function (...value) {
    return value.reduce((pre, cur) => pre + cur, 0);
  };
  const sumProxy = new Proxy(sum, {
    apply(target, thisArg, argArray) {
      argArray.forEach((arg) => {
        if (typeof arg !== 'number') {
          throw new TypeError('all arguments must be numbers');
        }
      });
      return Reflect.apply(target, thisArg, argArray);
    },
    construct(target, argArray, newTarget) {
      throw new TypeError("this function can't be called with new");
    },
  });
  console.log(sumProxy(1, 2, 3));
  try {
    console.log(sumProxy(1, '1', 2));
  } catch (ex) {
    console.error(ex.message);
  }
  try {
    let ret = new sumProxy(1, 2, 3);
  } catch (ex) {
    console.error(ex.message);
  }
}

// 可被撤销的代理。使用 Proxy 构造器创建的代理是不可撤销的
{
  const target = {
    name: 'target',
  };
  // proxy：可被撤销的代理对象；revoke()：用于撤销代理的函数
  const { proxy, revoke } = Proxy.revocable(target, {});
  console.log(proxy.name);

  // 该函数执行后，代理就无法使用了
  revoke();
  try {
    console.log(proxy.name);
  } catch (ex) {
    console.error(ex.message);
  }
}

// 模拟数组
{
  // 检查数组索引是否合法
  const toUint32 = function (value) {
    return Math.floor(Math.abs(Number(value))) % 2 ** 32;
  };
  const isArrayIndex = function (key) {
    let numerickey = toUint32(key);
    return String(numerickey) == key && numerickey < 2 ** 32 - 1;
  };
  const createMyArray = function (length = 0) {
    return new Proxy(
      { length },
      {
        set(target, key, value) {
          let len = Reflect.get(target, 'length');

          // 增加元素是更新长度
          if (isArrayIndex(key)) {
            let numerickey = Number(key);
            if (numerickey >= len) {
              return Reflect.set(target, 'length', numerickey + 1);
            }

            // 减少长度时移除元素
          } else if (key === 'lenght') {
            if (value < len) {
              for (let i = len - 1; i >= value; --i) {
                Reflect.deleteProperty(target, i);
              }
            }
          }
          return Reflect.set(target, key, value);
        },
      }
    );
  };
  let arr = createMyArray(3);
  console.log(arr.length);
  arr[10] = 1;
  console.log(arr.length);
  arr.length = 10;
  console.log(arr[10]);

  // 类封装
  class MyArray {
    constructor(length = 0) {
      this.length = length;
      return new Proxy(
        { length },
        {
          set(target, key, value) {
            let len = Reflect.get(target, 'length');

            // 增加元素是更新长度
            if (isArrayIndex(key)) {
              let numerickey = Number(key);
              if (numerickey >= len) {
                return Reflect.set(target, 'length', numerickey + 1);
              }

              // 减少长度时移除元素
            } else if (key === 'lenght') {
              if (value < len) {
                for (let i = len - 1; i >= value; --i) {
                  Reflect.deleteProperty(target, i);
                }
              }
            }
            return Reflect.set(target, key, value);
          },
        }
      );
    }
  }
  let arr2 = new MyArray(3);
  console.log(arr2);
  console.log(arr2.length);
  arr2[10] = 1;
  console.log(arr2.length);
  arr2.length = 10;
  console.log(arr2[10]);
}

// 代理对象能作为对象原型，但有很多限制，但以下陷阱函数可以使用：get, set, has

// 将代理作为类的原型。类不能直接修改原型，它的 prototype 属性是不可写入的，但具有间接的方法
{
  // 先创建一个ES5风格的类
  function NoSuchProperty() {}
  // 将其原型设为代理
  NoSuchProperty.prototype = new Proxy(
    {},
    {
      get(target, key, receiver) {
        throw new ReferenceError(`${key} doesn't exist`);
      },
    }
  );
  // 创建一个类继承它
  class Squre extends NoSuchProperty {
    constructor(length, width) {
      super();
      this.length = length;
      this.width = width;
    }
  }
  let foo = new Squre(2, 6);
  console.log(foo.length * foo.width);
  try {
    foo.len;
  } catch (ex) {
    console.error(ex.message);
  }
}

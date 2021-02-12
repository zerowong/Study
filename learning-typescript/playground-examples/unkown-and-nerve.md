## Unknown

> 原文链接：<https://www.typescriptlang.org/play#example/unknown-and-never>

`unknown`是一种一旦理解就可以找到相当多的用途的类型。它像是 `any` 类型的兄弟类型。`any` 允许含糊不清，而`unknown`则需要具体的细节。

一个很好的例子就是封装一个 JSON 解析器。JSON 数据可以有很多不同的形式，而 json 解析函数的创建者不会知道调用该函数的人会传入什么样的数据

```ts
const jsonParser = (jsonString: string) => JSON.parse(jsonString)

const myAccount = jsonParser('{ "name": "zerowong" }')

myAccount.name
myAccount.email
```

如果你把鼠标悬停在 jsonParser 上，你可以看到它的返回类型是 any，那么 myAccount 也是如此。可以用 `Generics`(泛型) 来解决这个问题，但也可以用 `unknown` 来解决这个问题。

```ts
const jsonParserUnknown = (jsonString: string): unknown => JSON.parse(jsonString)

const myOhterAccount = jsonParserUnknown('{ "name": "zerowong" }')

// 报错
myOhterAccount.name
```

在类型被声明给 TypeScript 之前，不能使用对象 myOtherAccount。这可以用来确保 API 使用者预先考虑他们的类型。

```ts
type User = { name: string }
const MyUserAccount = jsonParserUnknown('{ "name": "zerowong" }') as User
// 不报错
MyUserAccount.name
```

`unknown`是一个很好的工具，想了解更多请看这些：

<https://mariusschulz.com/blog/the-unknown-type-in-typescript>

<https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type>

## Nerve

因为 TypeScript 支持代码流分析，所以它需要能够表示什么时候代码在逻辑上不会发生。例如，这个函数不会返回

```ts
const nerveReturns = () => {
  // 如果这个函数在第一行就抛出
  throw new Error('Always thorws, nerve returns')
}
```

如果你把鼠标悬停在这个函数上，你会看到它是一个`() => never`类型，这意味着“函数返回”不会发生。这些值仍然可以像其他值一样被传递

```ts
const myValue = nerveReturns()
```

当处理 JavaScript 运行时的不可预测性和可能不使用类型的 API 使用者时，拥有一个永不返回的函数是很有用的。

```ts
interface User {
  name: string
}

const validateUser = (user: User) => {
  if (user) {
    return user.name !== 'NaN'
  }
  // 根据类型系统，这个代码路径到达不了，这与neverReturns的返回类型相吻合
  return nerveReturns()
}
```

类型定义中规定了`user`必须被传进来，但是在 JavaScript 中，有足够多的转换方法，因此你不能保证它如预期那样

使用返回`never`的函数可以让你在不可能的地方(应该指运行时到达不了的代码段)添加额外的代码。这对于显示更好的错误信息，或者关闭文件或循环等资源是很有用的。

`never`的一个非常流行的用法是确保一个`switch`是穷尽的。例如，每条路径都被覆盖了。

这里有一个`enum`和一个穷尽的`switch`，试着在`enum`中加入一个新的选项（比如：郁金香？)

```ts
enum Flower {
  Rose,
  Rhododendron,
  Violet,
  Daisy,
}

const flowerLatinName = (flower: Flower) => {
  switch (flower) {
    case Flower.Rose:
      return 'Rosa rubiginosa'
    case Flower.Rhododendron:
      return 'Rhododendron ferrugineum'
    case Flower.Violet:
      return 'Viola reichenbachiana'
    case Flower.Daisy:
      return 'Bellis perennis'
    default:
      const _exhaustiveCheck: never = flower
      return _exhaustiveCheck
  }
}
```

你会得到一个编译器错误：不能将类型“Flower”分配给类型“never”。

## Unions 中的 Nerve

在`union`类型中，`nerve`会被自动删除

```ts
type nerveIsRemoved = number | never | string
```

如果你看一下 NeverIsRemoved 的类型，你会发现它是 `string | number`。这是因为`never`应该在运行时永远不会发生，因此你不能分配给它。

这个功能在 [conditional-types] 中被大量使用。

[conditional-types]: ./conditional-types.md

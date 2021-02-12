# 声明对象外形(the shape of an object)的两种方式：`interface`和`type`别名

> 原文链接: <https://www.typescriptlang.org/play/?e=83#example/types-vs-interfaces>

- 两种方式大体上是相同的

```ts
type BirdType = {
  wings: number
}

interface BirdInterface {
  wings: number
}

const bird1: BirdType = { wings: 2 }
const bird2: BirdInterface = { wings: 2 }
```

- 因为 TypeScript 是结构类型系统，所以可以混合使用两种类型

```ts
const bird3: BirdInterface = bird1
```

- 它们都支持扩展其它`interface`和`type`。`type`通过运算符`&`来实现，而`interface`则具有`extends`关键字

```ts
type Owl = { nocturnal: true } & BirdType
type Robin = { nocturnal: false } & BirdInterface

interface Peacock extends BirdType {
  colourful: true
  flies: false
}

interface Chicken extends BirdInterface {
  colourful: false
  flies: false
}

let owl: Owl = { wings: 2, nocturnal: true }
let chicken: Chicken = { wings: 2, colourful: false, flies: false }
```

- 推荐使用`interface`而不是`type`。具体来说，使用前者将获得更好的错误提示。如果将鼠标悬停在以下错误上，则可以看到在使用`interface`时 TypeScript 如何提供更简短的信息

```ts
// 不能将类型“Chicken”分配给类型“Owl”。类型 "Chicken" 中缺少属性 "nocturnal"，但类型 "{ nocturnal: true; }" 中需要该属性
owl = chicken
// 类型“Owl”缺少类型“Chicken”中的以下属性: colourful, flies
chicken = owl
```

- `type`与`interface`之间的另一个主要区别在于`interface`是开放的，`type`是封闭的。`interface`可以通过多次声明来扩展它，而`type`则不能。

```ts
interface Kitten {
  purrs: boolean
}

interface Kitten {
  color: string
}

const kitten: Kitten = { purrs: true, color: 'white' }

type Puppy = {
  color: string
}

// 标识符“Puppy”重复
type Puppy = {
  toys: number
}
```

- 其它的一些小的区别

1. `type`需要`=`号，`interface`不需要
2. 在 vscode 上，鼠标查看`type`会显示属性，`interface`不会

根据需求，这些差异可能是正面的也可能是负面的。
但是对于公开暴露的类型，最好将它们设置为`interface`。
如果想要查看`type`与`interface`有关的更多 edge cases，
可以去 stack overflow 的[这个页面](https://stackoverflow.com/questions/37233735/typescript-interfaces-vs-types/52682220#52682220)

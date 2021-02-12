# 条件类型

> 原文链接 <https://www.typescriptlang.org/play/?q=195#example/conditional-types>

条件类型提供了一种在 TypeScript 类型系统中执行简单逻辑的方法。这是一项高级功能，在日常代码中通常较少使用该方法。

一个条件类型看起来像这样：`A entends B ? C : D`

其中条件是一个表示类型是否扩展的表达式，根据真假返回指定类型。

让我们来看一些示例，为简洁起见，我们将使用单个字母来表示泛型

```ts
type Cat = { meows: true }
type Dog = { barks: true }
type Cheetah = { meows: true; fast: true }
type Wolf = { barks: true; howls: true }
```

我们可以创建一个条件类型，该条件类型提取仅符合`barks: true`字段的类型

```ts
type ExtractDogish<A> = A extends { barks: true } ? A : never
```

然后我们可以创建由`ExtractDogish`包装的类型

`Cat`类型没有`barks: true`字段，所以它将返回`never`

```ts
type NeverCat = ExtractDogish<Cat>
```

相反，这里返回了`Wolf`类型

```ts
type Wolfish = ExtractDogish<Wolf>
```

当你要使用多种类型的联合(union)并减少联合中潜在选项的数量时，此功能将非常有用

```ts
type Animals = Cat | Dog | Cheetah | Wolf
```

当你把`ExtractDogish`应用到一个联合类型时，它就像对联合的每个成员运行执行一次条件类型运算一样。

```ts
type Dogish = ExtractDogish<Animals>
// = ExtractDogish<Cat> | ExtractDogish<Dog> |
//   ExtractDogish<Cheetah> | ExtractDogish<Wolf>
//
// = never | Dog | never | Wolf
//
// = Dog | Wolf
```

这被称为分布式条件类型，因为该类型分布在联合的每个成员上。

#### 延迟(惰性)条件类型

条件类型可用于增强你的 API，这些 API 可以根据输入返回不同的类型。
例如下面函数可以根据传入的布尔值返回`string`或`number`

```ts
declare function getID<T extends boolean>(fancy: T): T extends true ? string : number
```

然后类型系统根据传入的布尔值，你会得到不同的返回类型。

```ts
let stringReturnValue = getID(true)
let numberReturnValue = getID(false)
let stringOrNumber = getID(Math.random() < 0.5)
```

在上面这种情况下，TypeScript 可以立即知道返回值。然而，你可以在还参数未知类型的函数中使用条件类型。这就是所谓的延迟条件类型

与上面的`Dogish`作用相同，但在这里是函数

```ts
declare function isCatish<T>(x: T): T extends { meows: true } ? T : undefined
```

在条件类型中，有一个额外的有用工具，就是能够特别告诉 TypeScript 在延迟时应该推断类型。那就是`infer`关键字。`infer`通常用于创建元类型，它可以检查你的代码中现有的类型，把它视为在类型内部创建一个新的变量。

```ts
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : T
```

大致上是这样的：

- 这是一个称为`GetReturnValue`的条件通用类型，其第一个参数带有一个类型
- 条件检查类型是否为函数，如果是，则根据该函数的返回值创建一个称为 R 的新类型
- 如果检查通过，则类型值为推断的返回值，否则为原始类型

```ts
type GetIDReturn = GetReturnType<typeof getID>
```

下面对函数的类型检查没有通过，只会返回传入的类型

```ts
type GetCat = GetReturnType<Cat>
```

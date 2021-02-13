# TypeScript for JavaScript Programmers

> 原文链接：<https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html>

TypeScript 与 JavaScript 有着不寻常的关系。 TypeScript 提供 JavaScript 的所有功能，并在这些功能的基础上附加一层：TypeScript 的类型系统。

例如，JavaScript 提供了诸如字符串，数字和对象之类的语言原语(language primitives)，但它不会检查你是否始终如一地分配了它们。TypeScript 可以。

这意味着你现有的有效 JavaScript 代码也是 TypeScript 代码。 TypeScript 的主要优点在于，它可以突出显示代码中的意外行为，从而减少错误的机会。

本教程简要介绍 TypeScript，重点介绍其类型系统。

## 类型推断

TypeScript 能理解 JavaScript，并会在许多情况下为你生成类型。例如，在创建变量并分配了特定值时，TypeScript 将使用该值的类型作为其类型。

```ts
let helloWorld = 'hello world'
// 等效于 let helloWorld: string
```

通过理解 JavaScript 的工作原理，TypeScript 可以构建一个接受具有类型的 JavaScript 代码的类型系统。 这提供了一个无需添加额外的字符来使代码中的类型明确的类型系统。 这就是 TypeScript 在上面的示例中知道 helloWorld 是字符串的方式。

你可能已经在用 VSCode 写 JavaScript，并带有自动补全功能。 VSCode 在后台使用 TypeScript 使其更易于使用 JavaScript。

## 定义类型

你可以在 JavaScript 中使用多种设计模式。但是，某些设计模式使自动推断类型变得困难（例如，使用动态编程的模式）。为了覆盖这些情况，TypeScript 支持 JavaScript 的扩展，它提供了一些方法让你告诉 TypeScript 一个变量应该是什么类型。

例如，要创建一个具有推断类型的对象，其中包括 `name: string` 和 `id: number`，你可以这样写：

```ts
const user = {
  name: 'Hayes',
  id: 0,
}
```

你可以使用`interface`声明显式地描述这个对象的外形(object's shape)。

```ts
interface User {
  name: string
  id: number
}
```

然后你可以通过使用`variable: TypeName`的语法来声明一个符合你的新`interface`的外形的 JavaScript 对象

```ts
const user: User = {
  name: 'Hayes',
  id: 0,
}
```

如果提供的对象与提供的`interface`不匹配，TypeScript 将警告你：

```ts
// 不能将类型“{ username: string; id: number; }”分配给类型“User”。对象字面量只能指定已知属性，并且“username”不在类型“User”中
const user: User = {
  username: 'Hayes',
  id: 0,
}
```

由于 JavaScript 支持类和面向对象的编程，因此 TypeScript 也支持。 你可以对类使用接口声明：

```ts
interface User {
  name: string
  id: number
}

class UserAccount {
  name: string
  id: number

  constructor(name: string, id: number) {
    this.name = name
    this.id = id
  }
}

const user: User = new UserAccount('Murpht', 0)
```

你可以使用接口来注释函数的参数和返回值：

```ts
function getAdminUser(): User {
  // ...
}

function deleteUser(user: User) {
  // ...
}
```

JavaScript 中已经有一小部分原始类型可用：`boolean`、`bigint`、`null`、`number`、`string`、`symbol`、`object` 和 `undefined`，你可以在接口中使用它们。TypeScript 扩展了它们，增加了一些类型，比如 `any`（允许任何类型）、[unknown]（确保使用这个类型的人声明这个类型是什么）、[never]（不可能出现的类型）和 void（返回`undefined`或没有返回值的函数）。

你会看到有两种构建类型的语法：[interface 和 type]。你应该更喜欢`interface`。当你需要特定的功能时，请使用`type`。

## 组合类型

使用 TypeScript，你可以通过组合简单的类型来创建复杂的类型。有两种主要的方法：使用 Unions(联合) 和使用 Generics(泛型)。

### 联合

通过联合，你可以声明一个类型为多种类型中的一种。例如，你可以将一个`boolean`类型描述为`true`或`false`。

```ts
type MyBool = true | false
```

注意：如果你把鼠标悬停在上面的`MyBool`上，你会发现它被归类为 `boolean`。这是结构类型系统的一个属性。下面会有更多的介绍。

联合类型的一个流行用法是描述一个`string`或`number`[字面量]的允许值集合。

```ts
type WindowStates = 'open' | 'closed' | 'minimized'
type LockStates = 'locked' | 'unlocked'
type OddNumbersUnderTen = 1 | 3 | 5 | 7 | 9
```

联合也提供了一种处理不同类型的方法。例如，你可能有一个函数，接受一个`array`或一个`string`参数

```ts
function getLength(obj: string | string[]) {
  return obj.length
}
```

要了解一个变量的类型，使用`typeof`：
| Type | Predicate |
| ---- | --------- |
| string | `typeofs === "string"` |
| number | `typeof n === "number"` |
| boolean | `typeof b === "boolean"` |
| undefined | `typeof undefined === "undefined"` |
| function | `typeof f === "function"` |
| array | `Array.isArray(a)` |

例如，你可以根据传递给你的是字符串还是数组，让函数返回不同的值。

```ts
function wrapInArray(obj: string | string[]) {
  if (typeof obj === 'string') {
    return [obj]
  } else {
    return obj
  }
}
```

### 泛型

泛型为类型提供变量。一个常见的例子是数组。没有泛型的数组可以包含任何内容。 具有泛型的数组可以描述该数组包含的值。

```ts
type StringArray = Array<string>
type NumberArray = Array<number>
type ObjectWithNameArray = Array<{ name: string }>
```

你可以声明自己的使用泛型的类型：

```ts
interface Backpack<Type> {
  add: (obj: Type) => void
  get: () => Type
}

// 这一行是一个快捷方式，用来告诉TypeScript有一个叫做'backpack’的常量，而不用担心它的来源
declare const backpack: Backpack<string>

// object是一个字符串，因为我们在上面声明它是'Backpack'的变量部分
const object = backpack.get()

// 因为'backpack'变量是一个字符串，所以你不能向'add'函数传递一个number类型的变量
backpack.add(23)
```

## 结构类型系统

TypeScript 的核心原则之一是类型检查的重点是值具有的外形(shape)。 有时称为'duck typing'(动态类型?)或'结构类型'。

在结构类型系统中，如果两个对象具有相同的外形，则将它们视为相同的类型

```ts
interface Point {
  x: number
  y: number
}

function logPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`)
}

const point = { x: 12, y: 16 }
logPoint(point)
```

`point`变量并未被声明为`Point`类型。然而，TypeScript 会在类型检查中比较`point`的外形和`Point`的外形。它们具有相同的外形，所以代码通过了。

外形匹配只需要对象的字段子集匹配即可

```ts
const anotherPoint = { x: 12, y: 26, z: 89 }
logPoint(anotherPoint)

const rect = { x: 33, y: 3, width: 30, height: 80 }
logPoint(rect)

const color = { hex: '#000' }
logPoint(color)
// 报错：类型“{ hex: string; }”的参数不能赋给类型“Point”的参数。
// 类型“{ hex: string; }”缺少类型“Point”中的以下属性: x, y
```

类和对象就如何匹配外形之间没有区别

```ts
class VirtualPoint {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

const newPoint = new VirtualPoint(1, 1)
logPoint(newPoint)
```

如果对象或类有所有所需的属性，TypeScript 就认定它们是匹配的，不管实现细节如何。

## 下一步

这是日常 TypeScript 中使用的语法和工具的简要概述。从这里，你可以：

- 从头到尾阅读整本[手册](30 分钟)
- 探索 [Playground 示例]

[unknown]: ../playground-examples/unkown-and-nerve.md
[never]: ../playground-examples/unkown-and-nerve.md
[interface 和 type]: ../playground-examples/Interfaces-and-types.md
[字面量]: ../HnadBook/Literal-Types.md
[手册]: ../HandBook
[playground 示例]: ../playground-examples

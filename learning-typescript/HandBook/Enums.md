# 枚举

> 原文：<https://www.typescriptlang.org/docs/handbook/enums.html>

枚举是 TypeScript 具有的不是 JavaScript 的类型级扩展的少数功能之一。

枚举允许开发人员定义一组命名常量。使用枚举可以更轻松地记录意图或创建一组不同的 case。TypeScript 提供数字枚举和基于字符串的枚举。

## 数字枚举

我们首先从数字枚举开始，如果你使用过其它语言，可能会更熟悉。可以使用`enum`关键字定义一个枚举。

```ts
enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}
```

上面，我们有一个数值枚举，其中`Up`被初始化为`1`，下面所有的成员都从这里开始自动递增。换句话说，`Direction.Up`的值是`1`，`Down`的值是`2`，`Left`的值是`3`，`Right`的值是`4`。

如果我们愿意，我们可以完全不使用初始化器。

```ts
enum Direction {
  Up,
  Down,
  Left,
  Right,
}
```

这里，`Up`的值是`0`，`Down`的值是`1`，等等。这种自动递增的行为在我们可能不关心成员值本身，但关心每个值与同一枚举中的其它值不同的情况下非常有用。

使用一个枚举很简单：只需将任何成员作为枚举本身的一个属性来访问，并使用枚举的名称来声明类型：

```ts
enum UserResponse {
  No = 0,
  Yes = 1,
}

function respond(recipient: string, message: UserResponse): void {
  // ...
}

respond('Princess Caroline', UserResponse.Yes)
```

数值枚举可以混合在[计算成员和常量成员中(见下文)](#计算成员和常量成员)。简而言之，没有初始化器的枚举要么需要在首位，要么必须在用数值常量或其它常量枚举成员初始化的数值枚举之后。换句话说，以下情况是不允许的：

```ts
const getSomeValue = () => 23
enum E {
  A = getSomeValue(),
  B,
  // 错误: 枚举成员必须具有初始化表达式
}
```

## 字符串枚举

字符串枚举是一个类似的概念，但有一些微妙的[运行时差异](#运行时枚举)，如下文所述。在字符串枚举中，每个成员必须用一个字符串字面量或另一个字符串枚举成员进行常量初始化。

```ts
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}
```

虽然字符串枚举没有自动递增的行为，但字符串枚举的好处是可以很好地“序列化”。 换句话说，如果你正在调试并且必须读取数字枚举的运行时值，则该值通常是不透明的-它本身并不能传达任何有用的含义(尽管[反向映射](#反向映射)通常可以提供帮助)，字符串枚举允许你在你的代码运行时提供有意义且可读的值，而与枚举成员本身的名称无关。

## 异构枚举

从技术上讲，枚举可以混合使用字符串和数字成员，但你这么做会使其表意不明：

```ts
enum BooleanLikeHeterogeneousEnum {
  No = 0,
  Yes = 'YES',
}
```

除非你真的想巧妙地利用 JavaScript 的运行时行为，否则建议你不要这样做。

## 计算成员和常量成员

每个枚举成员都有一个与之关联的值，该值可以是 _常量_，也可以是 _计算_ 值。 在以下情况下，枚举成员被视为常量：

- 它是枚举中的第一个成员，它没有初始化器，在这种情况下，它被赋值为`0`。

```ts
// E.X 为常量:
enum E {
  X,
}
```

- 它没有初始化器，而且前一个枚举成员是一个 _数值_ 常量。在这种情况下，当前枚举成员的值将是前一个枚举成员的值加 1。

```ts
// 所有在'E1'和'E2'中的枚举数值都是常量

enum E1 {
  X,
  Y,
  Z,
}

enum E2 {
  A = 1,
  B,
  C,
}
```

- 枚举成员使用常量枚举表达式初始化。常量枚举表达式是 TypeScript 表达式的子集，可以在编译时对其进行完全求值。如果表达式是以下几种情况，则它是常量枚举表达式：

  1. 字面量枚举表达式(基本上是字符串字面量或数字字面量)
  2. 对先前定义的常量枚举成员的引用(可以源自其它枚举)
  3. 带括号的常量枚举表达式
  4. `+`，`-`，`〜`一元运算符之一，应用于常量枚举表达式
  5. `+`，`-`，`*`，`/`，`％`，`<<`，`>>`，`>>>`，`＆`，`|`，`^`以常量枚举表达式作为操作数的二进制运算符

  将常量枚举表达式求值为`NaN`或`Infinity`将造成编译时错误。

在所有其它情况下，枚举成员被视为计算成员。

```ts
enum FileAccess {
  // 常量成员
  None,
  Read = 1 << 1,
  Write = 1 << 2,
  ReadWrite = Read | Write,
  // 计算成员
  G = '123'.length,
}
```

## 联合枚举和枚举成员类型

字面量枚举成员是一个不被计算的常量枚举成员的特殊子集。它是没有初始化值或具有初始化为以下值的常量枚举成员：

- 任何字符串字面量(例如“ foo”，“ bar”，“ baz”)
- 任何数字字面量(例如 1、100)
- 适用于任何数字字面量的一元减号(例如-1，-100)

当枚举中的所有成员都具有字面量枚举值时，就会使用一些特殊的语义。

首先是枚举成员也成为类型！例如，我们可以说某些成员只能具有枚举成员的值：

```ts
enum ShapeKind {
  Circle,
  Square,
}

interface Circle {
  kind: ShapeKind.Circle
  radius: number
}

interface Square {
  kind: ShapeKind.Square
  sideLength: number
}

let c: Circle = {
  kind: ShapeKind.Square,
  // 错误：不能将类型“ShapeKind.Square”分配给类型“ShapeKind.Circle”
  radius: 100,
}
```

另一个变化是，枚举类型本身有效地成为每个枚举成员的 _联合_。
有了联合枚举，类型系统能够利用它知道存在于枚举本身的精确值集。
正因为如此，TypeScript 可以捕捉到我们可能错误地比较值的错误。例如：

```ts
enum E {
  Foo,
  Bar,
}

function f(x: E) {
  if (x !== E.Foo || x !== E.Bar) {
    // 错误：此条件将始终返回 "true"，因为类型 "E.Foo" 和 "E.Bar" 没有重叠
    //
  }
}
```

在该示例中，我们首先检查`x`是否不是`E.Foo`。如果该检查成功，则`||`会短路，“if”的主体会运行。但是，如果检查不成功，则`x`只能是`E.Foo`，因此查看它是否不等于`E.Bar`毫无意义。

## 运行时枚举

枚举是在运行时存在的真实对象。例如，下面的枚举

```ts
enum E {
  X,
  Y,
  Z,
}
```

可以传递给函数

```ts
enum E {
  X,
  Y,
  Z,
}

function f(obj: { X: number }) {
  return obj.X
}

// 有效，因为“ E”具有一个名为“ X”的属性，该属性是一个数字。
f(E)
```

## 编译时枚举

尽管枚举是在运行时存在的真实对象，但`keyof`关键字的工作方式与你对典型对象的期望不同。相反，使用`keyof typeof`得到一个将所有枚举键表示为字符串的`Type`。

```ts
enum LogLevel {
  ERROR,
  WARN,
  INFO,
  DEBUG,
}

/**
 * 这等价于:
 * type LogLevelStrings = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
 */
type LogLevelStrings = keyof typeof LogLevel

function printImportant(key: LogLevelStrings, message: string) {
  const num = LogLevel[key]
  if (num <= LogLevel.WARN) {
    console.log('Log level key is:', key)
    console.log('Log level value is:', num)
    console.log('Log level message is:', message)
  }
}
printImportant('ERROR', 'This is a message')
```

### 反向映射

除了创建具有成员属性名称的对象外，数字枚举成员还获得从枚举值到枚举名称的 _反向映射_ 。例如，在此示例中：

```ts
enum Enum {
  A,
}

let a = Enum.A
let nameOfA = Enum[a] // "A"
```

TypeScript 将其编译为以下 JavaScript：

```js
'use strict'
var Enum
;(function (Enum) {
  Enum[(Enum['A'] = 0)] = 'A'
})(Enum || (Enum = {}))
let a = Enum.A
let nameOfA = Enum[a] // "A"
```

在这段生成的代码中，一个枚举被编译成一个对象，它同时存储正向(`name` -> `value`)和反向(`value` -> `name`)映射。对其它枚举成员的引用总是作为属性访问而不是内联。

请记住，字符串枚举成员根本 _不会_ 生成反向映射。

### 常量枚举

在大多数情况下，枚举是一个完美有效的解决方案。但是有时要求会更严格。 为了避免在访问枚举值时产生额外的生成代码和间接调用的开销，可以使用`const`枚举。常量枚举是在我们的枚举上使用`const`修饰符定义的：

```ts
const enum Enum {
  A = 1,
  B = A * 2,
}
```

常量枚举只能使用常量枚举表达式，与常规枚举不同的是，它们在编译过程中会被完全删除。常量枚举成员在使用它们的地方是内联的。这是可能的，因为常量枚举不能有计算的成员。

```ts
const enum Direction {
  Up,
  Down,
  Left,
  Right,
}

let directions = [Direction.Up, Direction.Down, Direction.Left, Direction.Right]
```

将生成以下代码

```js
'use strict'
let directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */]
```

## 环境(Ambient)枚举

环境枚举用来描述已经存在的枚举类型的外形。

```ts
declare enum Enum {
  A = 1,
  B,
  C = 2,
}
```

环境枚举和非环境枚举之间的一个重要区别是，在常规枚举中，如果其前面的枚举成员被认为是常量，那么没有初始化器的成员将被认为是常量。相反，一个没有初始化器的环境枚举(和非常量)成员 _总是_ 被认为是计算的。

# 基本类型

> 原文链接：<https://www.typescriptlang.org/docs/handbook/basic-types.html>

为了使程序有用，我们需要能够处理一些最简单的数据单元：数字、字符串、结构、布尔值等。在 TypeScript 中，我们支持与 JavaScript 中相同的类型，并有一个额外的枚举类型来帮助我们。

## Boolean

最基本的数据类型是简单的 true / false 值，JavaScript 和 TypeScript 将该值称为`boolean`值

```ts
let isDone: boolean = false
```

## Number

在 JavaScript 中，TypeScript 中的所有数字要么是浮点值，要么是大整数。这些浮点数的类型为`number`，而大整数的类型为`bigint`。除了十六进制和十进制字符，TypeScript 还支持 ECMAScript 2015 中引入的二进制和八进制字符。

```ts
let decimal: number = 6
let hex: number = 0xf00d
let binary: number = 0b1010
let octal: number = 0o744
let big: bigint = 100n
```

在 JavaScript 中为网页和服务器创建程序的另一个基本部分是处理文本数据。在其他语言中，我们使用字符串类型来引用这些文本数据类型。就像 JavaScript 一样，TypeScript 也使用双引号(")或单引号(')来包裹字符串数据。

```ts
let color: string = 'blue'
color = 'red'
```

你还可以使用模板字符串，该模板字符串可以跨越多行并具有嵌入式表达式。 这些字符串由反引号(\`)字符包裹，并且嵌入表达式的格式为`${expr}`

```ts
let fullName: string = 'zerowong'
let age: number = 22
let sentence: string = `Hello, my name is ${fullName}.

I'll be ${age + 1} years old next month.`
```

这等效于像这样声明`sentence`：

```ts
let sentence: string =
  'Hello, my name is ' + fullName + '.\n\n' + "I'll be " + (age + 1) + ' years old next month.'
```

## Array

TypeScript 同 JavaScript 一样，允许你使用值数组。数组类型可以用两种方式之一来写。

对于第一种方法，使用元素类型接`[]`来表示该元素类型的数组。

```ts
let list: number[] = [1, 2, 3]
```

第二种方法是使用泛型数组类型，`Array<elemType>`：

```ts
let list: Array<number> = [1, 2, 3]
```

## Tuple

元组类型允许你用固定数量的元素表示数组，这些元素的类型是已知的，但不必相同。 例如，你可能希望将值表示为一个`string`和一个`number`

```ts
// 声明
let x: [string, number]
// 初始化
x = ['hello', 10]
// 错误初始化
x = [10, 'hello']
```

当访问具有已知索引的元素时，将检索正确的类型

```ts
console.log(x[0].substring(1))
// 报错：类型“number”上不存在属性“substring”
console.log(x[1].substring(1))
```

访问已知索引集之外的元素会出错：

```ts
// 不能将类型“"hi"”分配给类型“undefined”
// 长度为 "2" 的元组类型 "[string, number]" 在索引 "3" 处没有元素
x[3] = 'hi'
```

## Enum

`enum`是 JavaScript 标准数据类型集的一个有用补充。与`C＃`之类的语言一样，枚举是一种为数字值集合赋予更友好名称的方式

```ts
enum Color {
  Red,
  Green,
  Blue,
}

let c: Color = Color.Green
```

默认情况下，枚举开始从 0 开始对其成员编号。你可以通过手动设置其成员之一的值来对其进行更改。 例如，我们可以从 1 开始而不是从 0 开始：

```ts
enum Color {
  Red = 1,
  Green,
  Blue,
}

let c: Color = Color.Green
```

甚至手动设置枚举中的所有值：

```ts
enum Color {
  Red = 1,
  Green = 2,
  Blue = 4,
}

let c: Color = Color.Green
```

枚举的一个方便功能是可以在枚举中通过数字值得到该值的名字。例如，如果我们具有值`2`，但不确定上面的`Color`枚举中映射到的值，则可以查找对应的名称

```ts
enum Color {
  Red = 1,
  Green,
  Blue,
}

// is 'Green'
let colorName: string = Color[2]
```

## Unknown

我们可能需要描述写代码时还不知道的变量类型。这些值可能来自动态内容，例如：来自用户，或者我们可能要有意接受我们 API 中的所有值。在这种情况下，我们想提供一个告诉编译器和将来的读者的类型，该变量可以是任何变量，因此我们将其赋予`unknown`类型

```ts
let notSure: unknown = 4
notSure = 'maybe a string instead'
notSure = false
```

如果你有一个未知类型的变量，则可以通过进行`typeof`检查，比较检查或更高级的类型守卫将其范围缩小到更具体的范围，这将在下一章中进行讨论。

```ts
// unknown可以是其它类型
declare const maybe: unknown
// 除了unknown和any，不能将unknown分配给其它类型的变量
const aNumber: number = maybe

if (maybe === true) {
  // 此时TS已经知道'maybe'为boolean型
  const aBoolean: boolean = maybe
  // 因此不能将其分配给string类型变量
  const aString: string = maybe
}

if (typeof maybe === 'string') {
  // 同上
  const aString: string = maybe
  const aBoolean: boolean = maybe
}
```

## Any

在某些情况下，并不是所有的类型信息都是可用的，或者它的声明会花费不适当的精力。这些情况可能发生在没有 TypeScript 或第三方库编写的代码中。在这些情况下，我们可能希望选择不进行类型检查。要做到这一点，我们可以将这些值标记为`any`类型

```ts
declare function getValue(key: string): any
// 不对'getValue'的返回值进行检查
const str: string = getValue('hi')
```

`any`类型是使用现有 JavaScript 的强大方法，可让你在编译期间渐进式地选择加入和选择退出类型检查。

与`unknown`变量不同，`any`类型的变量使你可以访问任意属性，甚至是不存在的属性。 这些属性包括函数，并且 TypeScript 不会检查它们的存在或类型：

```ts
let looselyTyped: any = 4
looselyTyped.ifItExists()
looselyTyped.toFixed()

let strictlyTyped: unknown = 4
// Error: 对象的类型为 "unknown"
strictlyTyped.toFixed()
```

`any`类型将在对象中一直传递下去

```ts
let looselyTyped: any = {}
let d = looselyTyped.a.b.c.d
//  ^ = let d: any
```

所有`any`的便利都是以失去类型安全为代价的。类型安全是使用 TypeScript 的主要动机之一，当没有必要时，你应该尽量避免使用`any`。

## Void

`void`有点像`any`的反义词：没有任何类型。通常可以把它看作是无返回值的函数的返回类型。

```ts
function warn(err: Error): void {
  console.log(err)
}
```

声明`void`类型的变量是没有用的，因为你只能将`null`(只有在没有指定`--strictNullChecks`的情况下，见下一节)或`undefined`的变量赋值给它们。

```ts
let unuseable: void = undefined
unuseable = null
```

## Null 和 Undefined

在 TypeScript 中，`undefined`和`null`实际上都有自己的类型，分别命名为`undefined`和`null`。就像`void`一样，它们本身并不是非常有用。

```ts
// 可以给这些变量分配的东西不多
let u: undefined = undefined
let n: null = null
```

默认情况下，`null`和`undefined`是所有其他类型的子类型。这意味着你可以将`null`和`undefined`赋值给像`number`这样的类型。

然而，当使用`--strictNullChecks`标志时，`null`和`undefined`只能分配给`unknown`、`any`和它们各自的类型（一个例外是`undefined`也可以分配给`void`）。这有助于避免许多常见的错误。在你想传入`string`或`null`或`undefined`的情况下，你可以使用联合类型`string | null | undefined`。

联合类型是一个高级话题，我们将在后面的章节中介绍。

需要注意的是：我们鼓励在可能的情况下使用`--strictNullChecks`，但在本手册中，我们将假定它是关闭的。

## Never

`never` 类型表示永远不会出现的值的类型。例如，`never`是一个函数表达式的返回类型，或者一个总是抛出异常的箭头函数表达式，或者一个永不返回的函数表达式。变量在被任何类型守卫窄化时，也会获得`never`类型，即永远不能为真。

`never`类型是每一个类型的子类型，并且可以分配给每一个类型；但是，没有任何类型是`never`的子类型，或者可以分配给`never`（除了`never`本身）。即使是`any`也不能分配给`never`。

一些返回`never`的函数的例子：

```ts
function error(message: string): never {
  throw new Error(message)
}

// 推断出返回值为'never'类型
function fail() {
  return error('something failed')
}

function infiniteLoop(): never {
  while (true) {}
}
```

## Object

`object`是代表非基本类型的类型，即任何不是`number`，`string`，`boolean`，`bigint`，`symbol`，`null`或`undefined`的类型。

通过`object`类型，可以更好地表示`Object.create`之类的 API。例如：

```ts
declare function create(o: object): void

create({ prop: 0 })
// 以下均报错
create(null)
create(undefined)
create(0)
create('string')
create(false)
create(123n)
create(Symbol('foo'))
```

通常情况下你不需要使用它

## 类型断言

有时，你会遇到比 TypeScript 更了解值的情况。通常，当你知道某个实体的类型可能比其当前类型更具体时，就会发生这种情况。

_类型断言_ 是一种告诉编译器“相信我，我知道我在做什么”的方法。 类型断言就像其他语言中的类型转换一样，但是它不执行数据的特殊检查或重构。它对运行时没有影响，仅由编译器使用。TypeScript 假定你（程序员）已经执行了所需的任何特殊检查。

类型断言有两种形式。

一种是`as`语法：

```ts
let someValue: unknown = 'this is a string'
let strLength: number = (someValue as string).length
```

另一种是使用`<>`(尖括号)语法

```ts
let someValue: unknown = 'this is a string'
let strLength: number = (<string>someValue).length
```

这两种方法是等效的。优先使用哪一种取决于个人偏好。但是，将 TypeScript 与 JSX 一起使用时，仅允许使用`as`样式的断言。

## 关于`let`的说明

你可能已经注意到，到目前为止，我们一直在使用`let`关键字而不是你可能更熟悉的 JavaScript 的`var`关键字。`let`关键字实际上是 TypeScript 可用的更新的 JavaScript 结构。 你可以在[Variable Declarations]中阅读更多有关`let`和`const`如何修复`var`问题的信息。

## 关于 Number, String, Boolean, Symbol and Object

人们很容易认为`Number`、`String`、`Boolean`、`Symbol` 或`Object` 等类型与上面推荐的小写版本相同。然而，这些类型并不是指语言原语，而且几乎永远都不应该作为一种类型来使用。

[variable declarations]: https://www.typescriptlang.org/docs/handbook/variable-declarations.html

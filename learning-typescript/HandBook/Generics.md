# 泛型

> 原文：<https://www.typescriptlang.org/docs/handbook/generics.html>

软件工程的主要部分是构建不仅具有良好定义和一致的 API，而且还可以重用的组件。能够处理当今和未来数据的组件将为你提供构建大型软件系统的最灵活功能。

在 C＃和 Java 之类的语言中，用于创建可重用组件的工具箱中的主要工具之一是 _泛型_，即能够创建一种可以在多种类型而不是单个类型上工作的组件。这使用户可以使用这些组件并使用自己的类型。

## 泛型入门

首先，让我们来做一个泛型的"hello world"：`identity`函数。
`identity`函数是一个会返回传入的任何内容的函数。你可以把它理解为`echo`命令。

如果没有泛型，我们就必须给`identity`函数一个特定的类型。

```ts
function identity(arg: number): number {
  return arg
}
```

或者，我们可以使用`any`类型来描述`identity`函数：

```ts
function identity(arg: any): any {
  return arg
}
```

虽然使用`any`肯定是通用的，因为它将导致函数接受`arg`类型的`any`类型和其它所有类型，但实际上，我们丢失了有关函数返回时该类型的信息。如果我们传入一个数字，那么唯一的信息就是可以返回`any`类型。

相反，我们需要一种捕获参数类型的方式，以便我们也可以使用它来表示返回的内容。在这里，我们将使用 _类型变量_，这是一种特殊的变量，适用于类型而不是值。

```ts
function identity<T>(arg: T): T {
  return arg
}
```

现在我们在`identity`函数中添加了一个类型变量`T`。这个`T`允许我们捕捉用户提供的类型(例如`number`)，以便我们以后可以使用这些信息。这里，我们再次使用`T`作为返回类型。经过检查，我们现在可以看到参数和返回类型使用的是同一个类型。这使得我们可以在函数的一侧传输该类型信息，并从另一侧流出。

我们说这个版本的`identity`函数是泛型的，因为它适用于多种类型。与使用`any`不同的是，它也和第一个使用`number`作为参数和返回类型的`identity`函数一样精确(即，它不会丢失任何信息)。

一旦我们写好了泛型`identity`函数，我们可以用两种方式之一来调用它。第一种方式是将所有的参数，包括类型参数，传递给函数：

```ts
let output = identity<string>('myString')
//       ^ = let output: string
```

在这里，我们显式地将`T`设置为`string`作为函数调用的参数之一，使用`<>`包裹类型参数而不是`()`。

第二种方式可能也是最常见的。这里我们使用 _类型参数推断_-也就是说，我们希望编译器根据我们传递进来的参数的类型自动为我们设置`T`的值。

```ts
let output = identity('myString')
//       ^ = let output: string
```

请注意，我们不必在尖括号(`<>`)中显式传递类型；编译器检查了 `"myString"`的值，并将`T`设置为其类型。虽然类型参数推断是一个有用的工具，可以使代码更短、更易读，但当编译器无法推断类型时，你可能需要像我们在前面的例子中那样显式传递类型参数，这可能发生在更复杂的例子中。

## 使用泛型类型变量

当你开始使用泛型时，你会注意到当你创建像`identity`这样的泛型函数时，编译器会强制要求你在函数主体中正确使用任何泛型参数。也就是说，你实际上将这些参数视为`any`类型或其它所有类型的参数。

让我们来看看之前的`identity`函数：

```ts
function identity<T>(arg: T): T {
  return arg
}
```

如果我们想在每次调用时将参数`arg`的`length`也记录到控制台呢？我们可能会想这样写：

```ts
function loggingIdentity<T>(arg: T): T {
  console.log(arg.length)
  // 错误：类型“T”上不存在属性“length”
  return arg
}
```

当我们这样做时，编译器会给我们一个错误，因为我们正在使用`arg`的`.length`成员，但我们从未说过`arg`拥有此成员。记住，我们之前说过，这些类型变量代表`any`和其它所有类型，因此使用此函数的人可能会传入一个`number`，而它没有`.length`成员。

假设我们实际上打算将此函数用于`T`的数组，而不是直接用于`T`。由于我们正在处理数组，因此`.length`成员应该可用。我们可以像创建其他类型的数组那样描述它：

```ts
function loggingIdentity<T>(arg: T[]): T[] {
  console.log(arg.length)
  return arg
}
```

你可以把`loggingIdentity`的类型理解为"泛型函数`loggingIdentity`接收一个类型参数`T`，和一个参数`arg`，这个参数是一个`T`的数组，然后返回一个`T`的数组"。
如果我们传入一个数字数组，我们会得到一个数字数组，因为`T`会绑定到`number`。这样我们就可以把我们的泛型类型变量`T`作为我们所处理的类型的一部分，而不是整个类型，给我们带来更大的灵活性。

我们也可以这样写示例：

```ts
function loggingIdentity<T>(arg: Array<T>): Array<T> {
  console.log(arg.length) // Array具有length属性，因此不再有错误
  return arg
}
```

你可能已经从其他语言中熟悉了这种类型的风格。在下一节中，我们将介绍如何创建自己的泛型类型，如`Array<T>`。

## 泛型类型

在前面的部分中，我们创建了可在多种类型上使用的泛型`identity`函数。在本节中，我们将探讨函数本身的类型以及如何创建泛型接口。

泛型函数的类型与非泛型函数的类型相似，首先列出类型参数，类似于函数声明：

```ts
function identity<T>(arg: T): T {
  return arg
}

let myIdentity: <T>(arg: T) => T = identity
```

我们也可以为类型中的泛型类型参数使用不同的名称，只要类型变量的数量和类型变量的使用方式一致即可。

```ts
function identity<T>(arg: T): T {
  return arg
}

let myIdentity: <U>(arg: U) => U = identity
```

我们也可以把泛型类型写成一个对象字面量类型的调用签名：

```ts
function identity<T>(arg: T): T {
  return arg
}

let myIdentity: { <T>(arg: T): T } = identity
```

这就引出了我们第一个泛型接口的编写。让我们把上一个例子中的对象字面量移到一个接口上：

```ts
interface GenericIdentityFn {
  <T>(arg: T): T
}

function identity<T>(arg: T): T {
  return arg
}

let myIdentity: GenericIdentityFn = identity
```

在类似的例子中，我们可能想把泛型参数移到整个接口的参数上。这可以让我们看到我们对什么类型进行了泛型(例如`Dictionary<string>`而不仅仅是`Dictionary`)。这使得类型参数对接口的所有其他成员可见。

```ts
interface GenericIdentityFn<T> {
  (arg: T): T
}

function identity<T>(arg: T): T {
  return arg
}

let myIdentity: GenericIdentityFn<number> = identity
```

请注意，我们的例子已经变成了稍微不同的东西。我们现在不是描述一个泛型函数，而是有一个非泛型函数签名，它是泛型类型的一部分。当我们使用`GenericIdentityFn`时，我们现在还需要指定相应的类型参数(这里是：`number`)，有效地锁定了底层调用签名将使用什么。了解什么时候把类型参数直接放在调用签名上，什么时候把类型参数放在接口本身，将有助于描述一个类型的哪些方面是泛型的。

除了泛型接口，我们还可以创建泛型类。注意，不能创建泛型的枚举和命名空间。

## 泛型类

泛型类的外形与泛型接口类似。泛型类在类名后面的尖括号(`<>`)里有一个泛型类型参数列表。

```ts
class GenericNumber<T> {
  zeroValue: T
  add: (x: T, y: T) => T
}

let myGenericNumber = new GenericNumber<number>()
myGenericNumber.zeroValue = 0
myGenericNumber.add = function (x, y) {
  return x + y
}
```

这是对`GenericNumber`类的一个非常简单的使用，但你可能已经注意到，没有任何东西限制它只能使用`number`类型。我们本可以使用`string`甚至更复杂的对象。

```ts
let stringNumeric = new GenericNumber<string>()
stringNumeric.zeroValue = ''
stringNumeric.add = function (x, y) {
  return x + y
}

console.log(stringNumeric.add(stringNumeric.zeroValue, 'test'))
```

就像接口一样，把类型参数放在类本身上，可以让我们确保类的所有属性都使用相同的类型。

正如我们在关于[类的一节](./Classes.md)中所介绍的，一个类的类型有两个方面：静态方面和实例方面。
泛型类只在其实例端而不是静态端上泛型，所以在使用类时，静态成员不能使用类的类型参数。

## 泛型约束

如果你还记得之前的一个例子，有时你可能想写一个泛型函数，它可以工作在一系列类型上，在这里你对这些类型会有什么能力有一定的了解。
在我们的`loggingIdentity`例子中，我们希望能够访问`arg`的`.length`属性，但编译器无法证明每个类型都有一个`.length`属性，所以它警告我们不能做这个假设。

```ts
function loggingIdentity<T>(arg: T): T {
  console.log(arg.length)
  // 错误：类型“T”上不存在属性“length”
  return arg
}
```

我们不想处理`any`和其它所有类型，而是想限制这个函数处理的类型，这些类型也有`.length`属性。只要类型有这个成员，我们就会允许它，但要求它至少有这个成员。为此，我们必须将我们的要求列为对`T`可以是什么的约束。

为此，我们将创建一个接口来描述我们的约束。在这里，我们将创建一个具有单个`.length`属性的接口，然后我们将使用这个接口和`extends`关键字来表示我们的约束：

```ts
interface Lengthwise {
  length: number
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length) // 现在我们知道它具有length属性，因此不再有错误
  return arg
}
```

由于泛型函数现在受到约束，因此它将不再适用于所有类型：

```ts
loggingIdentity(3)
// 错误：类型“number”的参数不能赋给类型“Lengthwise”的参数
```

相反，我们需要传递其类型具有所有必需属性的值：

```ts
loggingIdentity({ length: 10, value: 3 })
```

## 在泛型中使用类类型

使用泛型在 TypeScript 中创建工厂函数时，有必要通过其构造函数来引用类类型。例如：

```ts
function create<T>(c: { new (): T }): T {
  return new c()
}
```

一个更高级的示例使用原型属性推断和约束构造函数和类类型的实例端之间的关系。

```ts
class BeeKeeper {
  hasMask: boolean
}

class ZooKeeper {
  nametag: string
}

class Animal {
  numLegs: number
}

class Bee extends Animal {
  keeper: BeeKeeper
}

class Lion extends Animal {
  keeper: ZooKeeper
}

function createInstance<A extends Animal>(c: new () => A): A {
  return new c()
}

createInstance(Lion).keeper.nametag
createInstance(Bee).keeper.hasMask
```

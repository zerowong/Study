# 函数

> 原文：<https://www.typescriptlang.org/docs/handbook/functions.html>

函数是 JavaScript 中任何应用的基本构件。它们是你建立抽象层，模仿类、信息隐藏和模块的方式。在 TypeScript 中，虽然有类、命名空间和模块，但函数仍然在描述怎么 _做_ 这些事情上扮演着关键的角色。TypeScript 还为标准的 JavaScript 函数增加了一些新的功能，使它们更容易使用。

## 函数

首先，就像在 JavaScript 中一样，可以将 TypeScript 函数创建为命名函数或匿名函数。无论你要构建 API 中的函数列表还是一次性函数以移交给另一个函数，这都可以为你的应用选择最合适的方法。

快速回顾一下这两种方法在 JavaScript 中的样子：

```js
function add(x, y) {
  return x + y
}

let myAdd = function (x, y) {
  return x + y
}
```

就像在 JavaScript 中一样，函数可以引用函数体之外的变量。这被称为 _捕获_ 这些变量。虽然理解这如何工作（以及使用这种技术时的权衡）超出了本文的范围，但牢固理解这种机制如何工作是使用 JavaScript 和 TypeScript 的一个重要部分。

```js
let z = 100

function addToZ(x, y) {
  return x + y + z
}
```

## 函数类型

### 函数类型化

让我们在前面的简单例子中加入类型：

```ts
function add(x: number, y: number): number {
  return x + y
}

let myAdd = function (x: number, y: number): number {
  return x + y
}
```

我们可以给每个参数添加类型，然后给函数本身添加返回类型。TypeScript 可以通过查看返回语句来计算出返回类型，所以在很多情况下我们也可以选择不加这个(返回类型)。

### 编写函数类型

现在我们已经对函数进行了类型化，让我们通过观察函数类型的每一个片段，将函数的完整类型写出来。

```ts
let myAdd: (x: number, y: number) => number = function (x: number, y: number): number {
  return x + y
}
```

函数的类型同样具有两部分：参数的类型和返回类型。写出整个函数类型时，两个部分都是必需的。我们像参数列表一样写出参数类型，为每个参数指定名称和类型。该名称只是为了提高可读性。相反，我们可以这样写：

```ts
let myAdd: (baseValue: number, increment: number) => number = function (x: number, y: number): number {
  return x + y
}
```

只要参数类型一致，就认为是函数的有效类型，不管你在函数类型中给参数起什么名字。

第二部分是返回类型。我们通过在参数和返回类型之间使用一个箭头(`=>`)来明确哪个是返回类型。如前所述，这是函数类型中的必需部分，所以如果函数没有返回值，你应该使用`void`而不是不写。

值得注意的是，只有参数和返回类型构成了函数类型。捕获的变量不会反映在类型中。实际上，捕获的变量是任何函数的"隐藏状态"的一部分，并不构成其 API。

### 类型推断

在这个例子中，你可能会注意到 TypeScript 编译器可以推断出类型，即使你在等式的一边只有~~类型~~名称：

```ts
let myAdd = function (x: number, y: number): number {
  return x + y
}

let myAdd2: (baseValue: number, increment: number) => number = function (x, y) {
  return x + y
}
```

这称为“上下文类型”，一种类型推断的形式。这有助于减少代码量

## 可选参数和默认参数

在 TypeScript 中，每个参数都被假定为函数所必需的。这并不意味着它不能被赋予`null`或`undefined`，而是当函数被调用时，编译器会检查用户是否为每个参数提供了一个值。编译器还假设这些参数是唯一会传递给函数的参数。简而言之，给函数的参数数量必须与函数期望的参数数量相匹配。

```ts
function buildName(firstName: string, lastName: string) {
  return firstName + ' ' + lastName
}

// 少了
let result1 = buildName('Bob')

// 多了
let result2 = buildName('Bob', 'Adams', 'Sr.')

// 刚好
let result3 = buildName('Bob', 'Adams')
```

在 JavaScript 中，每一个参数都是可选的，用户可以根据自己的需要将它们去掉。当这样做时，它们的值是`undefined`。在 TypeScript 中，我们可以通过在我们希望成为可选项的参数末尾添加一个`?`来获得这个功能。例如，让我们说我们希望上面的`lastName`参数是可选的：

```ts
function buildName(firstName: string, lastName?: string) {
  if (lastName) return firstName + ' ' + lastName
  else return firstName
}

let result1 = buildName('Bob')

// 应有 1-2 个参数，但获得 3 个
let result2 = buildName('Bob', 'Adams', 'Sr.')

let result3 = buildName('Bob', 'Adams')
```

任何可选参数必须跟在所需参数后面。如果我们想让`firstName`成为可选的，而不是`lastName`，我们需要改变函数中参数的顺序，将`firstName`放在列表的最后。

在 TypeScript 中，我们也可以设置一个参数具有默认值，如果用户在参数位置没有传入参数，或者传入的是`undefined`，那么这个参数将被分配一个默认值。这些被称为默认-初始化参数。让我们以前面的例子为例，将`lastName`默认为`"Smith"`。

```ts
function buildName(firstName: string, lastName = 'Smith') {
  if (lastName) return firstName + ' ' + lastName
  else return firstName
}

let result1 = buildName('Bob') // OK

let result2 = buildName('Bob', undefined) // OK

// 应有 1-2 个参数，但获得 3 个
let result3 = buildName('Bob', 'Adams', 'Sr.')

let result4 = buildName('Bob', 'Adams')
```

在所有必要参数之后的默认初始化参数被视为可选参数，就像可选参数一样，在调用各自的函数时可以省略。这意味着可选参数和后面的默认参数在类型上会有共性。

所以

```ts
function buildName(firstName: string, lastName?: string) {
  // ...
}
```

和

```ts
function buildName(firstName: string, lastName = 'Smith') {
  // ...
}
```

都共享同一个类型`(firstName: string, lastName?: string) => string`。`lastName`的默认值在类型中消失，只留下参数是可选的这一事实。

与普通的可选参数不同，默认初始化参数 _不需要_ 在必需参数之后出现。 如果默认初始化参数位于必需参数之前，则用户需要显式传递`undefined`以获得默认初始化值。例如，我们可以在最后一个示例的`firstName`上使用默认初始化来写：

```ts
function buildName(firstName = 'Will', lastName: string) {
  return firstName + ' ' + lastName
}

// 应有 2 个参数，但获得 1 个
let result1 = buildName('Bob')

// 应有 2 个参数，但获得 3 个
let result2 = buildName('Bob', 'Adams', 'Sr.')

let result3 = buildName('Bob', 'Adams') // OK
let result4 = buildName(undefined, 'Adams') // Ok
```

## 剩余参数

必需参数，可选参数和默认参数都有一个共同点：它们一次只讨论一个参数。 有时，你想将多个参数作为一个组来使用，或者你可能不知道一个函数最终将使用多少个参数。 在 JavaScript 中，你可以直接使用每个函数体内可见的`arguments`变量来处理多个参数。

在 TypeScript 中，你可以将这些参数一起收集到一个变量中：

```ts
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + ' ' + restOfName.join(' ')
}

let employeeName = buildName('Joseph', 'Samuel', 'Lucas', 'MacKinzie')
```

剩余参数被视为数量无限的可选参数。当为剩余参数传递参数时，你可以使用任意数量的参数，甚至可以不传递任何参数。编译器将用省略号(`...`)后面给出的名称建立一个传入的参数数组，允许你在函数中使用它。

省略号也用于带有剩余参数的函数类型中：

```ts
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + ' ' + restOfName.join(' ')
}

let buildNameFun: (fname: string, ...rest: string[]) => string = buildName
```

## this

学习如何在 JavaScript 中使用`this`是一种仪式。由于 TypeScript 是 JavaScript 的超集，TypeScript 开发者也需要学习如何使用`this`，以及如何发现它没有被正确使用。幸运的是，TypeScript 可以让你通过一些技术来发现`this`的不正确使用。如果你需要了解`this`在 JavaScript 中是如何工作的，首先阅读 Yehuda Katz 的[Understanding JavaScript Function Invocation and "this"](http://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/)。Yehuda 的文章很好地解释了`this`的内部工作原理，所以我们在这里只介绍一下基础知识。

### this 与箭头函数

在 JavaScript 中，`this`是在调用函数时设置的变量。这使其成为一个非常强大且灵活的功能，但是却以必须始终知道函数在其中执行的上下文为代价。众所周知，这是个令人困惑的特性，尤其是在返回一个函数或将函数作为参数传递的时候

让我们看一个例子：

```ts
const deck = {
  suits: ['hearts', 'spades', 'clubs', 'diamonds'],
  cards: Array(52),
  createCardPicker: function () {
    return function () {
      const pickedCard = Math.floor(Math.random() * 52)
      const pickedSuit = Math.floor(pickedCard / 13)
      return { suit: this.suits[pickedSuit], card: pickedCard % 13 }
    }
  },
}

const cardPicker = deck.createCardPicker()
const pickedCard = cardPicker()

console.log(`card: ${pickedCard.card} of ${pickedCard.suit}`)
```

请注意，`createCardPicker`是一个函数，它本身就返回一个函数。如果我们尝试运行这个例子，我们会得到一个错误。这是因为在`createCardPicker`创建的函数中使用的`this`将被设置为`window`而不是我们的`deck`对象。这是因为我们自己调用了`cardPicker()`。像这样的顶层非方法语法调用将使用`window`作为`this`。(注意：在严格模式下为`undefined`而不是`window`)。

我们可以通过在返回函数以供以后使用之前确保该函数绑定到正确的`this`来解决此问题。这样，无论以后如何使用，它仍然可以看到原始的`deck`对象。为此，我们将函数表达式更改为使用 ECMAScript 6 箭头语法。箭头函数在创建函数而不是在调用函数的位置捕获`this`：

```ts
const deck = {
  suits: ['hearts', 'spades', 'clubs', 'diamonds'],
  cards: Array(52),
  createCardPicker: function () {
    // 注意：下面的一行现在是一个箭头函数，允许我们在这里捕获'this'。
    return () => {
      const pickedCard = Math.floor(Math.random() * 52)
      const pickedSuit = Math.floor(pickedCard / 13)
      return { suit: this.suits[pickedSuit], card: pickedCard % 13 }
    }
  },
}

const cardPicker = deck.createCardPicker()
const pickedCard = cardPicker()

console.log(`card: ${pickedCard.card} of ${pickedCard.suit}`)
```

更好的是，如果将`--noImplicitThis`标志传递给编译器，当你犯此错误时，TypeScript 会警告你。 它将指出`this.suits[pickedSuit]`的类型为`any`。

### this 参数

~~不幸的是，`this.suits[pickedSuit]`的类型仍然是`any`的~~。 这是因为它来自对象字面量内部的函数表达式。要解决此问题，你可以提供一个显式的`this`参数。`this`参数是伪参数，这个伪参数放在函数参数列表中的首位：

```ts
function f(this: void) {
  // 确保`this`在此独立函数中不可用
}
```

我们在上面的例子中增加几个接口，分别是`Card`和`Deck`，让类型更清晰，更容易复用：

```ts
interface Card {
  suit: string
  card: number
}

interface Deck {
  suits: string[]
  cards: number[]
  createCardPicker(this: Deck): () => Card
}

const deck: Deck = {
  suits: ['hearts', 'spades', 'clubs', 'diamonds'],
  cards: Array(52),
  createCardPicker: function (this: Deck) {
    // 注意：该函数现在显式指定其被调用方必须为Deck类型
    return () => {
      const pickedCard = Math.floor(Math.random() * 52)
      const pickedSuit = Math.floor(pickedCard / 13)
      return { suit: this.suits[pickedSuit], card: pickedCard % 13 }
    }
  },
}

const cardPicker = deck.createCardPicker()
const pickedCard = cardPicker()

console.log(`card: ${pickedCard.card} of ${pickedCard.suit}`)
```

### 回调中的 this 参数

当你将函数传递给以后会调用它们的库时，你也可能在回调中遇到`this`错误。因为调用你的回调的库将像普通函数一样调用它，所以`this`将是`undefined`。通过一些工作，你也可以使用`this`参数来防止回调错误。首先，库作者需要使用`this`注释回调类型：

```ts
interface UIElement {
  addClickListener(onclick: (this: void, e: Event) => void): void
}
```

`this: void`意味着`addClickListener`期望`onclick`是一个不需要`this`类型的函数。其次，用`this`注释你的调用代码：

```ts
interface UIElement {
  addClickListener(onclick: (this: void, e: Event) => void): void
}

interface Event {
  message: string
}

declare const uiElement: UIElement

class Handler {
  info: string
  onClickBad(this: Handler, e: Event) {
    this.info = e.message
  }
}

let h = new Handler()

// 类型“(this: Handler, e: Event) => void”的参数不能赋给类型“(this: void, e: Event) => void”的参数。
// 每个签名的 "this" 类型不兼容。
// 不能将类型“void”分配给类型“Handler”。
uiElement.addClickListener(h.onClickBad)
```

有了这个注解，你就可以明确`onClickBad`必须在`Handler`的实例上被调用。然后 TypeScript 会检测到`addClickListener`需要一个具有`this: void`的函数。要解决这个错误，请改变`this`的类型：

```ts
class Handler {
  info: string
  onClickGood(this: void, e: Event) {
    console.log('clicked!')
  }
}

let h = new Handler()
uiElement.addClickListener(h.onClickGood)
```

由于`onClickGood`将`this`类型指定为`void`，因此将其传递给`addClickListener`是合法的。当然，这也意味着它不能使用`this.info`。如果两者都需要，则必须使用箭头函数：

```ts
class Handler {
  info: string
  onClickGood = (e: Event) => {
    this.info = e.message
  }
}
```

这很有效，因为箭头函数使用了外层的`this`，所以你总是可以把它们传递给期望`this：void`的东西。缺点是，每个类型为`Handler`的对象都会创建一个箭头函数。另一方面，方法只创建一次，并附加到`Handler`的原型上。它们在`Handler`类型的所有对象之间共享。

```js
// 编译为ES3版本的js
'use strict'
var Handler = (function () {
  function Handler() {
    this.onClickGood = function () {}
    this.info = ''
  }
  return Handler
})()
var h = new Handler()
var Handler2 = (function () {
  function Handler2() {
    this.info = ''
  }
  Handler2.prototype.onClickGood = function () {}
  return Handler2
})()
var h2 = new Handler2()
```

## 重载

JavaScript 本质上是一种非常动态的语言。一个 JavaScript 函数根据传入参数的外形返回不同类型的对象的情况并不少见。

```ts
const suits = ['hearts', 'spades', 'clubs', 'diamonds']

function pickCard(x: any): any {
  if (typeof x === 'object') {
    const pickedCard = Math.floor(Math.random() * x.length)
    return pickedCard
  } else if (typeof x === 'number') {
    const pickedCard = Math.floor(x / 13)
    return { suit: suits[pickedCard], card: x % 13 }
  }
}

const myDeck = [
  { suit: 'diamonds', card: 2 },
  { suit: 'spades', card: 10 },
  { suit: 'hearts', card: 4 },
]

const pickCard1 = myDeck[pickCard(myDeck)]
console.log(`card: ${pickCard1.card} of ${pickCard1.suit}`)

const pickCard2 = pickCard(15)
console.log(`card: ${pickCard2.card} of ${pickCard2.suit}`)
```

在这里，`pickCard`函数会根据用户传入的内容返回两种不同的东西。如果用户传入的是一个代表牌组的对象，函数就会挑选卡片。如果用户选中了牌，我们就会告诉他们选中了哪张牌。但是我们如何向类型系统描述呢？

答案是为同一个函数提供多个函数类型，作为一个重载列表。这个列表是编译器将用来解析函数调用的。让我们创建一个重载列表，来描述我们的`pickCard`接受什么和返回什么。

```ts
const suits = ['hearts', 'spades', 'clubs', 'diamonds']

function pickCard(x: { suit: string; card: number }[]): number
function pickCard(x: number): { suit: string; card: number }
function pickCard(x: any): any {
  if (typeof x === 'object') {
    const pickedCard = Math.floor(Math.random() * x.length)
    return pickedCard
  } else if (typeof x === 'number') {
    const pickedCard = Math.floor(x / 13)
    return { suit: suits[pickedCard], card: x % 13 }
  }
}

const myDeck = [
  { suit: 'diamonds', card: 2 },
  { suit: 'spades', card: 10 },
  { suit: 'hearts', card: 4 },
]

const pickCard1 = myDeck[pickCard(myDeck)]
console.log(`card: ${pickCard1.card} of ${pickCard1.suit}`)

const pickCard2 = pickCard(15)
console.log(`card: ${pickCard2.card} of ${pickCard2.suit}`)
```

通过此更改，重载现在为我们提供了对`pickCard`函数的类型检查调用。

为了使编译器选择正确的类型检查，它遵循与基础 JavaScript 相似的过程。 它查看重载列表，并在第一次重载之前尝试使用提供的参数调用该函数。如果找到匹配项，它将选择此重载作为正确的重载。因此，习惯上将重载从最具体到最不具体排序。

请注意，函数`pickCard(x: any): any`部分不属于重载列表(可以理解为重载实现)，因此它只有两个重载：一个重载一个`object`，另一个重载一个`number`。使用任何其他参数类型调用 pickCard 会导致错误。

# 接口(Interfaces)

TypeScript 的核心原则之一是类型检查重点在于值的 _外形(shape)_。其有时称为“动态类型(duck typing)”或“结构子类型(structural subtyping)”。 在 TypeScript 中，接口充当命名这些类型的角色，并且是定义代码内契约(contracts)以及项目外代码契约的有效方法。

## 我们的第一个接口

要了解接口的工作原理，最简单的方法是从一个简单的例子开始：

```ts
function printLabel(labeledObj: { label: string }) {
  console.log(labeledObj.label)
}

let obj = { size: 10, label: 'size 10 Object' }
printLabel(obj)
```

类型检查器检查对`printLabel`的调用。`printLabel`函数有一个单一的参数，要求传入的对象有一个类型为`string`的属性`label`。注意，我们的对象实际上有比这更多的属性，但编译器只检查所需要的那些属性是否存在，并且类型匹配。有一些情况下，TypeScript 并不那么宽松，我们将在稍后的内容中介绍

我们可以再次编写相同的示例，这次使用接口来描述具有类型为字符串的`label`属性的要求：

```ts
interface LabelValue {
  label: string
}

function printLabel(labeledObj: LabelValue) {
  console.log(labeledObj.label)
}

let obj = { size: 10, label: 'size 10 Object' }
printLabel(obj)
```

`LabeledValue`接口是我们现在可以用来描述前面例子中需求的名称。它仍然代表着有一个类型是`string`且叫做`label`的单一属性的对象，请注意，我们没有像在其他语言中那样，必须显式地要求我们传递给`printLabel`的对象实现了这个接口。在这里，只有 _外形_ 才是最重要的。如果我们传递给函数的对象符合所列出的要求，那么它就被允许使用。

值得指出的是，类型检查器并不要求这些属性以任何形式的顺序出现，只要求接口所需的属性存在并且具有所需的类型。

## 可选属性

并非接口的所有属性都是必需的。有些在特定条件下存在或根本不存在。这些可选属性在创建诸如“选项袋(option bags)”之类的模式时很常用，在该模式中，将对象传递给仅填充了几个属性的函数。

下面是这种模式的示例：

```ts
interface SquareConfig {
  color?: string
  width?: number
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  let newSquare = { color: 'white', area: 100 }
  if (config.color) {
    newSquare.color = config.color
  }
  if (config.width) {
    newSquare.area = config.width * config.width
  }
  return newSquare
}

let mySquare = createSquare({ color: 'black' })
```

带有可选属性的接口的写法与其他接口类似，在声明中，每个可选属性在属性名的末尾加一个`?`

可选属性的好处是，你可以描述这些可能可用的属性，同时还可以防止使用不属于接口的属性。例如，如果我们在`createSquare`中写错了`color`属性的名称，我们会得到一个错误信息。

```ts
function createSquare(config: SquareConfig): { color: string; area: number } {
  let newSquare = { color: 'white', area: 100 }
  // 属性“clor”在类型“SquareConfig”上不存在。你是否指的是“color”?
  if (config.clor) {
    // 属性“clor”在类型“SquareConfig”上不存在。你是否指的是“color”?
    newSquare.color = config.clor
  }
  if (config.width) {
    newSquare.area = config.width * config.width
  }
  return newSquare
}

let mySquare = createSquare({ color: 'black' })
```

## 只读属性

你可以在属性名称前加上`readonly`来指定一些属性在对象初始化后就无法修改。

```ts
interface Point {
  readonly x: number
  readonly y: number
}
```

你可以通过赋值一个对象字面量来构造一个`Point`。赋值后，`x`和`y`将不能被改变。

```ts
let pl: Point = { x: 10, y: 2 }
// 无法分配到 "x" ，因为它是只读属性
pl.x = 5
```

TypeScript 具有与`Array<T>`相同的`ReadonlyArray<T>`类型，并且删除了所有的变异(使数组改变)方法，因此可以确保创建后不更改数组：

```ts
let a: number[] = [1, 2, 3, 4]
let ro: ReadonlyArray<number> = a
// 或 let ro: readonly number[] = a

// 类型“readonly number[]”中的索引签名仅允许读取
ro[0] = 12
// 类型“readonly number[]”上不存在属性“push”
ro.push(5)
// 无法分配到 "length" ，因为它是只读属性
ro.length = 100
// 类型 "readonly number[]" 为 "readonly"，不能分配给可变类型 "number[]"
a = ro
```

在代码段的最后一行，你可以看到，即使将整个`ReadonlyArray`赋值回一个普通数组也是非法的。不过，你仍然可以通过类型断言来覆盖它。

```ts
let a: number[] = [1, 2, 3, 4]
let ro: ReadonlyArray<number> = a

a = ro as number[]
```

### readonly vs const

记住是使用`readonly`还是`const`的最简单的方法是问自己是在一个变量上还是在一个属性上使用它。变量使用`const`，而属性使用`readonly`。

## 过量属性检查(Excess Property Checks)

在我们第一个使用接口的例子中，TypeScript 让我们将`{ size: number; label: string; }`传递给只期望有`{ label: string; }`的对象。我们还刚刚学习了可选属性，以及它们在描述所谓的 "option bags"时是如何发挥作用的。

然而，天真地将这两者结合起来，会让一个错误悄然而至。以我们上一个使用`createSquare`的例子为例。

```ts
function createSquare(config: SquareConfig): { color: string; area: number } {
  return {
    color: config.color || 'red',
    area: config.width ? config.width * config.width : 20,
  }
}

// 类型“{ colour: string; width: number; }”的参数不能赋给类型“SquareConfig”。
// 对象字面量只能指定已知的属性，但类型“SquareConfig”中不存在“colour”。是否要写入 color?
let mySquare = createSquare({ colour: 'red', width: 100 })
```

请注意，`createSquare`给定的参数的拼写是 _colour_ 而不是`color`。在一般的 JavaScript 中，这种事情是静默失败的。

你可以说这个程序的类型是正确的，因为`width`属性是兼容的，虽然没有`color`属性存在，但额外的`colour`属性是无关紧要的。

然而，TypeScript 会认为这段代码中可能存在一个 bug。对象字面量会被特殊对待，当把它们赋值给其它变量，或者把它们作为参数传递时，会进行 _过量属性检查_。如果一个对象字面量有任何 "目标类型 "没有的属性，编译器就会报错：

```ts
// 类型“{ colour: string; width: number; }”的参数不能赋给类型“SquareConfig”。
// 对象字面量只能指定已知的属性，但类型“SquareConfig”中不存在“colour”。是否要写入 color?
let mySquare = createSquare({ colour: 'red', width: 100 })
```

绕过这些检查非常简单。最简单的方法就是使用类型断言：

```ts
let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig)
```

但是，如果你确定对象可以具有某些以特殊方式使用的额外属性，则更好的方法可能是添加字符串索引签名。如果`SquareConfig`可以具有上述类型的`color`和`width`属性，但是 _还_ 可以具有任意数量的其它属性，那么我们可以这样定义它：

```ts
interface SquareConfig {
  color?: string
  width?: number
  [propName: string]: any
}
```

我们稍后会讨论索引签名，但这里我们要说的是，一个`SquareConfig`可以有任何数量的属性，只要它们不是`color`或`width`，它们的类型并不重要(因为设置为了`any`)。

最后一个绕过这些检查的方法，可能有点令人惊讶，就是将对象分配给另一个变量。因为`squareOptions`不会接受过量属性检查(字面量才会)，所以编译器不会报错。

```ts
let squareOptions = { colour: 'red', width: 100 }
let mySquare = createSquare(squareOptions)
```

只要`squareOptions`和`SquareConfig`之间有一个共同的属性，上面的变通方法就可以用。在这个例子中，它是`width`属性。然而，如果变量没有任何共同的对象属性，它就会失败。比如说：

```ts
let squareOptions = { colour: 'red' }
// 类型“{ colour: string; }”与类型“SquareConfig”不具有相同的属性
let mySquare = createSquare(squareOptions)
```

请记住，对于像上面这样的简单代码，你也许不应该尝试去"绕过"这些检查。
对于有方法且需要保持状态的更复杂的对象字面量，你可能需要记住这些技巧，但大多数过量属性检查的报错实际上是提示你的代码有 bug。
这意味着，如果你遇到了像"option bags"这样的过量属性检查问题，你可能需要修改一下类型声明。
在这个例子中，如果可以将一个同时具有`color`或`colour`属性的对象传递给`createSquare`，你应该修正`SquareConfig`的定义。

## 函数类型

接口能够描述 JavaScript 对象可以采取的各种外形。除了用属性描述对象之外，接口还能够描述函数类型。

为了用接口描述一个函数类型，我们给接口一个调用签名。这就像一个函数声明一样，只给出参数列表和返回类型。参数列表中的每个参数都需要同时给出名称和类型。

```ts
interface SearchFunc {
  (source: string, subString: string): boolean
}
```

定义后，我们可以像使用其他接口一样使用此函数类型接口。 在这里，我们展示了如何创建函数类型的变量并为其分配相同类型的函数值。

```ts
let mySearch: SearchFunc

mySearch = function (source: string, subString: string) {
  let result = source.search(subString)
  return result > -1
}
```

函数每个对应参数位置的类型都会检查一次。如果你完全不想指定类型，TypeScript 可以推断出参数类型，因为函数值是直接分配给`SearchFunc`类型的变量。同样的，函数表达式的返回类型也由其返回的值（此处为`false`和`true`）所隐含。

```ts
let mySearch: SearchFunc

mySearch = function (src, sub) {
  let result = src.search(sub)
  return result > -1
}
```

如果函数表达式返回的是数字或字符串，类型检查器就会报错，表明返回类型与`SearchFunc`接口中描述的返回类型不匹配。

```ts
let mySearch: SearchFunc

// 不能将类型“(src: string, sub: string) => string”分配给类型“SearchFunc”。
// 不能将类型“string”分配给类型“boolean”
mySearch = function (src, sub) {
  let result = src.search(sub)
  return 'string'
}
```

### 可索引类型

与我们如何使用接口来描述函数类型类似，我们也可以描述我们可以"索引"的类型，比如`a[10]`，或者`ageMap["daniel"]`。可索引类型有一个 _索引签名_，它描述了我们可以在对象中使用索引的类型，以及索引时相应的返回类型。我们举个例子：

```ts
interface StringArray {
  [index: number]: string
}

let myArray: StringArray
myArray = ['Bol', 'Fred']

let myStr: string = myArray[0]
```

上面，我们有一个带有索引签名的`StringArray`接口。此索引签名指出，当用`number`对`StringArray`进行索引时，它将返回一个`string`。

支持两种类型的索引签名：字符串和数字。
可以同时支持两种类型的索引器，但是从数字索引器返回的类型必须是从字符串索引器返回的类型的子类型。
这是因为在用`number`索引时，JavaScript 实际上会在将其索引到对象之前将其转换为`string`。
这意味着使用`100`(`number`)进行索引与使用`"100"`(`string`)进行索引是同一回事，因此两者必须保持一致。

```ts
interface Animal {
  name: string
}

interface Dog extends Animal {
  breed: string
}

interface NotOkay {
  // 数字索引类型“Animal”不能赋给字符串索引类型“Dog”
  [x: number]: Animal
  [x: string]: Dog
}
```

虽然字符串索引签名是描述"字典"模式的有力方式，但它们也强制要求所有属性与其返回类型相匹配。
这是因为字符串索引声明`obj.property`也可以作为`obj["property"]`。
在下面的例子中，`name`的类型与字符串索引的类型不匹配，类型检查器报错。

```ts
interface NumberDictionary {
  [index: string]: number
  length: number
  // 类型“string”的属性“name”不能赋给字符串索引类型“number”
  name: string
}
```

但是，如果索引签名是属性类型的联合，则可以接受不同类型的属性。

```ts
interface NumberOrStringDictionary {
  [index: string]: number | string
  length: number
  name: string
}
```

最后，你可以将索引签名设为`readonly`，以防止对其索引的赋值。

```ts
interface ReadonlyStringArray {
  readonly [index: number]: string
}

let myArray: ReadonlyStringArray = ['Alice', 'Bob']
// 类型“ReadonlyStringArray”中的索引签名仅允许读取
myArray[2] = 'Mallory'
```

你无法设置`myArray[2]`，因为索引签名为`readonly`

## 类类型

### 实现(Implementing)一个接口

在 TypeScript 中，还可以使用 C＃和 Java 等语言中接口的最常见用法之一，即显式强制类满足特定协定的用法。

```ts
interface ClockInterface {
  curentTime: Date
}

class Clock implements ClockInterface {
  curentTime: Date = new Date()
  constructor(h: number, m: number) {}
}
```

你也可以在一个接口中描述在类中实现的方法，就像我们在下面的例子中对`setTime`所做的那样。

```ts
interface ClockInterface {
  curentTime: Date
  setTime(d: Date): void
}

class Clock implements ClockInterface {
  curentTime: Date = new Date()
  setTime(d: Date) {
    this.curentTime = d
  }
  constructor(h: number, m: number) {}
}
```

接口描述的是类的公有端，而不是公有端和私有端。这禁止你使用它们来检查类是否还具有针对该类实例的私有端的特定类型。

### 类的静态端和实例端之间的区别

使用类和接口时，请记住一个类有 _两_ 种类型：静态端的类型和实例端的类型。 你可能会注意到，如果使用构造签名创建接口并尝试创建实现该接口的类，则会出现错误：

```ts
interface ClockConstructor {
  new (hour: number, minute: number)
}

// 类“Clock”错误实现接口“ClockConstructor”。
// 类型“Clock”提供的内容与签名“new (hour: number, minute: number): any”不匹配
class Clock implements ClockConstructor {
  constructor(h: number, m: number) {}
}
```

这是因为当类实现接口时，仅检查该类的实例端。由于构造函数位于静态端，因此它不包含在此检查中。

相反，你需要直接使用类的静态端。在此示例中，我们定义了两个接口，用于构造函数的`ClockConstructor`和用于实例方法的`ClockInterface`。 然后，为方便起见，我们定义了一个构造函数`createClock`，该函数创建传递给它的类型的实例：

```ts
interface ClockConstructor {
  new (hour: number, minute: number): ClockInterface
}

interface ClockInterface {
  tick(): void
}

function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
  return new ctor(hour, minute)
}

class DigitalClock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log('beep beep')
  }
}

class AnalogClock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log('tick tock')
  }
}

let digital = createClock(DigitalClock, 12, 17)
let analog = createClock(AnalogClock, 7, 32)
```

由于`createClock`的第一个参数的类型为`ClockConstructor`，因此在`createClock(AnalogClock，7，32)`中，它会检查`AnalogClock`是否具有正确的构造函数签名。

另一种简单的方法是使用类表达式：

```ts
interface ClockConstructor {
  new (hour: number, minute: number): ClockInterface
}

interface ClockInterface {
  tick(): void
}

const Clock: ClockConstructor = class Clock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log('beep beep')
  }
}

let clock = new Clock(12, 17)
clock.tick()
```

## 扩展接口

和类一样，接口可以互相扩展。这使你可以将一个接口的成员复制到另一个接口中，从而在将接口分离为可复用组件的过程中提供了更大的灵活性。

```ts
interface Shape {
  color: string
}

interface Square extends Shape {
  sideLength: number
}

let square = {} as Square
square.color = 'blue'
square.sideLength = 10
```

一个接口可以扩展多个接口，从而创建所有接口的组合。

```ts
interface Shape {
  color: string
}

interface PenStroke {
  penWidth: number
}

interface Square extends Shape, PenStroke {
  sideLength: number
}

let square = {} as Square
square.color = 'blue'
square.sideLength = 10
square.penWidth = 5.0
```

## 混合类型

如前所述，接口可以描述现实世界 JavaScript 中存在的丰富类型。 由于 JavaScript 具有动态和灵活的特性，因此你有时可能会遇到一个对象，该对象是上述某些类型的组合。

其中一个这样的例子是一个既作为函数又作为对象的对象，并带有其它属性：

```ts
interface Counter {
  (start: number): string
  interval: number
  reset(): void
}

function getCounter(): Counter {
  let counter = function (start: number) {} as Counter
  counter.interval = 123
  counter.reset = function () {}
  return counter
}

let c = getCounter()
c(10)
c.reset()
c.interval = 5.0
```

与第三方 JavaScript 交互时，你可能需要使用上述模式来完全描述类型的外形。

## 通过类扩展接口

当一个接口类型扩展一个类类型时，它继承了该类的成员，但不继承它们的实现。这就好比接口声明了类的所有成员，却没有提供实现。接口甚至可以继承基类的私有和保护成员。这意味着，当你创建一个扩展了一个具有私有成员或保护成员的类的接口时，该接口类型只能由该类或其子类实现。

当你有一个庞大的继承层次结构，但又想指定你的代码只与具有某些属性的子类一起工作时，这很有用。子类除了从基类继承外，不必有任何关系。例如：

```ts
class Control {
  private state: any
}

interface SelectableControl extends Control {
  select(): void
}

class Button extends Control implements SelectableControl {
  select() {}
}

class TextBox extends Control {
  select() {}
}

// 类“ImageControl”错误实现接口“SelectableControl”
// 类型具有私有属性“state”的单独声明
class ImageControl implements SelectableControl {
  private state: any
  select() {}
}
```

在上面的例子中，`SelectableControl`包含了`Control`的所有成员，包括私有的`state`属性。由于`state`是一个私有成员，所以只有`Control`的后代才有可能实现`SelectableControl`，这是因为只有`Control`的后代才会有一个源自同一个声明的`state`私有成员，这是私有成员兼容的要求。

在`Control`类中，可以通过`SelectableControl`的实例来访问`state`私有成员。实际上，一个`SelectableControl`的作用就像一个已知有`select`方法的`Control`。`Button`和`TextBox`类是`SelectableControl`的子类（因为它们都继承自`Control`并有一个`select`方法）。`ImageControl`类有它自己的`state`私有成员，而不是扩展自`Control`，所以它不能实现`SelectableControl`。

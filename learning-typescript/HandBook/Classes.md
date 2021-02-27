# 类

> 原文：<https://www.typescriptlang.org/docs/handbook/classes.html>

传统的 JavaScript 使用函数和基于原型的继承来构建可重用的组件，但这对于更习惯于面向对象方法的程序员来说，可能会感觉有些笨拙，因为在这种方法中，类继承功能并从这些类构建对象。从 ECMAScript 2015（也就是 ECMAScript 6）开始，JavaScript 程序员可以使用这种面向对象的基于类的方法来构建他们的应用程序。在 TypeScript 中，我们允许开发人员现在就使用这些技术，并将其编译成可以在所有主要浏览器和平台上运行的 JavaScript，而无需等待下一个 JavaScript 版本。

## 类

让我们看一个基于类的简单示例：

```ts
class Greeter {
  greeting: string

  constructor(message: string) {
    this.greeting = message
  }

  greet() {
    return 'Hello, ' + this.greeting
  }
}

let greeter = new Greeter('world')
```

如果你以前使用过 C#或 Java，那么这个语法应该看起来很熟悉。我们声明一个新的类`Greeter`。这个类有三个成员：一个叫做`greeting`的属性，一个构造函数和一个`greet`方法。

你会注意到，在这个类中，当我们引用其中一个成员时，我们会在前面加上`this.`。这表示这是一个成员访问。

在最后一行，我们使用`new`构造一个`Greeter`类的实例。这就调用了我们之前定义的构造函数，创建了一个带有`Greeter`外形的新对象，并运行构造函数对其进行初始化。

## 继承

在 TypeScript 中，我们可以使用常见的面向对象模式。在基于类的编程中，最基本的模式之一是能够扩展现有的类，使用继承创建新的类。

让我们来看一个例子。

```ts
class Animal {
  move(distanceInMeters: number = 0) {
    console.log(`Animal moved ${distanceInMeters}m.`)
  }
}

class Dog extends Animal {
  bark() {
    console.log('Woof! Woof!')
  }
}

const dog = new Dog()
dog.bark()
dog.move(10)
dog.bark()
```

这个例子展示了最基本的继承特性：类从基类继承属性和方法。这里，`Dog`是一个 _派生_ 类，它使用`extends`关键字从`Animal` _基_ 类派生出来。派生类通常被称为 _子类_，基类通常被称为 _超类_。

因为`Dog`扩展了`Animal`的功能，所以我们能够创建一个`Dog`的实例，它既可以`bark()`又可以`move()`。

现在我们来看一个更复杂的例子。

```ts
class Animal {
  name: string
  constructor(theName: string) {
    this.name = theName
  }
  move(distanceInMeters: number = 0) {
    console.log(`${this.name} moved ${distanceInMeters}m.`)
  }
}

class Snake extends Animal {
  constructor(name: string) {
    super(name)
  }
  move(distanceInMeters = 5) {
    console.log('Slithering...')
    super.move(distanceInMeters)
  }
}

class Horse extends Animal {
  constructor(name: string) {
    super(name)
  }
  move(distanceInMeters = 45) {
    console.log('Galloping...')
    super.move(distanceInMeters)
  }
}

let sam = new Snake('Sammy the Python')
let tom: Animal = new Horse('Tommy the Palomino')

sam.move()
tom.move(34)
```

此示例涵盖了我们之前未提到的其他一些功能。我们再次看到`extends`关键字用于创建`Animal`的两个新子类：`Horse`和`Snake`。

与先前示例的区别在于，每个包含构造函数的派生类都 _必须_ 调用`super()`，它将执行基类的构造函数。而且，在我们访问构造函数主体中的该属性 _之前_，我们 _必须_ 调用`super()`。这是 TypeScript 将强制执行的重要规则。

该示例还显示了如何使用专门用于子类的方法覆盖基类中的方法。在这里，`Snake`和`Horse`都创建了一个`move`方法，该方法将覆盖`Animal`的`move`，从而赋予每个类特定的功能。请注意，即使`tom`被声明为`Animal`，由于其值是`Horse`，因此调用`tom.move(34)`会调用`Horse`中的重写方法：

## public, private 和 protected 修饰符

### 默认的 public

在我们的例子中，我们已经能够自由访问我们在整个程序中声明的成员。如果你熟悉其他语言中的类，你可能已经注意到在上面的例子中，我们不必使用`public`这个词来完成这个任务；例如，C#要求每个成员都被明确地标记为`public`才可见。在 TypeScript 中，每个成员默认为`public`。

你仍然可以显式地标记一个成员为`public`。我们可以用下面的方式来编写上一节的`Animal`类。

```ts
class Animal {
  public name: string

  public constructor(theName: string) {
    this.name = theName
  }

  public move(distanceInMeters: number) {
    console.log(`${this.name} moved ${distanceInMeters}m.`)
  }
}
```

### ECMAScript 中的私有域

从 TypeScript 3.8 开始, TypeScript 支持新的 JavaScript 私有域语法:

```ts
class Animal {
  #name: string
  constructor(theName: string) {
    this.#name = theName
  }
}

new Animal('Cat').#name
// 属性 "#name" 在类 "Animal" 外部不可访问，因为它具有私有标识符
```

该语法内置在 JavaScript 运行时中，可以更好地保证每个私有字段的隔离。 现在，关于这些私有字段的最佳文档在 TypeScript 3.8 [发行说明](https://devblogs.microsoft.com/typescript/announcing-typescript-3-8-beta/#ecmascript-private-fields)中。

### 理解 TypeScript 中的 private

TypeScript 也有自己的方式来声明一个成员为`private`，使其不能从其包含的类之外被访问。例如:

```ts
class Animal {
  private name: string

  constructor(theName: string) {
    this.name = theName
  }
}

new Animal('Cat').name
// 属性“name”为私有属性，只能在类“Animal”中访问
```

TypeScript 是一种结构类型系统。 当我们比较两种不同的类型时，无论它们来自何处，如果所有成员的类型都是兼容的，那么我们就说这些类型本身是兼容的。

但是，在比较具有`private`成员和`protected`成员的类型时，我们将以不同的方式对待这些类型。 对于被认为是兼容的两种类型，如果其中一种具有`private`成员，则另一种必须具有源自同一声明的`private`成员。
`protected`的成员也是如此。

让我们看一个例子，以更好地了解它在实践中如何发挥作用：

```ts
class Animal {
  private name: string
  constructor(theName: string) {
    this.name = theName
  }
}

class Rhino extends Animal {
  constructor() {
    super('Rhino')
  }
}

class Employee {
  private name: string
  constructor(theName: string) {
    this.name = theName
  }
}

let animal = new Animal('Goat')
let rhino = new Rhino()
let employee = new Employee('Bob')

animal = rhino
animal = employee
// 不能将类型“Employee”分配给类型“Animal”。
// 类型具有私有属性“name”的单独声明。
```

在这个例子中，我们有一个`Animal`和一个`Rhino`，`Rhino`是`Animal`的一个子类。我们还有一个新的类`Employee`，它在外形上看起来和`Animal`一样。我们创建一些这些类的实例，然后尝试将它们分配给对方，看看会发生什么。因为`Animal`和`Rhino`在`Animal`中通过相同的声明 `private name: string`来共享外形的`private`部分，所以它们是兼容的。然而，`Employee`的情况就不是这样了。当我们尝试将`Employee`赋值给`Animal`时，我们得到了一个错误，即这些类型不兼容。尽管`Employee`也有一个名为`name`的`private`成员，但它不是我们在`Animal`中声明的那个。

### 理解 protected

`protected`的修饰符与`private`修饰符的作用非常相似，但不同的是，声明`protected`的成员也可以在派生类中被访问。例如：

```ts
class Person {
  protected name: string
  constructor(name: string) {
    this.name = name
  }
}

class Employee extends Person {
  private department: string

  constructor(name: string, department: string) {
    super(name)
    this.department = department
  }

  public getElevatorPitch() {
    return `Hello, my name is ${this.name} and I work in ${this.department}.`
  }
}

let howard = new Employee('Howard', 'Sales')
console.log(howard.getElevatorPitch())
console.log(howard.name)
// 属性“name”受保护，只能在类“Person”及其子类中访问
```

请注意，虽然我们不能在`Person`的外部使用`name`，但我们仍然可以在`Employee`的实例方法中使用它，因为`Employee`派生自`Person`。

构造函数也可以被标记为`protected`，这意味着该类不能在其包含的类之外被实例化。这意味着这个类不能在其包含的类之外被实例化，但可以被扩展。例如:

```ts
class Person {
  protected name: string
  protected constructor(theName: string) {
    this.name = theName
  }
}

// Employee 能扩展 Person
class Employee extends Person {
  private department: string

  constructor(name: string, department: string) {
    super(name)
    this.department = department
  }

  public getElevatorPitch() {
    return `Hello, my name is ${this.name} and I work in ${this.department}.`
  }
}

let howard = new Employee('Howard', 'Sales')
let john = new Person('John')
// 类“Person”的构造函数是受保护的，仅可在类声明中访问
```

## Readonly 修饰符

你可以通过使用`readonly`关键字使属性成为只读。只读属性必须在其声明或构造函数中初始化。

```ts
class Octopus {
  readonly name: string
  readonly numberOfLegs: number = 8

  constructor(theName: string) {
    this.name = theName
  }
}

let dad = new Octopus('Man with the 8 strong legs')
dad.name = 'Man with the 3-piece suit'
// 无法分配到 "name" ，因为它是只读属性
```

## 参数属性

在上一个例子中，我们必须在`Octopus`类中声明一个只读成员`name`和一个构造函数参数`theName`。这样做的目的是为了在执行`Octopus`构造函数后能够访问`theName`的值。_参数属性_ 可以让你在一个地方创建和初始化一个成员。下面是对之前的`Octopus`类使用参数属性的进一步修改。

```ts
class Octopus {
  readonly numberOfLegs: number = 8
  constructor(readonly name: string) {}
}

let dad = new Octopus('Man with the 8 strong legs')
dad.name
```

请注意，我们完全放弃了`theName`，只在构造函数中使用简写`readonly name: string`参数来创建和初始化`name`成员。我们已经将声明和赋值合并到一个位置。

参数属性的声明是通过在构造函数参数前加上可访问性修饰符或`readonly`，或两者兼而有之。对参数属性使用`private`声明并初始化一个私有成员；同样，对`public`、`protected`和`readonly`也是如此。

## 访问器

TypeScript 支持 getters/setters 作为拦截对对象成员的访问的一种方式。这为你提供了一种对每个对象上的成员如何被访问进行更精细控制的方法。

让我们转换一个简单的类来使用`get`和`set`。首先，让我们从一个没有 getter 和 setter 的例子开始。

```ts
class Employee {
  fullName: string
}

let employee = new Employee()
employee.fullName = 'Bob Smith'

if (employee.fullName) {
  console.log(employee.fullName)
}
```

虽然允许人们直接随机设置`fullName`是非常方便的，但我们可能也希望在设置`fullName`时强制执行一些约束。

在这个版本中，我们添加了一个 setter，检查`newName`的长度，以确保它与我们支持数据库字段的最大长度兼容。如果不兼容，我们就会抛出一个错误，通知客户端代码出了问题。

为了保留现有的功能，我们还添加了一个简单的 getter，可以不加修改地检索`fullName`。

```ts
const fullNameMaxLength = 10

class Employee {
  private _fullName: string = ''

  get fullName(): string {
    return this._fullName
  }

  set fullName(newName: string) {
    if (newName && newName.length > fullNameMaxLength) {
      throw new Error('fullName has a max length of ' + fullNameMaxLength)
    }

    this._fullName = newName
  }
}

let employee = new Employee()
employee.fullName = 'Bob Smith'

if (employee.fullName) {
  console.log(employee.fullName)
}
```

为了证明我们的访问器现在正在检查值的长度，我们可以尝试分配一个超过 10 个字符的`name`，并验证我们是否得到一个错误。

关于访问器，有几件事需要注意。

首先，访问器要求你将编译器设置为输出 ECMAScript 5 或更高版本。不支持降级到 ECMAScript 3。
第二，有`get`但没有`set`的访问器会被自动推断为`readonly`。这在从你的代码中生成`.d.ts`文件时很有帮助，因为你的属性的用户可以看到他们不能改变它。

## 静态成员属性

到目前为止，我们只谈到了类的 _实例_ 成员，即那些在实例化时显示在对象上的成员。我们也可以创建类的 _静态_ 成员，那些在类本身而不是在实例上可见的成员。在这个例子中，我们在`origin`上使用 _静态_ 成员 ，因为它是所有`grids`的通用值。每个实例通过前置类的名称来访问这个值。类似于在实例访问时前置`this.`，这里我们在静态属性访问前面预置`Grid.`。

```ts
class Grid {
  static origin = { x: 0, y: 0 }

  calculateDistanceFromOrigin(point: { x: number; y: number }) {
    let xDist = point.x - Grid.origin.x
    let yDist = point.y - Grid.origin.y
    return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale
  }

  constructor(public scale: number) {}
}

let grid1 = new Grid(1.0) // 1x scale
let grid2 = new Grid(5.0) // 5x scale

console.log(grid1.calculateDistanceFromOrigin({ x: 10, y: 10 }))
console.log(grid2.calculateDistanceFromOrigin({ x: 10, y: 10 }))
```

## 抽象类

抽象类是基类，其他类可以从这些基类中派生出来。它们不能直接被实例化。与接口不同，抽象类可以包含其成员的实现细节。`abstract`关键字用于定义抽象类以及抽象类中的抽象方法。

```ts
abstract class Animal {
  abstract makeSound(): void

  move(): void {
    console.log('roaming the earth...')
  }
}
```

抽象类中被标记为抽象的方法不包含实现，必须在派生类中实现。抽象方法与接口方法有着相似的语法。两者都定义了一个方法的签名，而不包含方法主体。但是，抽象方法必须包含`abstract`关键字，并且可以选择性地包含访问修饰符。

```ts
abstract class Department {
  constructor(public name: string) {}

  printName(): void {
    console.log('Department name: ' + this.name)
  }

  abstract printMeeting(): void // 必须在派生类中实现
}

class AccountingDepartment extends Department {
  constructor() {
    super('Accounting and Auditing') // 派生类中的构造函数必须调用super()
  }

  printMeeting(): void {
    console.log('The Accounting Department meets each Monday at 10am.')
  }

  generateReports(): void {
    console.log('Generating accounting reports...')
  }
}

let department: Department // 可以创建对抽象类型的引用
department = new Department() // 错误：无法创建抽象类的实例
// 错误：无法创建抽象类的实例
department = new AccountingDepartment() // 可以创建和分配一个非抽象子类
department.printName()
department.printMeeting()
department.generateReports() // 错误：department不是AccountingDepartment类型，无法访问generateReports
// 类型“Department”上不存在属性“generateReports”。
```

## 进阶技巧

### 构造函数

当你在 TypeScript 中声明一个类时，实际上是在同时创建多个声明。第一个是类的 _实例_ 的类型。

```ts
class Greeter {
  greeting: string

  constructor(message: string) {
    this.greeting = message
  }

  greet() {
    return 'Hello, ' + this.greeting
  }
}

let greeter: Greeter
greeter = new Greeter('world')
console.log(greeter.greet()) // "Hello, world"
```

这里，当我们说`let greeter: Greeter`, 我们使用`Greeter`作为`Greeter`类的实例类型。这对于来自其他面向对象语言的程序员来说几乎是第二天性。

我们还在创建另一个值，我们称之为 _构造函数_。当我们`new`类的实例时，就会调用这个函数。要想知道这在实践中是什么样子的，让我们来看看上面的例子所创建的 JavaScript。

```js
let Greeter = (function () {
  function Greeter(message) {
    this.greeting = message
  }

  Greeter.prototype.greet = function () {
    return 'Hello, ' + this.greeting
  }

  return Greeter
})()

let greeter
greeter = new Greeter('world')
console.log(greeter.greet()) // "Hello, world"
```

这里，`let Greeter`将被分配给构造函数。当我们使用`new`调用这个函数时，我们会得到一个类的实例。构造函数还包含了类的所有静态成员。另一种思路是，每个类都有一个 _实例_ 端和一个 _静态_ 端。

让我们修改一下这个例子来显示这种区别。

```ts
class Greeter {
  static standardGreeting = 'Hello, there'
  greeting: string
  greet() {
    if (this.greeting) {
      return 'Hello, ' + this.greeting
    } else {
      return Greeter.standardGreeting
    }
  }
}

let greeter1: Greeter
greeter1 = new Greeter()
console.log(greeter1.greet()) // "Hello, there"

let greeterMaker: typeof Greeter = Greeter
greeterMaker.standardGreeting = 'Hey there!'

let greeter2: Greeter = new greeterMaker()
console.log(greeter2.greet()) // "Hey there!"

let greeter3: Greeter
greeter3 = new Greeter()
console.log(greeter3.greet()) // "Hey there!"
```

在这个例子中，`greeter1`的工作原理与之前类似。我们实例化`Greeter`类，并使用这个对象。这个我们之前已经看到了。

接下来，我们就直接使用这个类。在这里，我们创建一个新的叫做`greeterMaker`的变量。
这个变量将存放类本身，或者说它的构造函数。这里我们使用`typeof Greeter`，也就是"给我`Greeter`类本身的类型"，而不是实例类型。
或者更准确的说，"给我一个叫做`Greeter`的符号类型"，也就是构造函数的类型。
这个类型将包含`Greeter`的所有静态成员以及创建`Greeter`类实例的构造函数。
我们通过在`greeterMaker`上使用`new`，创建新的`Greeter`实例并像之前一样调用它们来展示。
还有一点值得一提的是，不赞成直接更改静态属性，这里`greeter3`的`standardGreeting`为`"Hey there"`而不是`"Hello, there"`。

## 使用类作为接口

正如我们在上一节中所说，一个类声明会创建两样东西：一个代表类的实例的类型和一个构造函数。因为类创建了类型，所以你可以在与使用接口相同的地方使用它们。

```ts
class Point {
  x: number
  y: number
}

interface Point3d extends Point {
  z: number
}

let point3d: Point3d = { x: 1, y: 2, z: 3 }
```

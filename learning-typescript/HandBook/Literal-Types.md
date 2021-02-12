# 字面量类型

> 原文链接：<https://www.typescriptlang.org/docs/handbook/literal-types.html>

字面量是类型集合中一种更具体的子类型。这意味着类型系统中`Hello World`是一个`string`，但是一个`string`并不是`Hello World`

## 字面量窄化(Narrowing)

当你通过`var`或`let`声明一个变量时，你告诉编译器这个变量有可能会改变它的内容。相反，使用`const`来声明一个变量将告知 TypeScript 这个对象永远不会改变。

```ts
// 我们通过使用const来确保此变量helloWorld永远不会更改
// 所以，TypeScript将他的类型设置为"Hello World"，而不是string。
const helloWorld = 'hello world'

// 另一方面，一个let声明的变量可以改变，所以编译器将它声明为一个string。
let hiWorld = 'hi World'
```

从无限数量的潜在情况（有无限数量的可能的字符串值）到一个较小的、有限数量的潜在情况（比如上面的`helloWorld`的可能值数量为 1）的过程被称为窄化

## 字符串字面量类型

在实践中，字符串字面量类型与联合类型、类型保护和类型别名结合得很好。你可以将这些特性结合起来使用，以获得类似于枚举的行为。

```ts
type Easing = 'ease-in' | 'ease-out' | 'ease-in-out'

class UIElement {
  animate(dx: number, dy: number, easing: Easing) {
    if (easing === 'ease-in') {
      // ...
    } else if (easing === 'ease-out') {
    } else if (easing === 'ease-in-out') {
    } else {
      // 可能有人可以通过忽略你的类型来达到此目的(分支)
    }
  }
}

let button = new UIElement()
button.animate(0, 0, 'ease-in')
// 类型“"uneasy"”的参数不能赋给类型“Easing”的参数
button.animate(0, 0, 'uneasy')
```

你可以传入三个允许的字符串中的任何一个，但任何其他字符串都会报错

字符串字面量类型可以用同样的方式来区分重载

```ts
function createElement(tagName: 'img'): HTMLImageElement
function createElement(tagName: 'input'): HTMLInputElement
function createElement(tagNmae: string): Element {
  // ...
}
```

## 数值字面量类型

TypeScript 也有数值字面量类型，其作用与上面的字符串字面量类型相同。

```ts
function rollDice(): 1 | 2 | 3 | 4 | 5 | 6 {
  return (Math.floor(Math.random() * 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6
}

const result = rollDice()
```

它们的一个常见用法是描述配置值：

```ts
interface MapConfig {
  lng: number
  lat: number
  tileSize: 8 | 16 | 32
}

function setupMap(mapConfig: MapConfig) {}

setupMap({ lng: 1, lat: 1, tileSize: 16 })
```

## 布尔字面量类型

TypeScript 也具有布尔文字类型。你可以使用它们来约束属性相互关联的对象值

```ts
interface ValidateSuccess {
  isValid: true
  reason: null
}

interface ValidateFailure {
  isValid: false
  reason: string
}

type ValidateResult = ValidateSuccess | ValidateFailure
```

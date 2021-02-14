# 联合(并集)与交集类型

到目前为止，这本手册已经涵盖了作为原子对象的类型。然而，当你建立更多类型的模型时，你会发现自己正在寻找一些可以让你组成或组合现有类型的工具，而不是从头开始创建它们。

交集类型和联合类型是你可以组合类型的方法之一。

## 联合类型

偶尔，你会遇到一个期望参数是`number`或`string`的库。例如，使用下面的函数：

```ts
/**
 * 取一个string并在左侧添加"padding"。
 * 如果"padding"是string，则"padding"会附加到左侧。
 * 如果"padding"是一个number，那么该数量的空格将添加到左侧。
 */
function padLeft(value: string, padding: any) {
  if (typeof padding === 'number') {
    return Array(padding + 1).join(' ') + value
  }
  if (typeof padding === 'string') {
    return padding + value
  }
  throw new Error(`Expected string or number, got '${typeof padding}'.`)
}

padLeft('Hello world', 4) // returns "    Hello world"
```

在上面的例子中，`padLeft`的问题是它的`padding`参数的类型为`any`。这意味着，我们可以用一个既不是`number`也不是`string`的参数来调用它，且 TypeScript 会接受它。

```ts
// 编译时通过，运行时错误
let indentedString = padLeft('Hello world', true)
```

在传统的面向对象代码中，我们可能会通过创建一个类型的层次结构来抽象这两种类型。虽然这样做更加明确，但也有点矫枉过正。`padLeft`最初版本的一个好处是，我们可以只传入基本类型。这意味着使用起来简单而简洁。如果我们只是想使用一个已经存在于其它地方的函数，这种新方法也不会有什么帮助。

我们可以使用一个 _联合类型_ 来代替`any`作为`padding`参数。

```ts
function padLeft(value: string, padding: string | number) {
  // ...
}

// 类型“boolean”的参数不能赋给类型“string | number”的参数
let indentedString = padLeft('Hello world', true)
```

联合类型描述了一个可以是几种类型之一的值。我们用竖线(`|`)来分隔每一种类型，所以`number` | `string` | `boolean`是一个值的类型，它可以是一个`number`、一个`string`或一个`boolean`。

## 联合与共有域

如果我们拥有一个联合类型的值，那么我们只能访问联合中所有类型共用的成员。

```ts
interface Bird {
  fly(): void
  layEggs(): void
}

interface Fish {
  swim(): void
  layEggs(): void
}

declare function getSmallPet(): Fish | Bird

let pet = getSmallPet()
pet.layEggs()

// 类型“Bird | Fish”上不存在属性“swim”。
// 类型“Bird”上不存在属性“swim”。
pet.swim()
```

联合类型在这里可能有点棘手，但只需要一点直觉就能习惯。如果一个值的类型是`A | B`，我们只能 _确定_ 它有`A`和`B`都有的成员。在这个例子中，`Bird`有一个名为`fly`的成员。我们不能确定一个类型为`Bird | Fish`的变量是否有`fly`方法。如果这个变量在运行时其实是`Fish`，那么调用`pet.fly()`就会失败。

## 联合判别(Discriminating Unions)

一个常用的联合技巧是有一个使用字面量类型的单一字段，你可以用它来让 TypeScript 缩小可能的当前类型。例如，我们要创建一个由三个类型组成的联合，它们有一个共享字段。

```ts
type NetworkLoadingState = {
  state: 'loading'
}

type NetworkFailedState = {
  state: 'failed'
  code: number
}

type NetworkSuccessState = {
  state: 'success'
  response: {
    title: string
    duration: number
    summary: string
  }
}

// 创建一个只代表上述类型之一的类型，但你还不确定是哪种类型。
type NetworkState = NetworkLoadingState | NetworkFailedState | NetworkSuccessState
```

以上所有类型都有一个名为`state`的字段，然后它们也有自己的字段：

| NetworkLoadingState | NetworkFailedState | NetworkSuccessState |
| ------------------- | ------------------ | ------------------- |
| state               | state              | state               |
|                     | code               | response            |

鉴于`state`字段为`NetworkState`内部的每种类型所共用，因此无需进行存在检查即可安全地访问代码。

使用`state`作为字面量类型，你可以将`state`的值与等效字符串进行比较，TypeScript 会知道当前使用的是哪种类型。

| NetworkLoadingState | NetworkFailedState | NetworkSuccessState |
| ------------------- | ------------------ | ------------------- |
| 'loading'           | 'failed'           | 'success'           |

在这种情况下，可以使用`switch`语句来缩小运行时表示的类型：

```ts
function logger(state: NetworkState): string {
  // 现在TypeScript还不知道这三种潜在类型中的哪一种是可能的

  // 尝试访问未在所有类型之间共享的属性会引发错误
  state.code
  // 类型“NetworkState”上不存在属性“code”。
  // 类型“NetworkLoadingState”上不存在属性“code”。

  // 通过switching on state，TypeScript可以在代码流分析中缩小联合的范围。
  switch (state.state) {
    case 'loading':
      return 'Downloading...'
    case 'failed':
      // 这里的类型肯定是NetworkFailedState，因此访问`code`字段是安全的
      return `Error ${state.code} downloading`
    case 'success':
      return `Downloaded ${state.response.title} - ${state.response.summary}`
  }
}
```

## 联合穷尽性检查

我们希望编译器能在我们没有覆盖所有可判别联合的变体时告诉我们。例如，如果我们将`NetworkFromCachedState`添加到`NetworkState`中，我们也需要更新`logger`。

```ts
type NetworkFromCachedState = {
  state: 'from_cache'
  id: string
  response: NetworkSuccessState['response']
}

type NetworkState = NetworkLoadingState | NetworkFailedState | NetworkSuccessState | NetworkFromCachedState

function logger(s: NetworkState) {
  switch (s.state) {
    case 'loading':
      return 'loading request'
    case 'failed':
      return `failed with code ${s.code}`
    case 'success':
      return 'got response'
  }
}
```

有两种方法可以做到这一点。第一种是打开`--strictNullChecks`并指定返回类型：

```ts
// 函数缺少结束 return 语句，返回类型不包括 "undefined"。
function logger(s: NetworkState): string {
  switch (s.state) {
    case 'loading':
      return 'loading request'
    case 'failed':
      return `failed with code ${s.code}`
    case 'success':
      return 'got response'
  }
}
```

因为`switch`不再是详尽的，TypeScript 意识到该函数有时可能返回`undefined`。如果你有一个显式的返回类型`string`，那么你会得到一个错误，返回类型实际上是`string | undefined`。然而，这个方法是相当微妙的，此外，`--strictNullChecks`并不总是对旧代码有效。

第二种方法使用编译器用来检查穷尽性的`never`类型：

```ts
function assertNever(x: never): never {
  throw new Error('Unexpected object: ' + x)
}

function logger(s: NetworkState): string {
  switch (s.state) {
    case 'loading':
      return 'loading request'
    case 'failed':
      return `failed with code ${s.code}`
    case 'success':
      return 'got response'
    default:
      // 类型“NetworkFromCachedState”的参数不能赋给类型“never”的参数。
      return assertNever(s)
  }
}
```

在这里，`assertNever`检查`s`是否属于`never`类型-即所有其他情况被删除后剩下的类型。如果你忘记了一个 case，那么`s`将有一个真正的类型，你将得到一个类型错误。这个方法需要你定义一个额外的函数，但是当你忘记它的时候错误会更加明显，因为错误信息中包含了丢失的类型名称。

## 交集类型

交集类型与联合类型密切相关，但它们的使用方式非常不同。交集类型将多个类型合并为一个类型。这允许你将现有的类型添加到一起，以获得一个具有你所需要的所有功能的单一类型。例如，`Person & Serializable & Loggable`就是一个集`Person` _和_ `Serializable` _以及_ `Loggable`于一身的类型。这意味着这个类型的对象将拥有这三种类型的所有成员。

例如，如果你的网络请求具有一致的错误处理，那么你可以将错误处理分离出来，变成自己的类型，而这个类型与对应单一响应类型的类型合并。

```ts
interface ErrorHandling {
  success: boolean
  error?: { message: string }
}

interface ArtworksData {
  artworks: { title: string }[]
}

interface ArtistsData {
  artists: { name: string }[]
}

// 组合这些接口是为了有一致的错误处理和自己的数据。

type ArtworksResponse = ArtworksData & ErrorHandling
type ArtistsResponse = ArtistsData & ErrorHandling

const handleArtistsResponse = (response: ArtistsResponse) => {
  if (response.error) {
    console.error(response.error.message)
    return
  }

  console.log(response.artists)
}
```

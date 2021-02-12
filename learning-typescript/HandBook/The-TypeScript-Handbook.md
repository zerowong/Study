# TypeScript 手册

> 原文链接: <https://www.typescriptlang.org/docs/handbook/intro.html>

## 关于本手册

在进入编程社区 20 多年后，JavaScript 现已成为有史以来最广泛的跨平台语言之一。起初，JavaScript 只是一种为网页添加微不足道的交互性的小型脚本语言，现在已经成长为各种规模的前端和后端应用的首选语言。虽然用 JavaScript 编写的程序的大小、范围和复杂度都成倍增长，但 JavaScript 语言表达不同代码单元之间关系的能力却没有增长。再加上 JavaScript 相当奇特的运行时语义，这种语言和程序复杂度之间的不匹配，使得规模化管理 JavaScript 开发成为难题。

程序员写出的最常见的错误种类可以描述为类型错误：在预期的不同类型的值的地方使用了某种值。这可能是由于简单的拼写错误，未能理解库的 API 的使用，对运行时行为的错误假设，或其它错误。TypeScript 的目标是成为 JavaScript 程序的静态类型检查器-换句话说，一个在你的代码运行之前运行的工具（静态），并确保程序的类型是正确的（typechecked）。

如果你是在没有 JavaScript 背景的情况下接触 TypeScript，并打算将 TypeScript 作为你的第一门语言，我们建议你先从 [Mozilla Web Docs](https://developer.mozilla.org/docs/Web/JavaScript/Guide) 的 JavaScript 文档开始阅读。如果你有其他语言的经验，你应该能够通过阅读手册很快地掌握 JavaScript 语法。

## 这本手册的结构是怎样的

手册分为两部分：

- **手册**

  《TypeScript 手册》旨在成为向程序员解释 TypeScript 的全面文档。 你可以在左侧导航栏中从上至下阅读手册

  你应该期望每一章或每一页都能为你提供对给定概念的深刻理解。《TypeScript 手册》并不是一个完整的语言规范，但旨在作为该语言所有功能和行为的全面指南

  通读手册后的读者应该能够：

  - 阅读并理解常用的 TypeScript 语法和模式。
  - 解释重要编译器选项的效果
  - 在多数情况下，正确地预测类型系统行为。
  - 为一个简单的函数、对象或类写一个.d.ts 声明

  为了简洁明了，本手册的主要内容不会探讨所涵盖的每一个边缘案例或细枝末节的功能。你可以在参考文章中找到更多关于特定概念的细节

- **手册参考**

  该手册参考旨在提供对 TypeScript 特定部分如何工作的更丰富的理解。 你可以从上至下阅读，但每个部分的目的都是提供对单个概念的更深入的说明-意味着你的阅读方式可以是跳跃的

## 需求

该手册还旨在成为简洁的文档，可以在几个小时内轻松阅读。为了简短起见，将不涉及某些主题。

具体来说，该手册没有完全介绍诸如函数，类和闭包之类的 JavaScript 核心基础知识。在适当的地方，我们将提供指向背景阅读的链接，你可以用来阅读这些概念。

该手册也不能替代语言规范。在某些情况下，将跳过对一些极端情况或行为的形式描述，而转而使用高级，易于理解的解释。取而代之的是，有单独的参考页，它们可以更准确，更正式地描述 TypeScript 行为的许多方面。参考页不适合不熟悉 TypeScript 的读者使用，因此它们可能使用高级术语或你尚未阅读的参考主题。

最后，在非必要的情况下，该手册将不会介绍 TypeScript 与其他工具的交互方式。像如何使用 Webpack，rollup，parcel，react，babel，closure，lerna，rush，bazel，preact，vue，angular，svelte，jquery，yarn 或 npm 配置 TypeScript 这些主题都不在手册范围内-你可以在在网上其他地方找到这些资源。

# 入门

在开始阅读[Basic Types]之前，我们建议你阅读以下介绍性页面之一。 这些介绍旨在强调 TypeScript 与你喜欢的编程语言之间的主要异同，并消除针对这些语言的常见误解。

- [TypeScript for New Programmers](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)
- [TypeScript for JavaScript Programmers]
- [TypeScript for OOP Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-oop.html)
- [TypeScript for Functional Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html)

[basic types]: ./Basic-Types.md
[typescript for javascript programmers]: ./TS-for-JS-Programmers.md

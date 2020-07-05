---
title: this指向和render性能优化
date: 2019-12-20 17:52:52
tags:
	- 框架
	- 笔记
	- 知识点
categories: React
---

##   this指向问题

> 在ES6模块化代码中，全局this的默认指向是undefined  

```js
render () {
    return (
      <div>
        <h1>Hello</h1>
        <button onClick={ this.handleClick }>点我</button>
      </div>
    )
  }
handleClick () {
    console.log(this) // 输出Undefined
  }
```

> onClick 并不是onclick原生点击事件，它只是一个写在虚拟DOM中的一个属性

> 所以，为了解决这类的问题，提出了 4 种解决方案

###  一 ，直接在表达式后面使用 bind()返回一个新的函数 改变 this的指向

```jsx
<button onClick={ this.handleClick.bind(this) }>点我</button>
```

###  二，在构造函数中提前进行 bind 操作

```jsx
constructor () {
    super()
    this.handleClick = this.handleClick.bind(this)
}
render () {
    return (
      <div>
        <h1>Hello</h1>
        <button onClick={ this.handleClick }>点我</button>
      </div>
    )
  }
```

###  三，使用箭头函数来作为事件处理函数，然后在箭头函数中调用最终的函数

```jsx
<button onClick={ () => {
        this.handleClick()
    } }>点我</button>
```

### 四，使用 public class filed 新语法。并将函数写成箭头函数的形式

```jsx
  render () {
    return (
      <div>
        <h1>Hello</h1>
        <button onClick={ this.handleClick }>点我</button>
      </div>
    )
  }
  handleClick = () => {
    console.log(this)
  }
```

## render性能优化问题

> 父组件一旦render 子组件一定会render

> 为了节省性能,父组件render的时候,子组件没有更新必要的时候,就应该让子组件不render

### 解决方法

让子组件继承 PureComponent 基础组件

```jsx
class Hello extends React.PureComponent {}
```

使用这种性能优化后,推荐使用下面两种 this 指向问题的解决方案

1. 在构造函数进行this指向的处理
2. public class filed 新语法的方式
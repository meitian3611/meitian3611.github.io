---
title: React虚拟DOM和组件
date: 2019-12-18 20:40:02
tags:
	- 笔记
	- 知识点
	- 组件
categories: React
---

## 虚拟DOM

> React 的 高效主要是体现在DOM上，在渲染新的元素的时候生成新的虚拟DOM元素和上次的虚拟DOM进行比较（diff算法）得出最小的修改点，然后用最小的代价进行DOM修改

![示例]( https://www.reactjscn.com/granular-dom-updates-c158617ed7cc0eac8f58330e49e48224.gif )

## 函数组件（无状态组件）

> 有无状态是指有无 state 数据（这个 state 数据，可以看成是 vue 中的 data）

> 函数组件的 props 数据发生变化，会引起 函数组件的重新调用

1. 函数名就是组件的名字首字母需要大写
2. 函数体需要返回一段 JSX 代码 这段代码就是组件的模板的内容
3. 函数接收一个 props 的参数，是一个对象，存放的是调用这个组件时在组件标签上定义的属性

```js
import React from 'react'
import ReactDom from 'react-dom'
// 定义组件
const Hello = () => {
  return (
    < div >
      <h1> hello 我是一个组件</h1>
      <World></World>
    </div >
  )
}
const World = () => {
  return (
    <div>
      <h1>我是一个子组件</h1>
    </div>
  )
}
// 利用组件进行页面渲染
ReactDom.render(
  <div>
    <Hello></Hello>
  </div>,
  document.getElementById('root')
)
```

## 类组件（有状态组件）

> 类组件的 state 或者 props 数据发生变化，会引起 类组件的 render 方法重新调用，也就是更新页面

1. 类的名字就是组件的名字，首字母需要大写
2. 类组件必须继承 React.Component 这个基础组件
3. 类组件必须要提供一个 render 函数，render 函数的返回值就是组件的模板内容
4.  类实例的 props 属性，就是 props 数据
5. 在构造函数中，初始化 state

```js
import React, { Component } from 'react' // 引入组件
import ReactDOM from 'react-dom'
class Hello extends Component {
    // 接收传递的信息
    constructor(props) {
        // 提供了构造函数，就必须要在最前面调用super()
        super()
        // 初始化 state
        this.state = {
            msg: '我是state'
        }
    }
    onClick () {
        this.setState({
            msg; '我已经被 button 修改了'
        })
    }
    render () {
        return (
        <div>
            <h1>hello 我是{name}</h1>    {/**接收调用者的传值并发送给props */}
    		<p>{msg}</p>
			{/**通过 bind 返回一个新的函数改变 this的指向 */}
		<button onClick={this.onClick.bind(this)}>点击修改msg</button>		
	)
  }
}
// 组件的调用并传值
ReactDOM.render(
  <div>
    <Hello name="类组件"></Hello>
  </div>,
  document.getElementById('root')
)
```

> 需要注意几点：
>
> 1. 使用 constructor接收 props 一定要在函数第一行调用 super()
> 2. onClick 点击事件一定要用驼峰写法
> 3. 必须要用 bind() 改变this 的指向，否则 this 是 undefined
> 4. 改变 state 值时，不可以使用 this.state ，需要使用 this.setState才能修改

![示例](https://i.loli.net/2019/12/18/G3c2SU84FkyuC1D.png)

##  React 组件 与 Vue 组件的不同之处

1.  Vue 有全局组件的概念，而 React 没有，任何文件需要使用哪个组件，就需要在这个文件中引入这个组件。
2.  Vue 组件需要注册，Vue.component() 全局注册，或者 components 来局部注册 而 React 组件不需要注册
3.  Vue 组件不需要考虑大小写。而 React 组件的首字母一定要大写
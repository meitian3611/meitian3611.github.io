---
title: React脚手架和JSX语法
date: 2019-12-18 20:41:35
tags:
	- 脚手架
	- 笔记
	- 知识点
categories: React
---

## React搭建

> 脚手架的使用

### 创建项目

> npx create-react-app 项目名字   ||    yarn create react-app 项目的名字

### 开发

> npm start  ||  yarn start   

### 打包上线

> npm run build || yarn build

### 测试

> npm run test || yarn test

### 封印解除

> npm run eject || yarn eject  可以修改webpack配置

## JSX语法

>  SX 将 HTML 语法直接加入到 JavaScript 代码中，再通过翻译器转换成 **纯JavaScript** 。在实际开发中，JSX 在产品打包阶段都已经编译成 纯JavaScript 了，不会带来副作用，反而让代码更加直观并易于维护。

>  JSX 的官方定义是 **类XML语法的ECMAScript扩展**。它完美地利用了 JavaScript 自带的语法和特性。并使用大家熟悉的HTML语法来创建虚拟元素。  

```js
// 引入 react
import React, { Fragment } from "react"
// 引入 ReactDom
import ReactDom from "react-dom"
// 需要使用 ReactDom.render() 渲染挂载点
const msg = "msg的使用"
ReactDom.render(
  <Fragment>
    <h1 className="abc" style={{ color: "blue" }}>
      {msg}
    </h1>
    <p title={msg}>{msg}</p>
  </Fragment>,
  document.getElementById("root")
)
```

## jsx的特征

 单个根元素

```js
  <Fragment></Fragment>
```

 单标签必须闭合，比如 

```js
 <br /> <img /> <input />
```

 img标签必须要含有 alt 属性
 普通标签都是小写字母，组件标签首字母需要大写
 class 需要写成 className 

```js
 <p className="abc"></p>
```

 for 需要 写成 htmlFor

```js
 <label htmlFor="id">hello</label>
```

 style属性要写成对象的形式

```js
 <p style={{color: 'red'}}> hello </p>
```

**jsx就是个语法糖，其实就是 React.createElement()方法的调用**

```js
ReactDOM.render(
  <Fragment>
    <div>123</div>
  </Fragment>,
  document.getElementById('root')
)
```


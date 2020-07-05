---
title: Redux
date: 2019-12-25 09:51:19
tags:
	- 核心
	- 框架
	- 笔记
categories: React
---

## 简介

> Redux 是 javascript 状态管理器，和 Vuex 相似，但又不同于 Vuex

## 安装

> 1. npm install --save redux  ||   yarn add redux
> 2. 创建 src/store/index.js 用来实例化仓库

```jsx
/** src/store/index.js **/
// 1. 引入 redux 的 createStore 方法
import { createStore } from 'redux'
// 2. 定义 renducer 纯函数
const reducer = () => {
    console.log('reducer')
}
// 3. 调用 createStore() 传入 reducer 函数 并设置 redux devtools 插件
const store = createStore(
    reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
// 4. 导出仓库的实例对象
export default store
```



## Redux的三大原则

- **单个数据源**  整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在唯一的store中
- **state 是只读的**  唯一改变 state 的方法就是触发 action ，action是一个用于描述已发生事件的普通对象
- **使用纯函数来执行修改**  为了描述 action 如何改变 state tree ，你需要编写 reducers

> 纯函数
>
> 1. 不会修改参数
> 2. 会自动接收上一次仓库的 state  action数据
> 3. 默认自动触发一次
> 4. 一定要返回，返回的内容就是仓库的最新 state 数据

## Action

一个用于描述要做什么动作的普通对象

```js
{
    type: 'ADD_TODO', // type字段必须
    text: '吃饭'
}
```

## Reducer

根据 Action 动作的不同，对仓库的数据进行处理的一个**纯函数**

```jsx
const todoApp = (state,action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                {
                    id: action.id,
                    text: action.text,
                    completed: fasle
                }
            ]
            dafault:
            return state
    }
}
```

## Store

仓库，存放状态（state）将 action 和reducers 联系起来的东西

- getState() 方法 可以获取 state
- dispatch(action) 方法可以更新state
- subscribe(listener) 注册监听器  返回的函数可以注销监听器

## react-redux

### 安装

```bash
npm install --save react-redux || yarn add react-redux
```

> 不需要在所有的组件文件引入 store 了，入口文件引入一次并通过 react-redux 的 Provider 组件传递进入
>
> 仓库数据发生变化，不需要我们手动监听和取消监听了

```jsx
//------ src/index.js --------
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import store from './store'
import App from './App'
ReactDOM.render(
  <Provider store={store}>
      <App />
  </Provider>, 
  document.getElementById('root')
)
```

> 哪个组件需要使用仓库的数据，就用 react-redux 的 connect() 高阶函数对哪个组件进行包装。
>
> 返回的是一个容器组件  connect(mapStateToProps, mapDispatchToProps) (UI组件)

### mapStateToProps(state, ownProps) 

处理仓库的 state 数据给到 UI组件的 props 上面

> 1. 是个函数，会自动接收到 仓库的 state 数据。
> 2. 需要返回一个对象，返回的对象就是 UI组件的 一部分 props 数据
> 3. 仓库的数据如果发生变化，这个函数会重新执行

### mapDispatchToProps(state, ownProps)

处理仓库的 dispatch 数据给到 UI组件的 props 上面

> 1. 是个函数，会自动接收到 仓库的 dispatch 方法
> 2. 需要返回一个对象，返回的对象就是 UI组件的 一部分 props 数据

```jsx
// ------  src/views/PageA.js
import React from 'react'
import { connect } from 'react-redux'  // 引入connect即可
export default connect(
	(state) => {},
	(dispatch) => {}
)(PageA)
```